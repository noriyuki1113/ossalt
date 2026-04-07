---
type: tool
slug: mailcow
name: Mailcow
category: email-hosting
github: https://github.com/mailcow/mailcow-dockerized
stars: 9000
language: PHP / Shell / Docker
last_commit: 2026-04-01
license: GPL-2.0
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-07
confidence: medium
source_count: 2
replaces:
  - google-workspace
related_tools:
  - mailu
---

# Mailcow

## 一言定義

Docker Compose でフルスタックのメールサーバーを構築できる OSS。Postfix（送受信）・Dovecot（IMAP）・SOGo（Web メール）・Rspamd（スパムフィルター）・管理 Web UI を統合した「メールサーバーのオールインワン Docker スタック」。

## Positioning

Mailcow は「メールサーバーのセルフホストを現実的にした OSS」として評価が高い。以前は複数のコンポーネントを個別に設定する必要があったメールサーバー構築を、Docker Compose + Web 管理 UI で大幅に簡略化した。GPL-2.0 ライセンス、GitHub スター 9,000 超。商用組織向けの有料サポート（Mailcow Pro）も提供。

## 強み

- **フルスタック統合**: Postfix・Dovecot・SOGo・Rspamd・ClamAV・Let's Encrypt 自動更新を Docker Compose で統合
- **Web 管理 UI**: ドメイン・メールボックス・エイリアス・スパムルール・DKIM をブラウザで管理できる
- **SOGo Web メール**: ブラウザからのメール送受信・カレンダー・連絡先に対応
- **Rspamd スパムフィルター**: 高精度なスパムフィルタリングを標準装備
- **Let's Encrypt 統合**: TLS 証明書の自動取得・更新
- **LDAP / Active Directory 統合**: 企業環境との統合が可能
- **活発なメンテナンス**: 定期的なアップデートとセキュリティパッチ

## 弱み・注意点

- **セルフホストの難易度は高い**: メールサーバー全般の難しさ（IP レピュテーション・配信到達性・SPF/DKIM/DMARC）は Mailcow でも変わらない
- **サーバー要件が高め**: 最低 2GB RAM（推奨 4GB+）、専用 VPS が必要
- **IPv6 の注意点**: 一部 VPS プロバイダーでの IPv6 設定が複雑
- **スパムフィルターの調整**: Rspamd の初期設定は比較的優秀だが、本番運用には調整が必要
- **IP ブラックリスト問題**: 新規 VPS の IP が既存のブラックリストに登録されている場合があり、事前確認が必要
- **GPL-2.0**: 商用利用には注意が必要な場合がある

## どんなユーザーに向くか

- **技術力のある中小企業・組織**: メールサーバー管理の経験があるエンジニアがいる組織
- **GDPR・国内保管要件**: メールデータを自社サーバーで管理することが規制上必要な組織
- **Google Workspace のコスト削減**: 大人数の組織で月額コストを大幅に削減したい
- **フル機能メールサーバー**: Web メール・カレンダー・連絡先まで OSS で統合したい
- **Mailu より多機能が必要**: SOGo・LDAP 連携・詳細な管理 UI が必要な場合

## セルフホスト難易度

**高い**（メールカテゴリの中では相対的に整備されているが、メール自体が難しい）。

必要な作業：
1. 専用 VPS（推奨 4GB RAM 以上）の用意
2. 独自ドメインの DNS 設定（A/MX/PTR レコード・SPF・DKIM・DMARC）
3. Docker + Docker Compose のインストール
4. `docker compose up -d` での起動（比較的簡単）
5. **IP レピュテーションの確認と育成**（最も重要・最も難しい）
6. 継続的なセキュリティアップデートの適用

PTR レコード（逆引き DNS）の設定には VPS プロバイダーの協力が必要な場合がある。

## 日本語圏での採用状況

Qiita に Mailcow のセットアップ記事が複数存在し、個人エンジニアによるセルフホスト事例がある。組織での採用は限定的で、「Google Workspace の代替」として本格導入した事例の報告は少ない。日本語の管理 UI はないが、Web UI は直感的で英語力が低くても扱いやすい。

## ossaltにおける推薦文脈

Google Workspace 代替として「セルフホストメールが必要な組織への最初の推薦候補」。ただし **必ずリスク（IP レピュテーション・運用負荷・配信到達性）を先に説明**し、「技術力・運用体制がある組織に限定した推薦」というトーンを維持する。「メールはクラウドのまま・他だけ OSS 化する」というハイブリッド戦略も提示する。

## Open questions

- Mailcow の IP レピュテーション問題を回避するための VPS プロバイダー選定ガイドラインの作成
- SendGrid 等のリレー（SMTP リレー）を組み合わせた「配信到達性問題を回避する Mailcow 運用」の評価
- Mailcow vs Mailu の機能差が実際の採用判断にどう影響するか
- 日本の中小企業でのフルセルフホストメール採用の現実的な可能性

## Evidence sources

- https://mailcow.email/
- https://github.com/mailcow/mailcow-dockerized
