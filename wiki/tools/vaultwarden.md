---
type: tool
slug: vaultwarden
name: Vaultwarden
category: password-management
github: https://github.com/dani-garcia/vaultwarden
stars: 41000
language: Rust
last_commit: 2026-04-01
license: AGPL-3.0
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-05
confidence: medium
source_count: 2
replaces:
  - 1password
related_tools:
  - bitwarden
---

# Vaultwarden

## 一言定義

Bitwarden 互換の超軽量セルフホストサーバー（Rust 製）。Bitwarden の公式クライアントがそのまま使えるまま、シングルコンテナで Raspberry Pi でも動く。**「自分のパスワードを自分のサーバーで管理したい」用途の事実標準**。

## Positioning

Vaultwarden は元々「bitwarden_rs」という名前で開発された非公式の Bitwarden サーバー互換実装。Bitwarden の公式セルフホスト版が重すぎる（複数コンテナ・高リソース要件）という問題を、Rust で書き直した軽量サーバーで解決した。

Bitwarden の API を完全に実装しているため、Bitwarden の**公式クライアント（ブラウザ拡張・iOS・Android・デスクトップ）をそのまま使える**。ユーザーはサーバーが Vaultwarden であることをほとんど意識しない。GitHub スター 4.1 万超（2026 年 4 月）という圧倒的な人気がその実用性を示している。[Source](https://github.com/dani-garcia/vaultwarden)

## 強み

- **超軽量**: シングルバイナリ・シングルコンテナで動作。Raspberry Pi 4 や 1GB RAM の VPS でも問題なく動く。
- **Bitwarden クライアントがそのまま使える**: ブラウザ拡張・iOS・Android・デスクトップの公式 Bitwarden クライアントを向き先サーバーを変えるだけで使用できる。
- **完全自己管理**: データが完全に自分のサーバーにのみ存在する。クラウドへのデータ送信ゼロ。
- **Bitwarden Premium 機能が無料**: 本来 Bitwarden クラウドでは有償の TOTP 生成・緊急アクセス・Vault Health レポートなどが Vaultwarden では無料で使える。
- **GitHub スター 4.1 万超**: セルフホスト型パスワードマネージャーとして圧倒的な人気と実績。
- **SQLite / MySQL / PostgreSQL 対応**: 用途に合わせてデータベースを選択できる。小規模個人用途なら SQLite で十分。
- **AGPL-3.0**: 完全 OSS。

## 弱み・注意点

- **非公式実装**: Bitwarden 社の公式サポートではないため、Bitwarden のアップデートに追従するまでのタイムラグがある場合がある。
- **セキュリティ責任はユーザー**: 自分のサーバーの HTTPS 設定・アップデート・バックアップを自分で管理する必要がある。パスワードマネージャーのサーバーなので、セキュリティ管理ミスのリスクが直結する。
- **アップデート管理**: Docker イメージの更新を自分でトリガーする必要がある。自動更新の仕組み（Watchtower 等）を別途設定することが推奨される。
- **サポートなし**: 問題が発生した場合は GitHub Issues・コミュニティフォーラムが頼り。公式サポートはない。

## どんなユーザーに向くか

| ユーザー像 | 向く理由 |
|---|---|
| 自分のパスワードを自分のサーバーで管理したい個人 | 完全自己管理・クラウドへのデータ送信ゼロ |
| 低スペックな VPS / Raspberry Pi で運用したい | シングルコンテナで 256MB RAM でも動く |
| Bitwarden Premium 機能を無料で使いたい | TOTP・緊急アクセス等が無料で利用可能 |
| 小規模チームのパスワード共有をセルフホストしたい | 組織機能もサポート |

Bitwarden クラウド版（無料）で十分な個人ユーザーには Vaultwarden は不要。「クラウドにパスワードを預けたくない」という強い動機がある場合に価値が出る。

## セルフホスト難易度

**低程度**（パスワードマネージャーのセルフホストとしては最も簡単な部類）

```yaml
# docker-compose.yml の最小構成
services:
  vaultwarden:
    image: vaultwarden/server:latest
    volumes:
      - ./vw-data:/data
    ports:
      - 80:80
```

- Docker Compose 10 行程度で起動できる。
- HTTPS（Let's Encrypt / Cloudflare Tunnel / Nginx リバースプロキシ）の設定が必須。これが最低限の追加作業。
- SQLite がデフォルトで、別途 DB サーバーは不要。
- 週次のバックアップ設定（`/data` ディレクトリのコピー）を忘れずに設定する。

## 日本語圏での採用状況

セルフホスト型パスワードマネージャーの中で最も日本語情報が充実している。Zenn・Qiita・個人ブログに「Vaultwarden を Raspberry Pi に建てた」「VPS に Vaultwarden を入れた」系の記事が多数。

個人での採用が中心だが、小規模チームでの採用事例も増えている。LastPass 漏洩事件以降の流入が特に多い。

## ossaltにおける推奨文脈

Vaultwarden を推薦すべき文脈：

1. **「パスワードを絶対にクラウドに預けたくない」** — 完全自己管理の唯一の選択肢（実用水準では）。
2. **「低スペックのサーバーでパスワードマネージャーをセルフホストしたい」** — 軽量さは圧倒的。
3. **「Bitwarden クライアントは気に入っているがサーバーだけ自前にしたい」** — 既存クライアント資産をそのまま活用できる。

Vaultwarden を推薦しにくい文脈：

- セキュリティ管理に自信がない / 自分でサーバーを管理できない場合（Bitwarden クラウド無料版の方が安全）
- 公式サポートが必要な組織

## Open questions

- Vaultwarden の Bitwarden アップデート追従の実際のタイムラグ（セキュリティパッチ含む）
- 個人運用での推奨バックアップ手順と復元テストの頻度
- Vaultwarden の組織機能（チーム共有）の実用性と上限規模

## Evidence sources

- https://github.com/dani-garcia/vaultwarden
- https://bitwarden.com/
