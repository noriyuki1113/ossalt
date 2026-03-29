import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function ContactPage() {
  return (
    <SiteLayout>
      <div className="container py-10 max-w-2xl">
        <Breadcrumbs items={[{ label: "お問い合わせ" }]} />
        <h1 className="text-3xl font-bold">お問い合わせ</h1>
        <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
          <p>AltFinder.jpへのお問い合わせは、以下の方法で受け付けています。</p>
          <p>掲載に関するお問い合わせは<a href="/submit" className="text-primary hover:underline">掲載申請ページ</a>をご利用ください。</p>
          <p>その他のお問い合わせは info@altfinder.jp までメールでご連絡ください。</p>
        </div>
      </div>
    </SiteLayout>
  );
}
