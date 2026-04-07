---
type: tool
slug: listmonk
name: Listmonk
category: email-marketing
github: https://github.com/knadh/listmonk
stars: 15000
language: Go / Vue.js
last_commit: 2026-04-01
license: AGPL-3.0
self_hostable: true
local_first: false
ossalt_listed: true
last_reviewed: 2026-04-07
confidence: medium
source_count: 2
replaces:
  - mailchimp
related_tools:
  - mautic
---

# Listmonk

## 一言定義

Go 製の軽量・高速なニュースレター配信 OSS。シングルバイナリで動作し、Mailchimp の「メール配信・購読管理」部分を最小のフットプリントで代替する。SMTP リレー（Amazon SES 等）と組み合わせて使う。

## Positioning

Listmonk は インドの Kailash Nadh 氏が開発した OSS メールキャンペーン・ニュースレターツール。AGPL-3.0 ライセンス、GitHub スター 1.5 万超。Go + Vue.js 製でシングルバイナリ（PostgreSQL を外部 DB として使用）。「Mailchimp の配信・購読管理だけを OSS で」という明確なスコープで、シンプルさと軽量さが最大の強み。自前の SMTP サーバーまたは Amazon SES / SendGrid とを組み合わせて使う。

## 強み

- **軽量・高速**: Go 製シングルバイナリ。512MB RAM で動作し、大量メールの高速配信が可能
- **シンプルな設計**: 購読者管理・リスト管理・キャンペーン送信・テンプレート管理に特化
- **低コスト**: Amazon SES（1,000 通 $0.10）と組み合わせると月数百円から運用可能
- **テンプレートエンジン**: Go テンプレート + 独自の変数展開でパーソナライゼーションが可能
- **API 対応**: REST API でプログラムから購読者管理・配信制御が可能
- **バウンス管理**: バウンスメール（宛先不明）の自動処理
- **AGPL-3.0**: コミュニティによる継続的な開発

## 弱み・注意点

- **マーケティングオートメーションなし**: ドリップシーケンス・行動トリガー・A/B テストは持たない
- **ドラッグ&ドロップエディタがない**: テンプレートは HTML で書く必要がある（WYSIWYG エディタは限定的）
- **配信到達性は自己責任**: SMTP リレー（Amazon SES 等）の設定と到達性管理が必要
- **AGPL-3.0**: SaaS として外部提供する場合はソース公開義務の可能性
- **高度なセグメント機能は限定的**: Mailchimp のような複雑なセグメント条件設定には劣る

## どんなユーザーに向くか

- **ニュースレター配信が主目的**: ブログ・メディア・コミュニティニュースレターを定期配信したい
- **Mailchimp の連絡先課金を回避したい**: 10 万件以上のリストを Mailchimp で管理するコストを削減したい
- **技術者がいる組織**: HTML テンプレート作成・SMTP 設定ができるエンジニアがいる
- **API 連携が必要**: REST API でサービスから自動的に購読者管理・メール配信したい
- **シンプルさ重視**: Mautic のような高機能は不要で、配信だけが目的

## セルフホスト難易度

**低い**（メール配信 OSS の中では最も簡単）。シングルバイナリ + PostgreSQL のシンプルな構成。Docker でも単純に起動できる。最低 512MB RAM。SMTP 設定（Amazon SES / SendGrid の API キー入力）で 15〜30 分でセットアップ完了。

## 日本語圏での採用状況

日本語圏での認知度は上昇中。Zenn・Qiita に「Mailchimp から Listmonk に移行した」記事が増えており、ニュースレター配信のコスト削減目的での採用事例がある。日本語 UI は部分対応。

## ossaltにおける推薦文脈

Mailchimp 代替として **ニュースレター配信・メールキャンペーンのシンプルな代替として最初に推薦**。「毎月の Mailchimp 課金を削減したい」「連絡先が増えてコストが急増した」という文脈で最も成立しやすい推薦。マーケティングオートメーション（ドリップ・行動トリガー）が必要な場合は Mautic を第 2 候補として提示。

## Open questions

- Listmonk + Amazon SES の組み合わせでの実際の配信到達性（スパム判定率）
- Listmonk の HTML テンプレートを WYSIWYG エディタで作る方法（サードパーティ連携）
- Listmonk の購読者数上限（PostgreSQL のスケール限界）の実態
- 日本語コンテンツのメール配信での文字化け・エンコード問題の有無

## Evidence sources

- https://listmonk.app/
- https://github.com/knadh/listmonk
