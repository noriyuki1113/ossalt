import { useParams, Link } from "react-router-dom";
import { ChevronRight, ArrowLeft, BookOpen, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { useSeo } from "@/hooks/use-seo";
import { track } from "@/lib/track";
import { useEffect } from "react";

/* ── Guide data ── */

interface GuideSection {
  heading: string;
  content: string[];
}

interface GuideData {
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  audience: string;
  sections: GuideSection[];
  checklist: string[];
  relatedLinks: { label: string; href: string }[];
}

const GUIDES: Record<string, GuideData> = {
  "slack-alternatives": {
    title: "Slack代替OSSを比較する観点",
    metaTitle: "Slack代替OSSを比較する観点 | OSSアルタナティブ",
    metaDescription: "Slackの代わりに使えるOSSチャットツールを比較するための観点を解説。リアルタイム通信・連携・運用面から最適解を見つけるガイド。",
    intro: "Slackは便利なチャットツールですが、ユーザー数の増加に伴い費用が跳ね上がります。また、メッセージ履歴の保持制限やデータの外部保管が気になる企業もあります。このガイドでは、Slack代替OSSを比較する際に重視すべき観点をまとめます。",
    audience: "Slackの利用料金を削減したい方、チャットデータを自社管理したい方、外部連携を重視する方",
    sections: [
      {
        heading: "比較時に見るべき観点",
        content: [
          "メッセージ履歴の保持: Slackの無料プランでは履歴に制限がありますが、OSSならすべてのメッセージを無制限に保持できるのが大きなメリットです。",
          "外部サービス連携（Webhook/Bot）: Slackの強みはインテグレーションの豊富さ。代替OSSがWebhook、Bot API、サードパーティ連携にどこまで対応しているか確認しましょう。",
          "スレッド・チャンネル管理: チーム規模が大きい場合、スレッド機能やチャンネルの整理機能の充実度が重要です。",
          "音声・ビデオ通話: Slack Huddleの代替が必要なら、組み込みの通話機能やJitsi等との連携があるか確認。",
          "通知設定の柔軟性: チームメンバーが通知疲れしないよう、きめ細かい通知設定ができるかは運用の快適さに直結します。",
        ],
      },
      {
        heading: "候補を見るときの注意点",
        content: [
          "移行コストを過小評価しない: チャットツールの移行は技術的な難易度より、チームの習慣変更が最大のハードルです。段階的な移行計画を立てましょう。",
          "モバイルアプリの完成度: デスクトップは使いやすくてもモバイルアプリが貧弱なOSSは多いです。チームのモバイル利用度に応じて重要度が変わります。",
          "E2E暗号化の有無: セキュリティ要件が厳しい場合、エンドツーエンド暗号化をサポートしているか確認してください。",
        ],
      },
    ],
    checklist: [
      "必要な連携サービス（GitHub, Jira等）を洗い出す",
      "チームのモバイル利用頻度を確認する",
      "メッセージ履歴のエクスポート/インポート手段を調べる",
      "通話機能の要否を決める",
      "セキュリティ要件（E2E暗号化等）を確認する",
    ],
    relatedLinks: [
      { label: "Slackの代替OSSツール一覧", href: "/alternatives/slack" },
      { label: "セルフホスト前提でツールを選ぶガイド", href: "/guides/self-hosting" },
      { label: "コスト削減シミュレーター", href: "/savings" },
    ],
  },
  "self-hosting": {
    title: "セルフホスト前提でツールを選ぶときの注意点",
    metaTitle: "セルフホスト前提でOSSツールを選ぶ注意点 | OSSアルタナティブ",
    metaDescription: "OSSツールをセルフホストで運用する際に確認すべきポイントを解説。サーバー要件・バックアップ・セキュリティ・更新運用まで網羅。",
    intro: "OSSの大きな魅力はセルフホストによるデータの完全管理ですが、運用にはそれなりの準備と覚悟が必要です。このガイドでは、セルフホスト前提でOSSツールを選ぶときに押さえておくべき注意点を整理します。",
    audience: "データを外部に預けたくない方、自社サーバーでの運用経験がある方、セルフホストを初めて検討する方",
    sections: [
      {
        heading: "導入前に確認すべきこと",
        content: [
          "サーバー要件の確認: CPU・メモリ・ストレージの最小要件を事前にチェック。特にデータベースを使うツールはメモリ要件が高くなりがちです。",
          "Docker対応の有無: 公式のDockerイメージやDocker Composeファイルがあると導入が格段に楽になります。逆にソースビルドのみの場合は技術力が求められます。",
          "SSL/TLS対応: Let's Encryptなどで自動的にHTTPS化できる構成か、リバースプロキシ（Nginx/Caddy）の設定が必要かを確認しましょう。",
          "認証の仕組み: LDAP/SAML/OIDCなど、既存の認証基盤と連携できるか。小規模なら内蔵認証でも十分ですが、企業利用ならSSO対応は重要です。",
        ],
      },
      {
        heading: "運用で気をつけること",
        content: [
          "バックアップ戦略: データベースとファイルストレージの定期バックアップは必須。自動化スクリプトを組み、リストア手順もテストしておきましょう。",
          "アップデート運用: OSSは頻繁に更新されます。セキュリティパッチの適用頻度と、アップデート時の互換性確認のプロセスを事前に決めておく必要があります。",
          "監視・アラート: サーバーのリソース監視と、サービスダウン時のアラート設定は最低限必要です。UptimeRobot等の無料ツールでも始められます。",
          "スケーラビリティ: チーム規模が拡大した場合に、水平スケールが可能な構成か。単一サーバーで始めても、将来的に分散構成に移行できるかは重要な観点です。",
        ],
      },
    ],
    checklist: [
      "サーバーのスペック要件を確認する",
      "Docker/Docker Composeでの導入が可能か調べる",
      "バックアップの自動化方法を計画する",
      "SSL対応の方法を確認する",
      "アップデート運用のルールを決める",
      "監視ツールを設定する",
    ],
    relatedLinks: [
      { label: "セルフホスト向けOSSツール一覧", href: "/category/infrastructure" },
      { label: "人気ランキング", href: "/ranking" },
      { label: "コスト削減シミュレーター", href: "/savings" },
    ],
  },
};

const GUIDE_SLUGS = Object.keys(GUIDES);

export { GUIDE_SLUGS };

export default function GuidePage() {
  const { slug } = useParams<{ slug: string }>();
  const guide = slug ? GUIDES[slug] : undefined;

  useEffect(() => {
    if (guide && slug) {
      track("guide_page_view", { slug });
    }
  }, [guide, slug]);

  useSeo({
    title: guide?.metaTitle || "ガイド | OSSアルタナティブ",
    description: guide?.metaDescription || "",
    canonical: slug ? `https://ossalt.jp/guides/${slug}` : undefined,
  });

  if (!guide) {
    return (
      <SiteLayout>
        <div className="container py-20 text-center">
          <p className="text-muted-foreground text-lg">ガイドが見つかりませんでした</p>
          <Button variant="outline" className="mt-6 gap-2 rounded-xl" asChild>
            <Link to="/"><ArrowLeft className="h-4 w-4" />ホームに戻る</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="container max-w-3xl mx-auto px-4 md:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground pt-6 pb-6">
          <Link to="/" className="hover:text-foreground transition-colors">ホーム</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">ガイド</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium truncate">{guide.title}</span>
        </nav>

        {/* Header */}
        <header className="pb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <span className="text-xs font-medium text-primary">選定ガイド</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground leading-tight mb-4">
            {guide.title}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">{guide.intro}</p>
          <div className="mt-4 p-3 rounded-lg bg-secondary/40 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">こんな方向け:</span> {guide.audience}
          </div>
        </header>

        {/* Sections */}
        {guide.sections.map((section) => (
          <section key={section.heading} className="pb-8">
            <h2 className="text-lg font-bold text-foreground mb-4">{section.heading}</h2>
            <div className="space-y-4">
              {section.content.map((item, i) => {
                const [title, ...rest] = item.split(": ");
                return (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      <span className="font-semibold text-foreground">{title}:</span>{" "}
                      {rest.join(": ")}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {/* Checklist */}
        <section className="pb-8">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            選定チェックリスト
          </h2>
          <div className="card-unified p-5 space-y-2.5">
            {guide.checklist.map((item, i) => (
              <label key={i} className="flex items-center gap-3 text-sm text-foreground cursor-pointer">
                <input type="checkbox" className="h-4 w-4 rounded border-border accent-primary" />
                {item}
              </label>
            ))}
          </div>
        </section>

        {/* Related links */}
        <section className="pb-8">
          <h2 className="text-lg font-bold text-foreground mb-4">関連ページ</h2>
          <div className="space-y-2">
            {guide.relatedLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="group flex items-center gap-2.5 p-3 card-unified hover:border-primary/30 transition-colors"
                onClick={() => track("guide_related_click", { from: slug!, to: link.href })}
              >
                <span className="text-sm text-foreground group-hover:text-primary transition-colors flex-1">
                  {link.label}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            ))}
          </div>
        </section>

        {/* Other guides */}
        <section className="pb-8 border-t border-border/60 pt-8">
          <h2 className="text-base font-bold text-foreground mb-3">他のガイドを読む</h2>
          <div className="flex flex-wrap gap-2">
            {GUIDE_SLUGS.filter((s) => s !== slug).map((s) => (
              <Link
                key={s}
                to={`/guides/${s}`}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
              >
                {GUIDES[s].title}
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="pb-12">
          <NewsletterSignup />
        </section>
      </div>
    </SiteLayout>
  );
}
