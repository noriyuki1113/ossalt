---
type: tool
slug: mailu
name: Mailu
category: email-hosting
github: https://github.com/Mailu/Mailu
stars: 5800
language: Python / Docker
last_commit: 2026-03-01
license: MIT
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-07
confidence: medium
source_count: 2
replaces:
  - google-workspace
related_tools:
  - mailcow
---

# Mailu

## 一言定義

シンプルさを重視した Docker ベースの OSS メールサーバー。Mailcow より設定項目が少なく、「最小限の設定でメールサーバーを立ち上げたい」小規模組織向け。MIT ライセンス。

## Positioning

Mailu は「シンプルなメールサーバー OSS」として Mailcow の軽量代替的な位置づけ。Python + Docker ベースで、設定ファイルは `mailu.env` の環境変数で管理する。Mailcow が多機能・高設定自由度を重視するのに対し、Mailu はシンプルさと小規模組織への適合を重視。MIT ライセンス、GitHub スター 5,800 超。内蔵 Web メール（Roundcube または Snappymail）を含む。

## 強み

- **シンプルな設定**: `mailu.env` 環境変数ファイルと `docker-compose.yml` で構成。Mailcow より設定が少ない
- **MIT ライセンス**: 商用利用・改変・再配布に制限なし
- **軽量**: Mailcow より少ないリソースで動作（最低 1GB RAM から動作可能）
- **Web メール内蔵**: Roundcube または Snappymail をオプションで内蔵
- **SPF/DKIM/DMARC 設定サポート**: セットアップウィザードで基本的な DNS 設定をガイド
- **管理 Web UI**: ドメイン・メールボックス管理の基本 UI が付属

## 弱み・注意点

- **Mailcow より機能が少ない**: SOGo（カレンダー・連絡先同期）・LDAP 統合・詳細なスパム管理は Mailcow が優れる
- **コミュニティが小さい**: Mailcow より GitHub スターが少なく、日本語情報もより少ない
- **メールのセルフホスト固有のリスクは変わらない**: IP レピュテーション・配信到達性問題は Mailu でも同様
- **更新頻度**: Mailcow と比べてリリース頻度がやや低い

## どんなユーザーに向くか

- **小規模組織・個人**: 5〜20 人程度の小規模チームでシンプルなメールサーバーが必要
- **Mailcow の多機能が不要**: カレンダー・連絡先同期・LDAP は不要で、メールの送受信だけが目的
- **MIT ライセンスが重要**: GPL-2.0（Mailcow）より MIT が必要な組織
- **リソース制約がある**: 低スペックの VPS でメールサーバーを動かしたい

## セルフホスト難易度

**高い**（Mailcow と同様。メール自体の難しさは変わらない）。Mailu のセットアップ自体は Mailcow よりシンプルだが、DNS 設定・IP レピュテーション・配信到達性の問題はすべて同様に発生する。

## 日本語圏での採用状況

Mailcow より認知度が低く、日本語の記事・事例はさらに少ない。個人エンジニアによるセルフホスト試用事例がわずかに存在する程度。

## ossaltにおける推薦文脈

Google Workspace 代替の **Mailcow の次の選択肢**として位置づける。「Mailcow の機能が過剰・MIT ライセンスが必要・小規模 5〜20 人」という条件が揃う場合に Mailu を提案。ただしメールのリスク説明は Mailcow と同様に行う。

## Open questions

- Mailu と Mailcow の実際の選択基準（機能差・ライセンス・リソース以外の軸）
- Mailu の開発継続性の見通し（コントリビューター数・メンテナ状況）
- SMTP リレー（SendGrid / Amazon SES）と組み合わせた配信到達性問題の回避策

## Evidence sources

- https://mailu.io/
- https://github.com/Mailu/Mailu
