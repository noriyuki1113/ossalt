---
type: comparison
slug: github-vs-forgejo
tool_a: github
tool_b: forgejo
saas_context: github
last_reviewed: 2026-04-05
confidence: medium
source_count: 3
---

# GitHub vs Forgejo

## 比較の文脈

「GitHub をセルフホストで置き換えたい、かつコミュニティガバナンスの OSS を使いたい」という動機での比較。Forgejo は Gitea のコミュニティフォークで、**ガバナンスへの思想的なこだわりがある場合に Gitea の代わりに選ぶ候補**。機能・導入感は Gitea とほぼ同等。[Source](https://forgejo.org/)

## TL;DR（どちらを選ぶべきか・条件付きで）

| 選ぶべき状況 | 推奨 |
|---|---|
| コミュニティガバナンスの OSS を重視する | **Forgejo** |
| GPL-3.0（コピーレフト）を好む | **Forgejo** |
| Codeberg.org と同じソフトを使いたい | **Forgejo** |
| Gitea と差がないなら日本語情報が多い方がいい | **Gitea（他候補）** |
| MIT ライセンスが必要 | **Gitea（他候補）** |
| GitHub のエコシステムを維持したい | **GitHub** |

## 比較表

| 軸 | GitHub | Forgejo |
|---|---|---|
| 提供形態 | SaaS | OSS（GPL-3.0）/ セルフホスト |
| コスト | $4/人/月（Team）〜 | 無料（セルフホスト） |
| Gitea との差 | — | ほぼ同等（フォーク） |
| ガバナンス | Microsoft 傘下 | コミュニティ合議制 |
| ライセンス | プロプライエタリ | GPL-3.0 |
| CI/CD | GitHub Actions | Forgejo Actions（互換） |
| 日本語情報 | 豊富 | 少ない |
| 実績インスタンス | GitHub.com | Codeberg.org |

## 各軸での詳細比較

### Gitea との実質的な差

Forgejo は Gitea のフォークであり、機能・UI・API・データ形式がほぼ同一。**技術的な観点では Gitea と Forgejo のどちらを選んでも運用上の差は小さい**。主な違いはガバナンス（商業企業 vs コミュニティ）とライセンス（MIT vs GPL-3.0）という思想的な差。

### GitHub との差

Gitea との比較（→ `github-vs-gitea.md` 参照）とほぼ同一。GitHub の高度な機能（Copilot・Code Scanning・Dependabot・大規模エコシステム）は Forgejo にない。

### ガバナンスと持続可能性

Gitea 社の設立によりコミュニティの一部が懸念したのは「ビジネス判断が OSS の方向性に影響する」リスク。Forgejo はこの懸念に応えて、意思決定をコミュニティの合議制にしている。OSS の持続可能性・独立性を重視するなら Forgejo が哲学的に一致する選択。

## 移行摩擦

GitHub → Forgejo の摩擦は GitHub → Gitea とほぼ同等（`github-vs-gitea.md` 参照）。Gitea → Forgejo の移行はデータ互換性があるため非常に容易。

## 結論

Forgejo は **「Gitea と同等のものをコミュニティガバナンスで使いたい」** という思想的な動機で選ぶツール。機能・導入コスト・使い勝手は Gitea とほぼ同じ。迷ったら日本語情報が豊富な Gitea を先に検討し、ガバナンスへのこだわりがあれば Forgejo という判断で良い。

## Open questions

- Forgejo と Gitea の機能差が今後拡大するか縮小するか（開発ロードマップの比較）
- Forgejo の日本語情報・コミュニティが成長するか

## Evidence sources

- https://forgejo.org/
- https://github.com/pricing
- https://codeberg.org/forgejo/forgejo
