# ossalt VPS Worker

OSSALT専用のバックグラウンドワーカー。  
GitHub APIでOSSメトリクスを取得してSupabaseへ同期する。

## ファイル構成

```
vps-worker/
├── sync_products.py    # GitHubメトリクス同期（★今ここ）
├── check_seo.py        # SEOチェック（予定）
├── discover_tools.py   # OSS候補収集（予定）
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

## 手動実行

```bash
cd /opt/ossalt-worker
source .venv/bin/activate

# 本番実行
python sync_products.py

# 書き込みなし（確認用）
DRY_RUN=true python sync_products.py
```

---

## cron設定

```bash
crontab -e
```

```cron
# sync_products: 毎日午前3時に実行
0 3 * * * cd /opt/ossalt-worker && .venv/bin/python sync_products.py >> logs/sync_products.log 2>&1
```

cronに追加後、logsディレクトリを作成：

```bash
mkdir -p /opt/ossalt-worker/logs
```

---

## ログ確認

```bash
# リアルタイムで確認
tail -f /opt/ossalt-worker/logs/sync_products.log

# 最新100行
tail -100 /opt/ossalt-worker/logs/sync_products.log

# エラーだけ抽出
grep ERROR /opt/ossalt-worker/logs/sync_products.log

# 実行サマリーだけ確認
grep -E "完了|成功|失敗|スキップ" /opt/ossalt-worker/logs/sync_products.log
```

---

## Supabaseカラム（要migration）

`sync_products.py` が更新するカラムが未作成の場合は以下のmigrationを適用：

```sql
ALTER TABLE public.tools
  ADD COLUMN IF NOT EXISTS github_stars    integer,
  ADD COLUMN IF NOT EXISTS github_forks    integer,
  ADD COLUMN IF NOT EXISTS github_issues   integer,
  ADD COLUMN IF NOT EXISTS github_watchers integer,
  ADD COLUMN IF NOT EXISTS github_language text,
  ADD COLUMN IF NOT EXISTS github_license  text,
  ADD COLUMN IF NOT EXISTS github_archived boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_commit_at  timestamptz,
  ADD COLUMN IF NOT EXISTS latest_release_name         text,
  ADD COLUMN IF NOT EXISTS latest_release_published_at timestamptz,
  ADD COLUMN IF NOT EXISTS checked_at      timestamptz;
```

---

## Rate Limit メモ

| API | 上限 | 備考 |
|-----|------|------|
| GitHub（token あり） | 5,000 req/h | repo + release で 2 req/ツール → 2,500件/h |
| GitHub（token なし） | 60 req/h | 非推奨 |
| Supabase | 制限なし（実用上） | service_role使用 |
