#!/bin/bash
# Setup script for ossalt OG service on Xserver VPS (162.43.50.241)
# Run as root or with sudo

set -e

echo "=== ossalt OG service setup ==="

# 1. Install Node.js 20 (if not present)
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

# 2. Download Noto Sans JP Bold font
FONT_DIR="$(dirname "$0")/fonts"
mkdir -p "$FONT_DIR"
if [ ! -f "$FONT_DIR/NotoSansJP-Bold.ttf" ]; then
  echo "Downloading NotoSansJP-Bold.ttf..."
  curl -L -o "$FONT_DIR/NotoSansJP-Bold.ttf" \
    "https://github.com/notofonts/noto-cjk/raw/main/Sans/OTF/Japanese/NotoSansCJKjp-Bold.otf" \
    || \
  # Fallback: Google Fonts CDN via noto-fonts-cjk
  (apt-get install -y fonts-noto-cjk && \
   cp /usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc "$FONT_DIR/NotoSansJP-Bold.ttf")
fi

# 3. Install npm dependencies
cd "$(dirname "$0")"
npm install

# 4. Install PM2 if not present
if ! command -v pm2 &>/dev/null; then
  npm install -g pm2
fi

# 5. Start with PM2
pm2 delete ossalt-og 2>/dev/null || true
pm2 start src/server.mjs --name ossalt-og --env production
pm2 save
pm2 startup

echo ""
echo "=== nginx config snippet ==="
cat <<'NGINX'
# Add to your nginx server block:
# (or create /etc/nginx/sites-available/og.ossalt.jp)

location /og {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_cache_path /var/cache/nginx/og levels=1:2 keys_zone=og_cache:10m max_size=500m inactive=24h;
    proxy_cache og_cache;
    proxy_cache_valid 200 24h;
    proxy_cache_use_stale error timeout updating;
    add_header X-Cache-Status $upstream_cache_status;
}
NGINX

echo ""
echo "=== Done! ==="
echo "Test: curl http://162.43.50.241:3000/og?type=tool&name=AppFlowy&competitor=Notion"
