import { DollarSign, Database, Unlock, Globe } from "lucide-react";

const REASONS = [
  { icon: DollarSign, title: "コスト削減", description: "サブスク費用を削減し、必要な分だけ投資できます。" },
  { icon: Database, title: "データ主権", description: "データを自社管理し、プライバシーとセキュリティを確保。" },
  { icon: Unlock, title: "ベンダーロックイン回避", description: "特定ベンダーに依存せず、自由に移行・拡張できます。" },
  { icon: Globe, title: "日本語対応", description: "日本語の情報と説明で、導入ハードルを下げます。" },
];

export function WhyOSSSection() {
  return (
    <section className="container py-16 md:py-20">
      <div className="text-center mb-10">
        <h2 className="section-title">なぜOSS？</h2>
        <p className="section-subtitle">オープンソースを選ぶ理由</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {REASONS.map((r) => (
          <div key={r.title} className="text-center p-5">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
              <r.icon className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-sm text-foreground mb-1">{r.title}</h3>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{r.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
