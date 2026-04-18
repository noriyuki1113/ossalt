# ossalt OG Image Service

Generates per-page OG images for ossalt.jp using [satori](https://github.com/vercel/satori) + [@resvg/resvg-js](https://github.com/nicolo-ribaudo/resvg-js).

## Deploy (Xserver VPS: 162.43.50.241)

```bash
# 1. Copy this directory to the VPS
scp -r og-service/ root@162.43.50.241:/opt/ossalt-og/

# 2. Run setup (installs Node, fonts, PM2)
ssh root@162.43.50.241 "bash /opt/ossalt-og/setup.sh"

# 3. Test
curl "http://162.43.50.241:3000/og?type=tool&name=AppFlowy&competitor=Notion&category=ビジネス" -o test.png
```

## API

| Param | Values | Description |
|-------|--------|-------------|
| `type` | `tool` \| `alt` \| `compare` \| `default` | Page type |
| `name` | string | Tool name or SaaS name |
| `competitor` | string | SaaS competitor (for `tool` type) |
| `category` | string | Category in Japanese |
| `oss` | string | OSS name (for `compare` type) |
| `saas` | string | SaaS name (for `compare` type) |

## Examples

```
/og?type=tool&name=AppFlowy&competitor=Notion&category=ビジネス
/og?type=compare&oss=Mattermost&saas=Slack
/og?type=alt&name=Figma
/og
```

## Nginx cache config

See `setup.sh` for the nginx config snippet (proxy + disk cache).

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP port |
