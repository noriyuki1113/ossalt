import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function PrivacyPage() {
  return (
    <SiteLayout>
      <div className="container py-10 max-w-2xl">
        <Breadcrumbs items={[{ label: "プライバシーポリシー" }]} />
        <h1 className="text-3xl font-bold">プライバシーポリシー</h1>
        <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed text-sm">
          <p>AltFinder.jp（以下「当サイト」）は、ユーザーの個人情報の保護を重要視しています。</p>
          <h2 className="text-lg font-semibold text-foreground">収集する情報</h2>
          <p>当サイトでは、掲載申請フォームを通じて、サービス名、URL、メールアドレスを収集します。</p>
          <h2 className="text-lg font-semibold text-foreground">情報の利用目的</h2>
          <p>収集した情報は、掲載審査およびサービス運営の改善のために使用されます。</p>
          <h2 className="text-lg font-semibold text-foreground">第三者への提供</h2>
          <p>法令に基づく場合を除き、収集した個人情報を第三者に提供することはありません。</p>
        </div>
      </div>
    </SiteLayout>
  );
}
