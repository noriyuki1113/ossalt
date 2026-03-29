import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function AboutPage() {
  return (
    <SiteLayout>
      <div className="container py-10 max-w-2xl">
        <Breadcrumbs items={[{ label: "About" }]} />
        <h1 className="text-3xl font-bold">AltFinder.jpについて</h1>
        <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
          <p>AltFinder.jpは、日本語で代替サービスを検索・比較できるプラットフォームです。</p>
          <p>「Notionの代替」「Slackの代替」など、人気ツールの代わりになるサービスを網羅的にまとめ、比較表やカテゴリ分類で最適なツール選びをサポートします。</p>
          <p>特にオープンソースや国産サービス、日本語対応ツールに注力しています。</p>
        </div>
      </div>
    </SiteLayout>
  );
}
