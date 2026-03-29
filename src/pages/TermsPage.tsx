import { SiteLayout } from "@/components/SiteLayout";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default function TermsPage() {
  return (
    <SiteLayout>
      <div className="container py-10 max-w-2xl">
        <Breadcrumbs items={[{ label: "利用規約" }]} />
        <h1 className="text-3xl font-bold">利用規約</h1>
        <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed text-sm">
          <p>本利用規約は、AltFinder.jp（以下「当サイト」）の利用条件を定めるものです。</p>
          <h2 className="text-lg font-semibold text-foreground">免責事項</h2>
          <p>当サイトに掲載されている情報は、正確性を保つよう努めていますが、その完全性を保証するものではありません。</p>
          <h2 className="text-lg font-semibold text-foreground">禁止事項</h2>
          <p>当サイトの情報を無断で複製・転載することを禁止します。</p>
        </div>
      </div>
    </SiteLayout>
  );
}
