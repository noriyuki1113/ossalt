---
type: category
slug: paas-deployment
name: PaaS・アプリデプロイ
ossalt_category: paas-deployment
tool_count: 2
last_reviewed: 2026-04-07
confidence: medium
source_count: 3
---

# PaaS・アプリデプロイ

## 概要

アプリケーションのデプロイ・管理・スケールを提供するプラットフォーム（PaaS）のカテゴリ。Heroku が開発者体験の標準を作ったが、2022 年の無料プラン廃止と Salesforce 買収後の停滞を動機に、Coolify / Dokku などのセルフホスト PaaS 代替への移行が増えている。「$5 の VPS で Heroku ライクな体験」という訴求が成立するカテゴリ。

## なぜ今注目されているか

**1. Heroku 無料プラン廃止（2022 年）**
長年多くの開発者・スタートアップが使っていた Heroku の無料プランが 2022 年 11 月に廃止された。「無料で動かしていたアプリの移行先」を探す需要が急増し、Render・Railway・Fly.io（SaaS 代替）と Coolify・Dokku（セルフホスト代替）の両方が注目を集めた。

**2. Coolify の急成長**
Coolify v4 のリリース（2024 年）を機に注目が高まり、GitHub スター 3.6 万超に達した。「VPS 上で Heroku + Netlify + Vercel を代替できる」という訴求が広く受け入れられている。

**3. VPS のコスト低下**
Hetzner・Vultr・DigitalOcean の VPS が 4GB RAM で月 €4〜$6 まで低価格化しており、「セルフホスト PaaS の経済的合理性」が高まっている。

## 主要ツールの勢力図

```
  Web UI・初心者向け ←────────────── CLI・エンジニア向け
         |                                    |
      Coolify                              Dokku
  (モダン UI・多機能)                 (Heroku CLI互換・軽量)
```

| ツール | ポジション | GitHub ★ | ライセンス |
|---|---|---|---|
| Coolify | Web UI 重視のモダン PaaS OSS | 36,000 | Apache-2.0 |
| Dokku | CLI 重視の Heroku ライク PaaS OSS | 26,000 | MIT |

**参考（OSS ではないが Heroku 代替として台頭）**:
- Render: Heroku 代替 SaaS。無料枠あり。開発者体験が良い
- Railway: Heroku ライクな SaaS。日本からのアクセスも良好
- Fly.io: Docker ベースの分散 PaaS

## 注目の動き（直近）

- **Coolify v4 の機能拡充**: マルチサーバー管理・GitHub Actions 連携・ワンクリックサービス起動が強化
- **Kamal（Basecamp 製）の登場**: Rails アプリを VPS にデプロイする `kamal deploy` コマンドが登場し、「Heroku の代替としての Kamal」という選択肢が Ruby コミュニティで注目されている
- **Nixpacks の普及**: Heroku ビルドパック互換の次世代ビルドツール Nixpacks が Coolify・Railway で採用され、「設定なしで多くの言語・フレームワークをビルドできる」体験が広がっている

## 日本語圏での温度感

Heroku 無料プラン廃止後、日本でも「Heroku からどこに移行するか」という議論が活発になった。Zenn・Qiita では Render・Railway・Fly.io（SaaS）への移行記事が多く、セルフホスト（Coolify・Dokku）への移行は技術力があるエンジニアに限られる傾向がある。

「月 $5〜20 の VPS で全部自分で管理する」というセルフホスト PaaS は、DevOps 文化が浸透しているチームでの採用が中心。個人開発者はコスト重視で Coolify を選ぶケースが増えている。

## ossaltにおける推薦方針

### ユーザーのニーズで分岐させる

```
「どんな用途？」
├── 個人プロジェクト・スタートアップ初期
│   ├── Web UI で管理 → Coolify
│   └── CLI・Heroku 互換重視 → Dokku
├── 本格的な本番サービス（中規模以上）
│   ├── 自社インフラ管理できる → Coolify + 冗長化設計
│   └── マネージドサービスが良い → Render / Railway / Fly.io
└── 大規模・エンタープライズ → Kubernetes（別カテゴリ）
```

### 「SaaS 代替（Render/Railway）vs セルフホスト（Coolify/Dokku）」の選択も提示

セルフホスト PaaS は安いが「サーバー管理の責任」を負う。Render・Railway は有料だが「Heroku に近い体験」でインフラ管理不要。この二択をユーザーの技術力・コスト感覚で判断させる。

## Open questions

- Coolify の本番環境での長期稼働実績（大規模トラフィックへの対応）
- Kamal との比較（Rails 以外の言語での使いやすさ）
- Coolify vs Dokku の実際の採用分岐点の調査
- セルフホスト PaaS のバックアップ・障害対応のベストプラクティス整理

## Evidence sources

- https://www.heroku.com/pricing
- https://coolify.io/
- https://dokku.com/
