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
        <p className="text-sm text-muted-foreground mb-8">制定日：2026年3月30日</p>

        <div className="space-y-10 text-muted-foreground leading-relaxed">
          <Section title="運営者情報">
            <p>サイト名：OSSアルタナティブ</p>
            <p>運営形態：個人運営</p>
          </Section>

          <Section title="アクセス解析">
            <p>
              当サイトでは、サイトの利用状況を把握するためにGoogle Analyticsを使用しています。
              Google Analyticsは匿名のデータのみを収集し、個人を特定する情報は取得しません。
            </p>
            <p>
              データの収集にはCookieが使用されます。ブラウザの設定でCookieを無効にすることで、
              データの収集を拒否することができます。
            </p>
          </Section>

          <Section title="Cookie（クッキー）について">
            <p>
              当サイトでは、Google Analytics用のCookieを使用しています。
              Cookieはブラウザに保存される小さなテキストファイルで、
              サイトの利用状況の分析に使用されます。
            </p>
          </Section>

          <Section title="広告について">
            <p>
              当サイトでは、将来的にGoogle AdSenseを利用した広告配信を予定しています。
              導入時にはプライバシーポリシーを更新いたします。
            </p>
          </Section>

          <Section title="個人情報の収集">
            <p>
              当サイトでは、お問い合わせフォームからのメールアドレスのみを収集しています。
              収集したメールアドレスは、お問い合わせへの返信にのみ使用いたします。
            </p>
          </Section>

          <Section title="第三者への提供">
            <p>
              収集した個人情報を第三者に提供することはありません。
              ただし、法令に基づく場合はこの限りではありません。
            </p>
          </Section>

          <Section title="お問い合わせ">
            <p>
              プライバシーポリシーに関するお問い合わせは、
              <Link to="/contact" className="text-primary hover:underline">
                お問い合わせページ
              </Link>
              よりお願いいたします。
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
