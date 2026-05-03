import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/use-seo";
import { PageBackTop, PageBackBottom } from "@/components/PageBackNav";
import { Mail, ArrowRight } from "lucide-react";

export default function SponsorPage() {
  useSeo({
    title: "スポンサー掲載・タイアップのご案内",
    description:
      "ossalt.jp ではOSSベンダー・SaaS企業向けにスポンサー掲載やタイアップ記事を受け付けています。掲載内容の修正もこちらから。",
    canonical: "https://ossalt.jp/sponsor",
  });

  return (
    <SiteLayout>
      <PageBackTop />
      <div className="container max-w-2xl mx-auto py-12 px-4 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-6">
          スポンサー掲載・タイアップのご案内
        </h1>
        <div className="space-y-4 text-foreground/90 leading-relaxed">
          <p>
            ossalt.jp は、有料SaaSの代替となるオープンソースツールを日本語で紹介するディレクトリです。
            開発者・スタートアップ・情シス担当者など、技術選定の比較検討段階にいる読者にリーチできます。
          </p>
          <p>
            OSSベンダー・SaaS企業の方向けに、以下のようなご相談を受け付けています。
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>カテゴリ・比較ページへのスポンサー掲載</li>
            <li>タイアップ記事・導入事例の制作</li>
            <li>掲載内容の修正・情報の追加リクエスト</li>
            <li>その他、提携・パートナーシップのご相談</li>
          </ul>
          <p className="text-sm text-muted-foreground">
            詳細な掲載メニュー・料金は広告掲載ページをご覧ください。
          </p>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button asChild size="lg" className="gap-2 rounded-xl">
            <Link to="/advertise">
              <Mail className="h-4 w-4" />
              広告・スポンサー掲載について問い合わせる
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2 rounded-xl">
            <Link to="/contact">
              掲載内容の修正を依頼する <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
      <PageBackBottom />
    </SiteLayout>
  );
}
