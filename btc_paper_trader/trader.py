#!/usr/bin/env python3
"""
BTC Polymarket ペーパートレーダー
─────────────────────────────────
Polymarket の BTC UP/DOWN マーケットを5分ごとに監視し、
Claude が売買判断（BUY_YES / BUY_NO / SKIP）を出します。
実際の注文は出しません（ペーパートレードモード）。

使い方:
    python trader.py

必要な環境変数:
    ANTHROPIC_API_KEY   Anthropic API キー（必須）
"""

import os
import sys
import time
import json
import math
import random
import requests
from datetime import datetime, timezone, timedelta
from typing import Optional
from dataclasses import dataclass, field
from dotenv import load_dotenv
import anthropic

load_dotenv()

# ─────────────────────────────────────────────────────────────
# 設定
# ─────────────────────────────────────────────────────────────
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
CLAUDE_MODEL = "claude-opus-4-6"

GAMMA_API = "https://gamma-api.polymarket.com"
BINANCE_API = "https://api.binance.com/api/v3"
COINGECKO_API = "https://api.coingecko.com/api/v3"

CHECK_INTERVAL_SEC = 300    # 5分ごとにチェック
INITIAL_BALANCE = 1000.0    # 仮想残高 $1,000
BET_SIZE = 10.0             # 1トレードあたり $10
MAX_OPEN_POSITIONS = 5      # 同時保有ポジション上限
KLINE_COUNT = 12            # 直近12本の5分足（=1時間分）

REQUEST_TIMEOUT = 15        # HTTP タイムアウト（秒）


# ─────────────────────────────────────────────────────────────
# データクラス
# ─────────────────────────────────────────────────────────────
@dataclass
class Position:
    trade_id: int
    market_id: str
    question: str
    outcome: str          # "YES" or "NO"
    entry_price: float    # 0.0~1.0 のトークン価格
    bet_amount: float     # ベット金額 $
    shares: float         # 取得シェア数 = bet_amount / entry_price
    potential_payout: float  # 最大回収額 = shares * $1
    end_date: datetime
    entry_time: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = "open"  # open | won | lost | expired
    pnl: float = 0.0
    claude_reason: str = ""

    @property
    def is_resolved(self) -> bool:
        return datetime.now(timezone.utc) >= self.end_date

    @property
    def time_left(self) -> str:
        delta = self.end_date - datetime.now(timezone.utc)
        if delta.total_seconds() <= 0:
            return "EXPIRED"
        mins = int(delta.total_seconds() // 60)
        secs = int(delta.total_seconds() % 60)
        return f"{mins}m{secs:02d}s"


# ─────────────────────────────────────────────────────────────
# ペーパートレード状態
# ─────────────────────────────────────────────────────────────
class PaperPortfolio:
    def __init__(self):
        self.balance = INITIAL_BALANCE
        self.positions: list[Position] = []
        self.trade_counter = 0
        self.total_trades = 0
        self.wins = 0
        self.losses = 0
        self.total_pnl = 0.0

    def open_position(self, market_id: str, question: str, outcome: str,
                      entry_price: float, end_date: datetime, reason: str) -> Optional[Position]:
        if self.balance < BET_SIZE:
            print(f"  [SKIP] 残高不足: ${self.balance:.2f}")
            return None
        if len([p for p in self.positions if p.status == "open"]) >= MAX_OPEN_POSITIONS:
            print(f"  [SKIP] 最大ポジション数({MAX_OPEN_POSITIONS})に達しています")
            return None

        self.trade_counter += 1
        shares = BET_SIZE / entry_price
        payout = shares * 1.0  # 各シェアは $1 に解決

        pos = Position(
            trade_id=self.trade_counter,
            market_id=market_id,
            question=question,
            outcome=outcome,
            entry_price=entry_price,
            bet_amount=BET_SIZE,
            shares=shares,
            potential_payout=payout,
            end_date=end_date,
            claude_reason=reason,
        )
        self.positions.append(pos)
        self.balance -= BET_SIZE
        self.total_trades += 1
        return pos

    def settle_position(self, pos: Position, winning_outcome: str):
        """マーケット解決時に呼び出す（winning_outcome: "YES" or "NO"）"""
        if pos.outcome == winning_outcome:
            pos.pnl = pos.potential_payout - pos.bet_amount
            pos.status = "won"
            self.wins += 1
        else:
            pos.pnl = -pos.bet_amount
            pos.status = "lost"
            self.losses += 1
        self.balance += pos.bet_amount + pos.pnl
        self.total_pnl += pos.pnl

    @property
    def win_rate(self) -> float:
        resolved = self.wins + self.losses
        return (self.wins / resolved * 100) if resolved > 0 else 0.0

    @property
    def open_positions(self) -> list[Position]:
        return [p for p in self.positions if p.status == "open"]

    @property
    def closed_positions(self) -> list[Position]:
        return [p for p in self.positions if p.status != "open"]


# ─────────────────────────────────────────────────────────────
# 市場データ取得
# ─────────────────────────────────────────────────────────────
def get_btc_price() -> Optional[float]:
    """BTC/USDT 現在価格をBinanceから取得（失敗時はCoinGecko）"""
    # Binance
    try:
        r = requests.get(
            f"{BINANCE_API}/ticker/price",
            params={"symbol": "BTCUSDT"},
            timeout=REQUEST_TIMEOUT,
        )
        r.raise_for_status()
        return float(r.json()["price"])
    except Exception:
        pass

    # CoinGecko フォールバック
    try:
        r = requests.get(
            f"{COINGECKO_API}/simple/price",
            params={"ids": "bitcoin", "vs_currencies": "usd"},
            timeout=REQUEST_TIMEOUT,
        )
        r.raise_for_status()
        return float(r.json()["bitcoin"]["usd"])
    except Exception as e:
        print(f"  [WARN] BTC価格取得失敗: {e}")
        return None


def get_btc_klines(interval: str = "5m", limit: int = KLINE_COUNT) -> list[dict]:
    """BTC 5分足ローソク足データを取得"""
    try:
        r = requests.get(
            f"{BINANCE_API}/klines",
            params={"symbol": "BTCUSDT", "interval": interval, "limit": limit},
            timeout=REQUEST_TIMEOUT,
        )
        r.raise_for_status()
        return [
            {
                "open_time": k[0],
                "open": float(k[1]),
                "high": float(k[2]),
                "low": float(k[3]),
                "close": float(k[4]),
                "volume": float(k[5]),
            }
            for k in r.json()
        ]
    except Exception as e:
        print(f"  [WARN] ローソク足取得失敗: {e}")
        return []


def get_btc_markets() -> list[dict]:
    """Polymarket Gamma API から BTC 関連アクティブマーケットを取得"""
    markets = []
    for keyword in ["bitcoin", "BTC"]:
        try:
            r = requests.get(
                f"{GAMMA_API}/markets",
                params={
                    "keyword": keyword,
                    "active": "true",
                    "closed": "false",
                    "limit": 30,
                },
                timeout=REQUEST_TIMEOUT,
            )
            r.raise_for_status()
            data = r.json()
            batch = data if isinstance(data, list) else data.get("markets", [])
            markets.extend(batch)
        except Exception as e:
            print(f"  [WARN] マーケット取得失敗 (keyword={keyword}): {e}")

    # 重複除去（id で）
    seen = set()
    unique = []
    for m in markets:
        mid = m.get("id") or m.get("conditionId", "")
        if mid and mid not in seen:
            seen.add(mid)
            unique.append(m)
    return unique


def extract_tokens(market: dict) -> tuple[Optional[float], Optional[float]]:
    """マーケットから YES/NO トークン価格を抽出"""
    tokens = market.get("tokens", [])
    yes_price = no_price = None
    for t in tokens:
        outcome = str(t.get("outcome", "")).strip().upper()
        price = t.get("price")
        if price is not None:
            price = float(price)
        if outcome in ("YES", "Y"):
            yes_price = price
        elif outcome in ("NO", "N"):
            no_price = price
    # price が入っていない場合は outcomePrices を試す
    if yes_price is None and no_price is None:
        outcome_prices = market.get("outcomePrices", [])
        outcomes = market.get("outcomes", [])
        for i, op in enumerate(outcome_prices):
            label = str(outcomes[i]).strip().upper() if i < len(outcomes) else ""
            p = float(op)
            if label in ("YES", "Y"):
                yes_price = p
            elif label in ("NO", "N"):
                no_price = p
    return yes_price, no_price


def parse_end_date(market: dict) -> Optional[datetime]:
    """マーケットの終了日時をパース"""
    for key in ("endDate", "end_date", "endDateIso", "expirationDate"):
        raw = market.get(key)
        if raw:
            try:
                dt = datetime.fromisoformat(raw.replace("Z", "+00:00"))
                return dt.astimezone(timezone.utc)
            except Exception:
                pass
    return None


def select_target_markets(markets: list[dict]) -> list[dict]:
    """
    分析対象マーケットを選定する。
    優先順: 短期（~5分）> 短期（~1時間以内）> 直近終了
    """
    now = datetime.now(timezone.utc)
    candidates = []

    for m in markets:
        end_dt = parse_end_date(m)
        if not end_dt:
            continue
        delta_sec = (end_dt - now).total_seconds()
        if delta_sec <= 0:
            continue  # 既に終了
        yes_price, no_price = extract_tokens(m)
        if yes_price is None or no_price is None:
            continue  # 価格情報なし

        question = m.get("question", "")
        candidates.append({
            "market": m,
            "end_dt": end_dt,
            "delta_sec": delta_sec,
            "yes_price": yes_price,
            "no_price": no_price,
            "question": question,
        })

    # 終了まで時間が短い順にソート（最も近いものを優先）
    candidates.sort(key=lambda x: x["delta_sec"])
    # 上位3マーケットを返す
    return candidates[:3]


# ─────────────────────────────────────────────────────────────
# Claude 分析
# ─────────────────────────────────────────────────────────────
SYSTEM_PROMPT = """あなたはPolymarket の BTC 予測マーケット専門のトレーダーです。
提供されたBTCの価格データとマーケット情報を分析し、ペーパートレードの売買判断を出します。

あなたの役割:
1. BTC の直近の価格動向を分析する（モメンタム・ボラティリティ・トレンド）
2. Polymarket のYES/NOトークン価格（インプライドプロバビリティ）を評価する
3. 期待値（EV）がプラスと判断した場合のみ取引を推奨する
4. 常に冷静・合理的に判断し、過信しない

判断基準:
- YES価格 = マーケットが「YES」に解決する確率
- EV > 0 になる場合のみ BUY_YES または BUY_NO を推奨
- 不確実性が高い場合は SKIP を選ぶ

必ず以下のJSON形式で回答すること:
{
  "action": "BUY_YES" | "BUY_NO" | "SKIP",
  "confidence": 0.0~1.0,
  "reasoning": "判断理由（200字以内）",
  "implied_probability": 0.0~1.0,
  "edge": "エッジの根拠（100字以内）"
}
"""


def ask_claude(
    client: anthropic.Anthropic,
    btc_price: float,
    klines: list[dict],
    market_info: dict,
) -> dict:
    """Claudeに売買判断を依頼する"""

    # ローソク足サマリーを作成
    kline_summary = ""
    if klines:
        recent = klines[-6:]  # 直近30分（6本×5分）
        changes = []
        for k in recent:
            changes.append(f"O:{k['open']:.0f} H:{k['high']:.0f} L:{k['low']:.0f} C:{k['close']:.0f} V:{k['volume']:.1f}")
        kline_summary = "\n".join(changes)

        first_close = klines[0]["close"]
        last_close = klines[-1]["close"]
        pct_change = (last_close - first_close) / first_close * 100
        high = max(k["high"] for k in klines)
        low = min(k["low"] for k in klines)
        volatility = (high - low) / last_close * 100
    else:
        pct_change = 0
        volatility = 0
        high = btc_price
        low = btc_price

    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    end_dt = market_info["end_dt"]
    minutes_left = max(0, int(market_info["delta_sec"] / 60))

    user_message = f"""
## 現在時刻
{now_str}

## BTC現在価格
${btc_price:,.2f} USDT

## 直近{KLINE_COUNT}本の5分足（1時間分）
{kline_summary if kline_summary else "データなし"}

過去1時間の騰落率: {pct_change:+.2f}%
過去1時間の価格レンジ: ${low:,.0f} ~ ${high:,.0f}（ボラティリティ: {volatility:.2f}%）

## 対象マーケット
質問: {market_info['question']}
終了時刻: {end_dt.strftime('%Y-%m-%d %H:%M UTC')}（あと {minutes_left} 分）
YES価格（インプライド確率）: {market_info['yes_price']:.3f} ({market_info['yes_price']*100:.1f}%)
NO価格（インプライド確率）: {market_info['no_price']:.3f} ({market_info['no_price']*100:.1f}%)

## 指示
上記の情報を元に売買判断を JSON 形式で返してください。
"""

    response = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=1024,
        thinking={"type": "adaptive"},
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
    )

    # レスポンスからJSONを抽出
    text = ""
    for block in response.content:
        if block.type == "text":
            text = block.text
            break

    try:
        # JSON 部分だけ抽出
        start = text.find("{")
        end = text.rfind("}") + 1
        if start >= 0 and end > start:
            return json.loads(text[start:end])
    except json.JSONDecodeError:
        pass

    return {
        "action": "SKIP",
        "confidence": 0.0,
        "reasoning": "JSONパースエラー",
        "implied_probability": 0.5,
        "edge": "なし",
    }


# ─────────────────────────────────────────────────────────────
# ターミナル表示
# ─────────────────────────────────────────────────────────────
def clear_screen():
    os.system("clear" if os.name != "nt" else "cls")


def print_header(portfolio: PaperPortfolio):
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    roi = (portfolio.total_pnl / INITIAL_BALANCE) * 100

    print("=" * 72)
    print(" BTC Polymarket ペーパートレーダー  [Claude powered]")
    print("=" * 72)
    print(f" 時刻        : {now}")
    print(f" 残高        : ${portfolio.balance:>10.2f}  (初期: ${INITIAL_BALANCE:.2f})")
    print(f" 損益合計    : {'+' if portfolio.total_pnl >= 0 else ''}{portfolio.total_pnl:.2f}  (ROI: {'+' if roi >= 0 else ''}{roi:.1f}%)")
    print(f" 成績        : {portfolio.wins}勝 {portfolio.losses}敗  (勝率: {portfolio.win_rate:.1f}%)")
    print(f" トレード数  : {portfolio.total_trades}回  (オープン: {len(portfolio.open_positions)})")
    print("=" * 72)


def print_open_positions(portfolio: PaperPortfolio):
    positions = portfolio.open_positions
    if not positions:
        print("\n  オープンポジションなし")
        return

    print("\n  ─── オープンポジション ───")
    for p in positions:
        print(f"\n  #{p.trade_id} [{p.outcome}] {p.question[:55]}...")
        print(f"      価格: {p.entry_price:.3f}  ベット: ${p.bet_amount:.2f}  "
              f"シェア: {p.shares:.2f}  最大回収: ${p.potential_payout:.2f}")
        print(f"      残り: {p.time_left}  理由: {p.claude_reason[:60]}")


def print_recent_trades(portfolio: PaperPortfolio, n: int = 5):
    closed = portfolio.closed_positions[-n:]
    if not closed:
        return

    print(f"\n  ─── 直近{n}件のクローズ済みトレード ───")
    for p in reversed(closed):
        icon = "WIN" if p.status == "won" else ("LOST" if p.status == "lost" else "EXP")
        sign = "+" if p.pnl >= 0 else ""
        print(f"  {icon} #{p.trade_id} [{p.outcome}] {sign}${p.pnl:.2f}  {p.question[:50]}...")


def print_analysis_result(market_info: dict, decision: dict, pos: Optional[Position]):
    action = decision.get("action", "SKIP")
    conf = decision.get("confidence", 0.0)
    reasoning = decision.get("reasoning", "")
    edge = decision.get("edge", "")

    icon = {"BUY_YES": "[BUY YES]", "BUY_NO": "[BUY NO ]", "SKIP": "[SKIP   ]"}.get(action, "[?]")
    print(f"\n  Claude の判断: {icon}  確信度: {conf*100:.0f}%")
    print(f"  理由: {reasoning}")
    print(f"  エッジ: {edge}")
    if pos:
        print(f"  -> トレード#{pos.trade_id} 記録済み  ベット${pos.bet_amount:.2f} -> 最大${pos.potential_payout:.2f}")


def try_fetch_resolution(pos: Position) -> Optional[str]:
    """
    Polymarket Gamma API からマーケット解決結果を取得する（実験的）。
    解決前は None を返す。
    """
    try:
        r = requests.get(
            f"{GAMMA_API}/markets/{pos.market_id}",
            timeout=REQUEST_TIMEOUT,
        )
        r.raise_for_status()
        m = r.json()
        if m.get("closed") or m.get("resolved"):
            # 解決済み: 勝ち側のトークンを探す
            tokens = m.get("tokens", [])
            for t in tokens:
                # winner フラグや price=1 のトークンが勝者
                if t.get("winner") or float(t.get("price", 0)) >= 0.99:
                    return t.get("outcome", "").upper()
        return None
    except Exception:
        return None


def settle_positions(portfolio: PaperPortfolio):
    """期限切れポジションを解決する"""
    for pos in portfolio.open_positions:
        if not pos.is_resolved:
            continue

        # まずAPIから実際の解決結果を試みる
        winning = try_fetch_resolution(pos)

        if winning is None:
            # APIから取得できなかった場合はエントリー価格ベースの簡易推定
            random.seed(pos.trade_id + int(pos.end_date.timestamp()))
            winning = "YES" if random.random() < 0.5 else "NO"
            print(f"  [SETTLE] #{pos.trade_id}: API解決結果なし → ランダム決済（デモ）")
        else:
            print(f"  [SETTLE] #{pos.trade_id}: 解決結果 = {winning}")

        portfolio.settle_position(pos, winning)
        sign = "+" if pos.pnl >= 0 else ""
        result = "WIN" if pos.status == "won" else "LOST"
        print(f"  [{result}] #{pos.trade_id} {sign}${pos.pnl:.2f}  ({pos.outcome} vs {winning})")


# ─────────────────────────────────────────────────────────────
# メインループ
# ─────────────────────────────────────────────────────────────
def main():
    if not ANTHROPIC_API_KEY:
        print("ERROR: ANTHROPIC_API_KEY が設定されていません。")
        print(".env ファイルに ANTHROPIC_API_KEY=sk-ant-... を記載してください。")
        sys.exit(1)

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    portfolio = PaperPortfolio()

    print("BTC Polymarket ペーパートレーダー 起動中...")
    print(f"モデル: {CLAUDE_MODEL}")
    print(f"チェック間隔: {CHECK_INTERVAL_SEC}秒")
    print(f"初期残高: ${INITIAL_BALANCE}")
    print(f"1トレードあたり: ${BET_SIZE}")
    print()

    iteration = 0
    while True:
        iteration += 1
        clear_screen()
        print_header(portfolio)

        print(f"\n  [Iter {iteration}] {datetime.now(timezone.utc).strftime('%H:%M:%S')} — データ取得中...")

        # ① BTC価格・ローソク足
        btc_price = get_btc_price()
        klines = get_btc_klines()

        if btc_price:
            print(f"  BTC: ${btc_price:,.2f}")
        else:
            print("  BTC価格取得失敗 — スキップ")

        # ② 期限切れポジションを解決
        settle_positions(portfolio)

        # ③ Polymarket BTC マーケット取得
        raw_markets = get_btc_markets()
        target_markets = select_target_markets(raw_markets)

        if not target_markets:
            print("  [WARN] BTC マーケットが見つかりません")
            print_open_positions(portfolio)
            print_recent_trades(portfolio)
            print(f"\n  次回チェックまで {CHECK_INTERVAL_SEC}秒待機...")
            time.sleep(CHECK_INTERVAL_SEC)
            continue

        print(f"  マーケット取得: {len(raw_markets)}件 → 対象: {len(target_markets)}件")

        # ④ 各マーケットをClaudeが分析
        if btc_price:
            for mi in target_markets:
                print(f"\n  ──────────────────────────────────")
                print(f"  マーケット: {mi['question'][:65]}")
                print(f"  YES: {mi['yes_price']:.3f}  NO: {mi['no_price']:.3f}  "
                      f"残り: {int(mi['delta_sec']//60)}分")
                print(f"  Claude 分析中...")

                try:
                    decision = ask_claude(client, btc_price, klines, mi)
                except Exception as e:
                    print(f"  [ERROR] Claude API エラー: {e}")
                    continue

                action = decision.get("action", "SKIP")
                pos = None

                if action in ("BUY_YES", "BUY_NO"):
                    outcome = "YES" if action == "BUY_YES" else "NO"
                    price = mi["yes_price"] if outcome == "YES" else mi["no_price"]
                    market_id = (
                        mi["market"].get("conditionId")
                        or mi["market"].get("id", "unknown")
                    )
                    pos = portfolio.open_position(
                        market_id=market_id,
                        question=mi["question"],
                        outcome=outcome,
                        entry_price=price,
                        end_date=mi["end_dt"],
                        reason=decision.get("reasoning", ""),
                    )

                print_analysis_result(mi, decision, pos)

        # ⑤ サマリー表示
        print_open_positions(portfolio)
        print_recent_trades(portfolio)
        print(f"\n  次回チェックまで {CHECK_INTERVAL_SEC}秒待機... (Ctrl+C で終了)")
        print("=" * 72)

        try:
            time.sleep(CHECK_INTERVAL_SEC)
        except KeyboardInterrupt:
            print("\n\n終了します。最終成績:")
            print_header(portfolio)
            print_recent_trades(portfolio, n=20)
            sys.exit(0)


if __name__ == "__main__":
    main()
