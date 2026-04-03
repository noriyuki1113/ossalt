import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    q: "OSSアルタナティブとは何ですか？",
    a: "有料SaaSの代替になるOSSを、日本語で探せる比較サイトです。680件以上のツールを掲載しています。",
  },
  {
    q: "掲載ツールは無料ですか？",
    a: "多くは無料で使えますが、クラウド版は有料プランもあります。セルフホストなら基本無料です。",
  },
  {
    q: "セルフホストとは何ですか？",
    a: "自分のサーバーやクラウド環境でソフトウェアを運用することです。データを自社管理でき、自由にカスタマイズできます。",
  },
  {
    q: "日本語未対応のツールもありますか？",
    a: "はい。海外製OSSが多いため日本語未対応のものもあります。当サイトの説明文は日本語で提供しています。",
  },
  {
    q: "ツール掲載をリクエストできますか？",
    a: "はい。お問い合わせページからGitHubリポジトリのURLをお送りください。",
  },
];

export function FAQSection() {
  return (
    <section className="container py-14">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
            よくある質問
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-xl border border-border bg-card px-5 data-[state=open]:border-primary/20 overflow-hidden"
            >
              <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-4 text-left">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
