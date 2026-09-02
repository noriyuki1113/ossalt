import { SiteLayout } from "@/components/SiteLayout";
import { useSeo } from "@/hooks/use-seo";
import { PageBackTop, PageBackBottom } from "@/components/PageBackNav";

export default function TermsPage() {
  useSeo({
    title: "利用規約 | OSSアルタナティブ",
    description: "OSSアルタナティブの利用条件、掲載ツールの選定基準、禁止事項について定めた利用規約です。",
    canonical: "https://ossalt.jp/terms",
  });

  return (
    <SiteLayout>
      <PageBackTop />
      <div className="container max-w-3xl mx-auto py-12 px-4 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8">
          利用規約
        </h1>

        <div className="space-y-10 text-muted-foreground leading-relaxed">
          <Section title="第1条（適用）">
            <p>
              本利用規約（以下「本規約」）は、OSSアルタナティブ（以下「当サイト」）の
              利用に関する条件を定めるものです。当サイトを利用することにより、
              本規約に同意したものとみなします。
            </p>
          </Section>

          <Section title="第2条（掲載情報について）">
            <p>
              当サイトに掲載されている情報は、正確性・完全性を保証するものではありません。
              掲載情報に基づいて利用者が行った行為について、当サイトは一切の責任を負いません。
            </p>
          </Section>

          <Section title="第3条（掲載ツールの利用）">
            <p>
              当サイトに掲載されているツールの利用は、各ツールが定める利用規約・
              ライセンスに従ってください。当サイトは掲載ツールの利用に関して
              いかなる保証も行いません。
            </p>
          </Section>

          <Section title="第4条（著作権）">
            <p>
              当サイトのコンテンツ（テキスト、デザイン、構成等）の無断転載・複製を禁止します。
              ただし、掲載ツールに関する情報はそれぞれの原著作者に帰属します。
            </p>
          </Section>

          <Section title="第5条（サービスの変更・終了）">
            <p>
              当サイトは、利用者への事前通知なしに、サービスの内容を変更または
              終了する場合があります。これにより利用者に生じた損害について、
              当サイトは一切の責任を負いません。
            </p>
          </Section>

          <Section title="第6条（準拠法）">
            <p>本規約の解釈および適用は、日本法に準拠するものとします。</p>
          </Section>
        </div>
      </div>
      <PageBackBottom />
    </SiteLayout>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold flex items-center gap-3 mb-4">
        <span className="w-1 h-6 rounded-full bg-primary shrink-0" />
        {title}
      </h2>
      <div className="space-y-2 pl-4">{children}</div>
    </section>
  );
}
