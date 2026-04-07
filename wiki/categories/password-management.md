---
type: category
slug: password-management
name: パスワード管理
ossalt_category: password-management
tool_count: 2
last_reviewed: 2026-04-05
confidence: medium
source_count: 3
---

# パスワード管理

## 概要

個人・チームのパスワード・機密情報を安全に保管・共有・管理するツールのカテゴリ。1Password・LastPass・Dashlane 等の SaaS が市場を占めていたが、LastPass の大規模漏洩（2022 年）をきっかけにセキュリティへの不信と OSS・セルフホスト型への移行需要が急増した。ossalt では **Bitwarden（クラウド OSS）と Vaultwarden（セルフホスト軽量版）** を中心に扱う。

## なぜ今注目されているか

**1. LastPass の大規模漏洩（2022 年）**
LastPass のインシデントで、暗号化されたパスワード保管庫がサーバーから流出した。「クラウド型パスワードマネージャーは安全なのか」という疑問が一般化し、OSS・セルフホスト型への関心が急増した。

**2. データ所有権への意識の高まり**
パスワードという最機密データを第三者企業のサーバーに預けることへの根本的な不安。「ゼロ知識暗号化」を謳っていても、クラウドにデータがある事実は変わらない。

**3. Bitwarden の無料化・機能拡充**
Bitwarden が個人向け無料プランを維持しつつ TOTP 生成・緊急アクセスを無料化するなど、1Password からの移行障壁を下げ続けている。

**4. Vaultwarden の台頭**
Rust 製の軽量 Bitwarden 互換サーバーが GitHub スター 4 万超に達し、「自分のサーバーで Bitwarden を動かす」選択肢が一般的になった。

## 主要ツールの勢力図

```
       クラウド管理 ←──────────────── 完全自己管理
             |                              |
高機能    Bitwarden               Bitwarden
           (クラウド版)          + Vaultwarden
             |                    (セルフホスト)
           無料〜有償               完全無料・軽量
```

| ツール | ポジション | GitHub ★ | ライセンス |
|---|---|---|---|
| Bitwarden | 1Password近似・OSS・クラウド無料 | 16,000（サーバー） | AGPL-3.0 |
| Vaultwarden | 超軽量セルフホスト・Bitwarden互換 | 41,000 | AGPL-3.0 |

## 注目の動き（直近）

- **Bitwarden** が Passkey（パスキー）管理機能を追加し、パスワードレス認証時代への対応を強化している。
- **Vaultwarden** が継続的にメンテナンスされており、Bitwarden の新機能に追従している。
- **パスキー時代の到来**: Apple / Google / Microsoft のパスキー対応が進む中、パスワードマネージャー自体の役割がどう変化するかが注目点になっている。

## 日本語圏での温度感

LastPass 漏洩以降、「パスワードマネージャー 乗り換え」「Bitwarden 移行」の検索が急増した。Zenn・Qiita・個人ブログに移行記事が多数あり、日本語圏での Bitwarden 認知度は高い。

Vaultwarden については「Raspberry Pi に建てた」「VPS に入れた」系の記事が多く、自宅サーバー・個人インフラ趣味層との親和性が高い。企業での採用はエンジニアチームが先行し、全社展開は少ない印象。

## ossaltにおける推奨方針

### 移行動機による分岐

```
「なぜパスワードマネージャーを変えたい？」
├── コストを下げたい → Bitwarden 無料クラウド版
├── OSS を使いたい → Bitwarden（コード完全公開）
├── クラウドに預けたくない → Bitwarden + Vaultwarden（セルフホスト）
└── LastPass から逃げたい → Bitwarden（移行手順が最も整備されている）
```

### 「セルフホスト = 安全」は誤解と明示する

Vaultwarden のセルフホストは「クラウドへのデータ送信をゼロにする」という意味では有効だが、自分のサーバーのセキュリティ管理（HTTPS・アップデート・バックアップ）が不十分なら、クラウド版より危険になる可能性がある。

### 移行手順がカテゴリ中で最も整備されている点を強調

1Password / LastPass → Bitwarden の移行は、エクスポート→インポートで 1 時間以内に完了することが多く、**全 SaaS 代替の中で最も移行摩擦が小さいカテゴリのひとつ**として訴求できる。

## Open questions

- パスキー（FIDO2）の普及が進んだ場合、パスワードマネージャーの役割はどう変わるか
- Bitwarden の組織機能（Teams）を日本の中小企業が実際に業務利用しているか
- Vaultwarden の長期的なメンテナンス継続性（個人開発者依存のリスク）

## Evidence sources

- https://bitwarden.com/
- https://github.com/dani-garcia/vaultwarden
- https://1password.com/jp/
