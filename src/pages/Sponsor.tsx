import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/use-seo";
import { PageBackTop, PageBackBottom } from "@/components/PageBackNav";
import { Mail } from "lucide-react";

export default function SponsorPage() {
  useSeo({
    title: "ossalt.jp への掲載について",
    description:
      "ossalt.jp はNotion・Zapier・Airtable・Google Analyticsなどの代替OSSを比較検討する読者が集まる日本語ディレクトリです。スポンサー掲載・タイアップのご相談はこちら。",
    canonical: "https://ossalt.jp/sponsor",
  });

  return (
    <SiteLayout>
      <PageBackTop />
      <article className="container max-w-2xl mx-auto py-12 px-4 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6 w-full min-w-0 whitespace-normal break-words">
          ossalt.jp への掲載について
        </h1>

        <p className="text-foreground/90 leading-relaxed mb-10 w-full min-w-0 whitespace-normal break-words">
          ossalt.jp は、有料SaaSの代わりに使えるOSSを日本語で探せるサイトです。
          Notion、Zapier、Airtable、Figmaなどの代替を、具体的に比較検討中の読者が中心です。
        </p>

        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-bold mb-3">こんな方におすすめです</h2>
          <ul className="list-disc pl-6 space-y-1.5 text-foreground/90 leading-relaxed">
            <li>日本市場でOSSプロダクトの認知を広げたい海外ベンダー</li>
            <li>自社プロダクトを「○○の代替」として候補に入れてほしい企業</li>
            <li>OSS導入支援・構築代行・マネージドホスティングを提供する事業者</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-bold mb-3">ご相談いただける掲載枠</h2>
          <ul className="list-disc pl-6 space-y-1.5 text-foreground/90 leading-relaxed">
            <li>ホームページのスポンサー表示</li>
            <li>「○○の代替OSS」ページへの固定掲載</li>
            <li>カテゴリページでの優先表示</li>
            <li>ニュースレターでの紹介</li>
            <li>導入ガイド・タイアップ記事の共同制作</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-bold mb-3">料金について</h2>
          <p className="text-foreground/90 leading-relaxed">
            掲載面・期間・ご要望に応じて個別にご案内しています。月額固定でのご提案が基本です。
            お気軽にご相談ください。
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold mb-3">お問い合わせ</h2>
          <p className="text-foreground/90 leading-relaxed mb-5">
            ご相談・お見積りはメールでお受けしています。3営業日以内に返信いたします。
          </p>
          <Button asChild size="lg" className="gap-2 rounded-xl">
            <Link to="/advertise">
              <Mail className="h-4 w-4" />
              メールで相談する
            </Link>
          </Button>
        </section>
      </article>
      <PageBackBottom />
    </SiteLayout>
  );
}
