# ossalt VPS Worker

OSSALT専用のバックグラウンドワーカー。  
GitHub APIでOSSメトリクス同期・候補収集、SEO事故検知を行いSupabaseへ書き込む。

## ファイル構成

```
vps-worker/
├── sync_products.py    # GitHubメトリクス同期（毎日3時）
├── discover_tools.py   # OSS候補収集（毎日4時）
├── check_seo.py        # SEOチェック（毎日5時）
├── requirements.txt
├── .env.example
├── logs/               # cronログ出力先
└── README.md
```

---

## セットアップ

```bash
# VPSにコピー
scp -r vps-worker/ root@162.43.50.241:/opt/ossalt-worker/

# VPSにSSH
ssh root@162.43.50.241
cd /opt/ossalt-worker

# Python 3.11+ 確認
python3 --version

# venv作成・有効化
python3 -m venv .venv
source .venv/bin/activate

# 依存インストール
pip install -r requirements.txt

# logsディレクトリ作成
mkdir -p logs
```

---

## .env 設定

```bash
cp .env.example .env
nano .env
```

| 変数 | 説明 | 必須 |
|------|------|------|
| `SUPABASE_URL` | Supabaseプロジェクト URL | ✓ |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role キー（管理者権限） | ✓ |
| `GITHUB_TOKEN` | `ghp_...` トークン（5,000 req/h） | 推奨 |
| `OSSALT_BASE_URL` | `https://ossalt.jp` | — |
| `DRY_RUN` | `true` で書き込みをスキップ | — |

### GitHub Token の取得

1. GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens
2. Repository access: Public Repositories (read-only)
3. Permissions: Contents: Read-only

---

## sync_products.py

toolsテーブルの全GitHub URLに対してGitHub APIを叩き、メトリクスを更新する。

### 手動実行

```bash
cd /opt/ossalt-worker && source .venv/bin/activate

python sync_products.py
DRY_RUN=true python sync_products.py   # 書き込みなし
```

### 更新カラム

`github_stars` / `github_forks` / `github_issues` / `github_watchers` /
`github_language` / `github_license` / `github_archived` /
`last_commit_at` / `latest_release_name` / `latest_release_published_at` / `checked_at`

---

## discover_tools.py

GitHub Search APIで10種のSaaS代替キーワードを検索し、
スコアが一定以上の候補を `tool_candidates` テーブルへ保存する。  
自動掲載はしない。Supabase管理画面でレビュー → `approved` にしたものだけ `tools` へ追加する運用。

### 検索キーワード

| キーワード | competitor | category |
|-----------|-----------|----------|
| notion alternative open source | Notion | productivity |
| slack alternative open source | Slack | communication |
| airtable alternative open source | Airtable | database |
| zapier alternative open source | Zapier | automation |
| google analytics alternative open source | Google Analytics | analytics |
| typeform alternative open source | Typeform | forms |
| calendly alternative open source | Calendly | scheduling |
| jira alternative open source | Jira | project-management |
| trello alternative open source | Trello | project-management |
| intercom alternative open source | Intercom | communication |

### スコアリング

| 条件 | 加点 |
|------|------|
| stars ≥ 10,000 | +40 |
| stars ≥ 1,000 | +30 |
| stars ≥ 100 | +10 |
| forks ≥ 100 | +10 |
| 言語あり | +5 |
| ライセンスあり | +10 |
| homepageあり | +10 |
| archived=false | +20 |
| 90日以内に更新 | +30 |

**MIN_SCORE=40 未満は保存しない。**

### 手動実行

```bash
cd /opt/ossalt-worker && source .venv/bin/activate

python discover_tools.py
DRY_RUN=true python discover_tools.py   # 保存予定の候補を表示するだけ
```

### tool_candidates テーブルSQL

```sql
CREATE TABLE IF NOT EXISTS public.tool_candidates (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name               text NOT NULL,
  github_url         text NOT NULL,
  official_url       text,
  description        text,
  stars              integer,
  forks              integer,
  language           text,
  license            text,
  category           text,
  competitor         text,
  discovery_keyword  text,
  status             text NOT NULL DEFAULT 'pending',  -- 'pending'|'approved'|'rejected'
  score              integer NOT NULL DEFAULT 0,
  reviewed_at        timestamptz,
  checked_at         timestamptz,
  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS tool_candidates_github_url_idx
  ON public.tool_candidates(github_url);

CREATE INDEX IF NOT EXISTS tool_candidates_status_score_idx
  ON public.tool_candidates(status, score DESC);
```

---

## cron設定

```bash
crontab -e
```

```cron
# sync_products: 毎日午前3時（GitHubメトリクス更新）
0 3 * * * cd /opt/ossalt-worker && .venv/bin/python sync_products.py >> logs/sync_products.log 2>&1

# discover_tools: 毎日午前4時（OSS候補収集）
0 4 * * * cd /opt/ossalt-worker && .venv/bin/python discover_tools.py >> logs/discover_tools.log 2>&1

# check_seo: 毎日午前5時（SEOチェック）
0 5 * * * cd /opt/ossalt-worker && .venv/bin/python check_seo.py >> logs/check_seo.log 2>&1
```

---

## check_seo.py

ossalt.jp の重要ページを毎日チェックし、SEO事故を検知する。  
結果は `seo_checks` テーブルへ保存。ERRORが1件以上あれば終了コード1（cron通知に利用可）。

### チェック対象URL（固定）

| URL | チェック内容 |
|-----|------------|
| `https://ossalt.jp/` | HTML SEO要素 |
| `https://ossalt.jp/sitemap.xml` | `<urlset>` 存在・URL件数 |
| `https://ossalt.jp/robots.txt` | `User-agent`・`Disallow: /` 検出 |
| `https://ossalt.jp/tools/appflowy` | HTML SEO要素 |
| `https://ossalt.jp/alternatives/notion` | HTML SEO要素 |

### HTMLチェック項目

| 項目 | statusへの影響 |
|------|--------------|
| title タグ | なし → warn |
| meta description | なし → warn |
| canonical リンク | なし → warn |
| og:title / og:description | 記録のみ |
| JSON-LD (`application/ld+json`) | 記録のみ |
| 「読み込み中」等のローディングテキスト | 検出 → warn |

### ステータス判定

| 条件 | status |
|------|--------|
| HTTP 5xx / 接続失敗 | `error` |
| HTTP 4xx | `error` |
| 問題あり | `warn` |
| 正常 | `ok` |

### 手動実行

```bash
cd /opt/ossalt-worker && source .venv/bin/activate

python check_seo.py
DRY_RUN=true python check_seo.py   # 結果を表示するだけ
```

### seo_checks テーブルSQL

```sql
CREATE TABLE IF NOT EXISTS public.seo_checks (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url                   text NOT NULL,
  status                text NOT NULL,           -- 'ok' | 'warn' | 'error'
  http_status           integer,
  title                 text,
  meta_description      text,
  has_canonical         boolean DEFAULT false,
  has_og_title          boolean DEFAULT false,
  has_og_description    boolean DEFAULT false,
  has_json_ld           boolean DEFAULT false,
  contains_loading_text boolean DEFAULT false,
  response_ms           integer,
  error_message         text,
  checked_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS seo_checks_url_checked_idx
  ON public.seo_checks(url, checked_at DESC);

CREATE INDEX IF NOT EXISTS seo_checks_status_idx
  ON public.seo_checks(status, checked_at DESC);
```

---

## ログ確認

```bash
# リアルタイム
tail -f logs/sync_products.log
tail -f logs/discover_tools.log
tail -f logs/check_seo.log

# エラーだけ抽出
grep ERROR logs/check_seo.log

# WARNだけ抽出（SEO問題の詳細）
grep "WARN\|└" logs/check_seo.log

# 実行サマリー
grep -E "完了|OK|WARN|ERROR" logs/check_seo.log | tail -5
```

---

## Rate Limit メモ

| API | 上限 | 備考 |
|-----|------|------|
| GitHub Search（token あり） | 30 req/min | 10キーワード × 2s間隔 ≒ 20秒で完了 |
| GitHub REST（token あり） | 5,000 req/h | sync_products: repo + release で 2 req/ツール |
| GitHub（token なし） | 60 req/h（REST） / 10 req/min（Search） | 非推奨 |
| Supabase | 制限なし（実用上） | service_role使用 |
