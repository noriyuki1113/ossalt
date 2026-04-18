import { SiteLayout } from "@/components/SiteLayout";
import { useSeo } from "@/hooks/use-seo";
import { Link } from "react-router-dom";
import { PageBackTop, PageBackBottom } from "@/components/PageBackNav";

export default function PrivacyPage() {
  useSeo({
    title: "プライバシーポリシー",
    description: "OSSアルタナティブのプライバシーポリシーです。",
    canonical: "https://ossalt.jp/privacy",
  });

  return (
    <SiteLayout>
      <PageBackTop />
      <div className="container max-w-3xl mx-auto py-12 px-4 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
          プライバシーポリシー
        </h1>
        <div className="flex gap-4 text-sm text-muted-foreground mb-10">
          <span>制定日：2026年3月30日</span>
          <span>最終更新日：2026年4月18日</span>
        </div>

        <div className="divide-y divide-border">
          <Section title="個人情報の利用目的">
            <p>
              当サイトでは、お問い合わせやサービスの利用時に、名前やメールアドレス等の個人情報をご提供いただく場合があります。
            </p>
            <p>
              取得した個人情報は、お問い合わせ対応および必要なご連絡のためにのみ利用し、それ以外の目的では利用しません。
            </p>
          </Section>

          <Section title="アクセス解析について">
            <p>
              当サイトでは、サイト改善および利用状況の把握のため、オープンソースのアクセス解析ツール「Umami」を利用しています。
            </p>
            <p>
              Umamiにより、ページ閲覧数、参照元、閲覧環境などの匿名化された統計情報を取得することがあります。
              これらの情報は、個人を特定する目的では利用しません。
            </p>
          </Section>

          <Section title="Cookie（クッキー）について">
            <p>
              当サイトでは、利便性の向上および利用状況の分析のため、Cookieまたはこれに類する技術を使用する場合があります。
              Cookieにより取得される情報には、個人を特定する情報は含まれません。
            </p>
            <p>ユーザーはブラウザの設定によりCookieの使用を拒否することができます。</p>
          </Section>

          <Section title="広告について">
            <p>
              当サイトでは、第三者配信の広告サービスを利用する場合があります。
              これらの広告配信事業者は、ユーザーの興味に応じた広告を表示するため、Cookie等を使用することがあります。
            </p>
          </Section>

          <Section title="個人情報の第三者への提供">
            <p>取得した個人情報は、以下の場合を除き第三者に提供することはありません。</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>本人の同意がある場合</li>
              <li>法令に基づき開示が必要な場合</li>
            </ul>
          </Section>

          <Section title="個人情報の管理">
            <p>
              当サイトは、個人情報の漏えい、紛失、改ざん等を防止するために適切な安全対策を講じます。
            </p>
          </Section>

          <Section title="免責事項">
            <p>
              当サイトからリンクやバナーなどによって他サイトへ移動された場合、移動先サイトで提供される情報やサービスについて一切の責任を負いません。
            </p>
            <p>
              また、当サイトのコンテンツ・情報については、できる限り正確な情報を掲載するよう努めていますが、その正確性や安全性を保証するものではありません。
            </p>
          </Section>

          <Section title="プライバシーポリシーの変更">
            <p>本ポリシーの内容は、必要に応じて予告なく変更することがあります。</p>
          </Section>

          <Section title="お問い合わせ">
            <p>
              本ポリシーに関するお問い合わせは、
              <Link to="/contact" className="text-primary hover:underline">
                お問い合わせページ
              </Link>
              よりご連絡ください。
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
    <section className="py-8">
      <h2 className="text-lg font-bold text-foreground flex items-center gap-3 mb-4">
        <span className="w-1 h-5 rounded-full bg-primary shrink-0" />
        {title}
      </h2>
      <div className="space-y-3 text-muted-foreground leading-relaxed">{children}</div>
    </section>
  );
}
