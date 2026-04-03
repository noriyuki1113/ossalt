import { DollarSign, Database, Unlock, Globe } from "lucide-react";

const REASONS = [
  { icon: DollarSign, title: "コスト削減", description: "ライセンス費用ゼロ。チーム規模が増えても追加課金なし。" },
  { icon: Database, title: "データ主権", description: "自社サーバーで運用し、顧客データを外部に渡さない。" },
  { icon: Unlock, title: "ベンダーロックイン回避", description: "いつでも移行・カスタマイズ可能。特定企業に依存しない。" },
  { icon: Globe, title: "日本語で探せる", description: "海外OSSの情報を日本語で整理。導入判断がスムーズに。" },
];

export function WhyOSSSection() {
  return (
    <section className="container py-12 md:py-20">
      <h2 className="section-title text-center mb-8 md:mb-10">
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
