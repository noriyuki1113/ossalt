import { SiteLayout } from "@/components/SiteLayout";
import { useSeo } from "@/hooks/use-seo";
import { PageBackTop, PageBackBottom } from "@/components/PageBackNav";

export default function DisclaimerPage() {
  useSeo({
    title: "免責事項",
    description: "OSSアルタナティブの免責事項です。",
    canonical: "https://ossalt.jp/disclaimer",
  });

  return (
    <SiteLayout>
      <PageBackTop />
      <div className="container max-w-3xl mx-auto py-12 px-4 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8">
          免責事項
        </h1>

        <div className="space-y-10 text-muted-foreground leading-relaxed">
          <Section title="掲載情報の正確性">
            <p>
              当サイトに掲載されている情報の正確性・完全性については万全を期しておりますが、
              その内容を保証するものではありません。掲載情報の利用は、
              利用者ご自身の責任において行ってください。
            </p>
          </Section>

          <Section title="外部リンクについて">
            <p>
              当サイトからリンクされている外部サイトのコンテンツについて、
              当サイトは一切の責任を負いません。外部サイトの利用は、
              各サイトの利用規約に従ってください。
            </p>
          </Section>

          <Section title="掲載ツールの使用">
            <p>
              当サイトに掲載されているオープンソースツールの使用により生じた
              いかなる損害（データの損失、システム障害、セキュリティ問題等）についても、
              当サイトは責任を負いません。ツールの導入・使用は自己責任で行ってください。
            </p>
          </Section>

          <Section title="情報の最新性">
            <p>
              スター数、ライセンス情報、その他の統計データは取得時点のものであり、
              最新の情報でない場合があります。最新情報は各ツールの公式サイトまたは
              GitHubリポジトリでご確認ください。
            </p>
          </Section>

          <Section title="サービスの中断">
            <p>
              当サイトは、メンテナンスやその他の理由により、予告なくサービスを
              中断・停止する場合があります。これにより生じた損害について、
              当サイトは責任を負いません。
            </p>
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
