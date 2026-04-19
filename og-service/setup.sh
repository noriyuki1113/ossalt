#!/bin/bash
# ossalt OG image service — Ubuntu setup
# Run as root on Xserver VPS (162.43.50.241)
set -euo pipefail

SERVICE_DIR="/opt/ossalt-og"
FONT_DIR="$SERVICE_DIR/fonts"
FONT_URL="https://github.com/googlefonts/noto-cjk/raw/main/Sans/OTF/Japanese/NotoSansCJKjp-Bold.otf"

echo "=== ossalt OG service setup (Ubuntu) ==="

# 1. System packages
apt-get update -qq
apt-get install -y curl nginx

# 2. Node.js 20
if ! node --version 2>/dev/null | grep -q "^v20"; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
echo "Node: $(node --version)"

# 3. Font — Noto Sans JP Bold
mkdir -p "$FONT_DIR"
if [ ! -f "$FONT_DIR/NotoSansJP-Bold.otf" ]; then
  echo "Downloading Noto Sans JP Bold (~15MB)..."
  curl -L --fail -o "$FONT_DIR/NotoSansJP-Bold.otf" "$FONT_URL"
fi

# 4. npm dependencies
cd "$SERVICE_DIR"
npm install --omit=dev

# 5. PM2
if ! command -v pm2 &>/dev/null; then
  npm install -g pm2
fi

pm2 delete ossalt-og 2>/dev/null || true
PORT=3000 pm2 start src/server.mjs --name ossalt-og
pm2 save

# pm2 startup: run the printed command manually after this script
pm2 startup | tail -1

# 6. nginx — proxy + cache
mkdir -p /var/cache/nginx/og

cat > /etc/nginx/sites-available/og <<'NGINX'
proxy_cache_path /var/cache/nginx/og
  levels=1:2
  keys_zone=og_cache:10m
  max_size=500m
  inactive=24h
  use_temp_path=off;

server {
    listen 80;
    server_name 162.43.50.241;

    location /og {
        proxy_pass         http://127.0.0.1:3000;
        proxy_set_header   Host $host;
        proxy_cache        og_cache;
        proxy_cache_key    "$uri$is_args$args";
        proxy_cache_valid  200 24h;
        proxy_cache_use_stale error timeout updating;
        proxy_cache_lock   on;
        add_header         X-Cache-Status $upstream_cache_status;

        # SNS crawlers need these
        add_header Access-Control-Allow-Origin "*";
    }

    location /health {
        proxy_pass http://127.0.0.1:3000;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/og /etc/nginx/sites-enabled/og
rm -f /etc/nginx/sites-enabled/default

nginx -t && systemctl reload nginx

echo ""
echo "=== Done! ==="
echo ""
echo "Test:"
echo "  curl -o /tmp/test.png 'http://162.43.50.241/og?type=tool&name=AppFlowy&competitor=Notion&category=ビジネス'"
echo "  file /tmp/test.png  # should say: PNG image data, 1200 x 630"
echo ""
echo "If PM2 startup printed a command above, run it to enable auto-start on reboot."
