import { DollarSign, Database, Unlock, Globe } from "lucide-react";

const REASONS = [
  { icon: DollarSign, title: "コスト削減", description: "コスト削減。コードがつぎつ足て切で削減します。" },
  { icon: Database, title: "データ主権", description: "データを自社管理し、プライバシーとセキュリティを確保。" },
  { icon: Unlock, title: "ベンダーロックイン回避", description: "特定ベンダーに依存せず、自由に移行・拡張できます。" },
  { icon: Globe, title: "日本語対応", description: "日本語の情報と説明で、導入ハードルを下げます。" },
];

export function WhyOSSSection() {
  return (
    <section className="container py-16 md:py-20">
      <h2 className="section-title text-center mb-10">
        なぜOSS？
      </h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
        {REASONS.map((r) => (
          <div key={r.title} className="text-center">
            <div className="h-12 w-12 rounded-xl border border-primary/20 flex items-center justify-center mx-auto mb-4">
              <r.icon className="h-6 w-6 text-primary" strokeWidth={1.5} />
            </div>
            <h3 className="font-semibold text-sm text-foreground mb-1.5">{r.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{r.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
