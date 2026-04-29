#!/usr/bin/env python3
"""
discover_tools.py
GitHub Search APIでSaaS代替OSSを自動収集し、
Supabaseのtool_candidatesテーブルへ保存する。

Usage:
    python discover_tools.py
    DRY_RUN=true python discover_tools.py   # 書き込みなし（候補を標準出力に表示）

cron:
    0 4 * * * cd /opt/ossalt-worker && .venv/bin/python discover_tools.py >> logs/discover_tools.log 2>&1
"""

import os
import re
import sys
import time
import logging
from datetime import datetime, timezone, timedelta

import requests
from dotenv import load_dotenv
from supabase import create_client, Client
from utils import start_worker_run, finish_worker_run

# ---------------------------------------------------------------------------
# 設定
# ---------------------------------------------------------------------------

load_dotenv()

SUPABASE_URL              = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_ROLE_KEY = os.environ["SUPABASE_SERVICE_ROLE_KEY"]
GITHUB_TOKEN              = os.environ.get("GITHUB_TOKEN", "")
DRY_RUN                   = os.environ.get("DRY_RUN", "false").lower() == "true"

GITHUB_API      = "https://api.github.com"
RESULTS_PER_KW  = 10    # キーワードごとの最大取得件数
SLEEP_SEARCH    = 2.0   # Search API: 30 req/min (authenticated) → 2s間隔で安全
SLEEP_ITEM      = 0.3   # 候補ごとの処理間隔
MIN_SCORE       = 40    # これ未満は保存しない

# ---------------------------------------------------------------------------
# 検索キーワード定義
# keyword → (表示用competitor名, category)
# ---------------------------------------------------------------------------

KEYWORDS: list[tuple[str, str, str]] = [
    ("notion alternative open source",          "Notion",          "productivity"),
    ("slack alternative open source",           "Slack",           "communication"),
    ("airtable alternative open source",        "Airtable",        "database"),
    ("zapier alternative open source",          "Zapier",          "automation"),
    ("google analytics alternative open source","Google Analytics","analytics"),
    ("typeform alternative open source",        "Typeform",        "forms"),
    ("calendly alternative open source",        "Calendly",        "scheduling"),
    ("jira alternative open source",            "Jira",            "project-management"),
    ("trello alternative open source",          "Trello",          "project-management"),
    ("intercom alternative open source",        "Intercom",        "communication"),
]

# ---------------------------------------------------------------------------
# ログ設定
# ---------------------------------------------------------------------------

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    stream=sys.stdout,
)
log = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# GitHub APIセッション（sync_products.py と同一パターン）
# ---------------------------------------------------------------------------

def make_github_session() -> requests.Session:
    session = requests.Session()
    session.headers.update({
        "User-Agent": "ossalt-discover-worker/1.0 (https://ossalt.jp)",
        "Accept":     "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    })
    if GITHUB_TOKEN:
        session.headers["Authorization"] = f"Bearer {GITHUB_TOKEN}"
    else:
        log.warning("GITHUB_TOKEN が未設定です。Rate limitが低くなります（60 req/h）")
    return session

# ---------------------------------------------------------------------------
# GitHub Search API
# ---------------------------------------------------------------------------

def search_repos(
    session: requests.Session,
    keyword: str,
    per_page: int = RESULTS_PER_KW,
) -> list[dict]:
    """キーワードでGitHub Search APIを叩き、リポジトリ一覧を返す。"""
    url    = f"{GITHUB_API}/search/repositories"
    params = {
        "q":        f"{keyword} is:public archived:false",
        "sort":     "stars",
        "order":    "desc",
        "per_page": per_page,
    }
    try:
        resp = session.get(url, params=params, timeout=20)

        # rate limit
        if resp.status_code == 403:
            reset_at = int(resp.headers.get("X-RateLimit-Reset", 0))
            wait     = max(10, reset_at - int(time.time())) + 5
            log.warning(f"Rate limit 超過。{wait}秒 待機します")
            time.sleep(wait)
            return []

        if resp.status_code == 422:
            log.warning(f"クエリ不正 (422): {keyword!r}")
            return []

        resp.raise_for_status()
        data = resp.json()
        return data.get("items", [])

    except requests.RequestException as e:
        log.error(f"GitHub Search エラー ({keyword!r}): {e}")
        return []

# ---------------------------------------------------------------------------
# スコア計算
# ---------------------------------------------------------------------------

def calc_score(item: dict) -> int:
    score = 0
    stars    = item.get("stargazers_count", 0) or 0
    forks    = item.get("forks_count", 0) or 0
    archived = item.get("archived", True)
    language = item.get("language")
    license_ = item.get("license")
    homepage = item.get("homepage", "")
    pushed_at_str = item.get("pushed_at", "")

    # stars
    if stars >= 10000:
        score += 40
    elif stars >= 1000:
        score += 30
    elif stars >= 100:
        score += 10

    # forks
    if forks >= 100:
        score += 10

    # language
    if language:
        score += 5

    # license
    if license_ and isinstance(license_, dict) and license_.get("spdx_id"):
        score += 10

    # homepage
    if homepage and homepage.strip():
        score += 10

    # not archived
    if not archived:
        score += 20

    # pushed_at 90日以内
    if pushed_at_str:
        try:
            pushed_at = datetime.fromisoformat(pushed_at_str.replace("Z", "+00:00"))
            if pushed_at >= datetime.now(timezone.utc) - timedelta(days=90):
                score += 30
        except ValueError:
            pass

    return score

# ---------------------------------------------------------------------------
# 既存URL収集（重複チェック用）
# ---------------------------------------------------------------------------

def fetch_existing_urls(client: Client) -> set[str]:
    """tools と tool_candidates の github_url を全て取得して集合で返す。"""
    urls: set[str] = set()

    for table in ("tools", "tool_candidates"):
        offset = 0
        while True:
            try:
                resp = (
                    client.table(table)
                    .select("github_url")
                    .not_.is_("github_url", "null")
                    .range(offset, offset + 999)
                    .execute()
                )
                batch = resp.data or []
                for row in batch:
                    u = (row.get("github_url") or "").rstrip("/")
                    if u:
                        urls.add(u)
                if len(batch) < 1000:
                    break
                offset += 1000
            except Exception as e:
                log.warning(f"既存URL取得エラー ({table}): {e}")
                break

    log.info(f"既存URL数: {len(urls)} (tools + tool_candidates)")
    return urls

# ---------------------------------------------------------------------------
# Supabase insert
# ---------------------------------------------------------------------------

def insert_candidate(client: Client, row: dict) -> bool:
    if DRY_RUN:
        log.info(
            f"  [DRY_RUN] {row['name']} | score={row['score']} "
            f"stars={row['stars']} competitor={row['competitor']}"
        )
        return True
    try:
        client.table("tool_candidates").insert(row).execute()
        return True
    except Exception as e:
        log.error(f"  Supabase insert エラー ({row.get('name')}): {e}")
        return False

# ---------------------------------------------------------------------------
# URL正規化（重複チェック用）
# ---------------------------------------------------------------------------

_GITHUB_RE = re.compile(
    r"^https?://github\.com/([a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+?)(?:\.git)?/?$"
)

def normalize_github_url(url: str) -> str | None:
    if not url:
        return None
    m = _GITHUB_RE.match(url.strip())
    if not m:
        return None
    return f"https://github.com/{m.group(1)}"

# ---------------------------------------------------------------------------
# メイン処理
# ---------------------------------------------------------------------------

def main() -> None:
    started_at = datetime.now(timezone.utc)
    log.info("=" * 60)
    log.info(f"discover_tools.py 開始 {started_at.isoformat()}")
    log.info(f"DRY_RUN={DRY_RUN}  MIN_SCORE={MIN_SCORE}")
    log.info("=" * 60)

    run_id = start_worker_run("discover_tools")

    client  = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    session = make_github_session()

    total_found    = 0
    total_inserted = 0
    total_skipped  = 0
    total_failed   = 0
    now_iso        = datetime.now(timezone.utc).isoformat()

    try:
        # 既存URLを取得（重複スキップ用）
        existing_urls = fetch_existing_urls(client)

        for keyword, competitor, category in KEYWORDS:
            log.info(f"\n--- キーワード: {keyword!r} ---")

            try:
                items = search_repos(session, keyword)
            except Exception as e:
                log.error(f"search_repos 例外 ({keyword!r}): {e}")
                time.sleep(SLEEP_SEARCH)
                continue

            log.info(f"  取得: {len(items)} 件")
            total_found += len(items)

            for item in items:
                try:
                    raw_url    = item.get("html_url", "")
                    github_url = normalize_github_url(raw_url)

                    if not github_url:
                        log.warning(f"  URL不正: {raw_url!r}")
                        total_skipped += 1
                        continue

                    # 重複チェック
                    if github_url in existing_urls:
                        log.info(f"  スキップ（既存）: {github_url}")
                        total_skipped += 1
                        continue

                    # スコア計算
                    score = calc_score(item)
                    if score < MIN_SCORE:
                        log.info(
                            f"  スキップ（スコア低）: {item.get('name')} score={score}"
                        )
                        total_skipped += 1
                        continue

                    # ライセンス
                    license_spdx = None
                    if isinstance(item.get("license"), dict):
                        spdx = item["license"].get("spdx_id")
                        if spdx and spdx != "NOASSERTION":
                            license_spdx = spdx

                    row = {
                        "name":              item.get("name") or item.get("full_name", "").split("/")[-1],
                        "github_url":        github_url,
                        "official_url":      (item.get("homepage") or "").strip() or None,
                        "description":       (item.get("description") or "")[:500] or None,
                        "stars":             item.get("stargazers_count"),
                        "forks":             item.get("forks_count"),
                        "language":          item.get("language"),
                        "license":           license_spdx,
                        "category":          category,
                        "competitor":        competitor,
                        "discovery_keyword": keyword,
                        "status":            "pending",
                        "score":             score,
                        "checked_at":        now_iso,
                    }

                    if insert_candidate(client, row):
                        log.info(
                            f"  ✓ {row['name']} | score={score} stars={item.get('stargazers_count')}"
                        )
                        existing_urls.add(github_url)  # 同一実行内での再重複防止
                        total_inserted += 1
                    else:
                        total_failed += 1

                except Exception as e:
                    log.error(f"  候補処理 例外 ({item.get('name')}): {e}")
                    total_failed += 1

                time.sleep(SLEEP_ITEM)

            # Search API: キーワード間に間隔を置く
            time.sleep(SLEEP_SEARCH)

        # -----------------------------------------------------------------------
        # サマリー
        # -----------------------------------------------------------------------
        elapsed = (datetime.now(timezone.utc) - started_at).total_seconds()
        log.info("\n" + "=" * 60)
        log.info(f"完了  経過時間: {elapsed:.1f}s")
        log.info(f"  発見:       {total_found}")
        log.info(f"  保存:       {total_inserted}")
        log.info(f"  スキップ:   {total_skipped}")
        log.info(f"  失敗:       {total_failed}")
        log.info("=" * 60)

        msg = f"found={total_found}"
        if DRY_RUN:
            msg = f"[DRY_RUN] {msg}"
        finish_worker_run(run_id, "success", total_inserted, total_skipped, total_failed, msg)

    except Exception as e:
        log.exception(f"予期しない例外: {e}")
        finish_worker_run(run_id, "error", total_inserted, total_skipped, total_failed, str(e))
        sys.exit(1)


if __name__ == "__main__":
    main()
