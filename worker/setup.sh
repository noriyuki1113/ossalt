#!/bin/bash
# ossalt-worker setup — Ubuntu (Xserver VPS: 162.43.50.241)
set -euo pipefail

WORKER_DIR="/opt/ossalt-worker"
ENV_FILE="$WORKER_DIR/.env"

echo "=== ossalt-worker setup ==="

# 1. Node.js 20（og-serviceで入っていれば skip）
if ! node --version 2>/dev/null | grep -q "^v20"; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

# 2. npm install
cd "$WORKER_DIR"
npm install --omit=dev

# 3. .env ファイルの作成（初回のみ）
if [ ! -f "$ENV_FILE" ]; then
  cat > "$ENV_FILE" <<'ENVEOF'
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

GITHUB_TOKEN=ghp_your-github-token

# Google Indexing API: base64エンコードしたサービスアカウントJSON
# cat service-account.json | base64 -w0 > key.b64
GOOGLE_SA_KEY=

# Claude API (SNS下書き生成)
ANTHROPIC_API_KEY=
ENVEOF
  echo "⚠️  $ENV_FILE を作成しました。環境変数を設定してください。"
fi

# 4. PM2 で起動
if ! command -v pm2 &>/dev/null; then
  npm install -g pm2
fi

# .env を PM2 に読み込ませる
export $(grep -v '^#' "$ENV_FILE" | xargs)

pm2 delete ossalt-worker 2>/dev/null || true
pm2 start "$WORKER_DIR/ecosystem.config.cjs"
pm2 save

echo ""
echo "=== Done! ==="
echo ""
echo "手動実行テスト:"
echo "  cd $WORKER_DIR && node src/jobs/discover-hn.mjs"
echo "  cd $WORKER_DIR && node src/jobs/discover-github.mjs"
echo "  cd $WORKER_DIR && node src/jobs/request-index.mjs"
echo ""
echo "ログ確認:"
echo "  pm2 logs ossalt-worker"
