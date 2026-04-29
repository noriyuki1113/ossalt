# ossalt VPS Worker

OSSALT専用のバックグラウンドワーカー。  
GitHub APIでOSSメトリクス同期・候補収集を行いSupabaseへ書き込む。

## ファイル構成

```
vps-worker/
├── sync_products.py    # GitHubメトリクス同期（毎日3時）
├── discover_tools.py   # OSS候補収集（毎日4時）
├── check_seo.py        # SEOチェック（予定）
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
```

---

## ログ確認

```bash
# リアルタイム
tail -f logs/sync_products.log
tail -f logs/discover_tools.log

# エラーだけ
grep ERROR logs/discover_tools.log

# 実行サマリー
grep -E "完了|保存|スキップ|失敗" logs/discover_tools.log
```

---

## Rate Limit メモ

| API | 上限 | 備考 |
|-----|------|------|
| GitHub Search（token あり） | 30 req/min | 10キーワード × 2s間隔 ≒ 20秒で完了 |
| GitHub REST（token あり） | 5,000 req/h | sync_products: repo + release で 2 req/ツール |
| GitHub（token なし） | 60 req/h（REST） / 10 req/min（Search） | 非推奨 |
| Supabase | 制限なし（実用上） | service_role使用 |
