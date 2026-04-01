import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    q: "OSSアルタナティブとは何ですか？",
    a: "有料SaaS（Notion、Slack、Figmaなど）の代わりに使えるオープンソースソフトウェアを日本語で検索・比較できるサイトです。680件以上のツールを掲載しています。",
  },
  {
    q: "掲載されているツールは無料ですか？",
    a: "すべてオープンソースなので、セルフホストする場合は基本的に無料で利用できます。一部のツールはクラウド版の有料プランも提供しています。",
  },
  {
    q: "セルフホストとは何ですか？",
    a: "自前のサーバーやクラウドインフラでソフトウェアを運用することです。データを自社で完全管理でき、カスタマイズも自由に行えます。",
  },
  {
    q: "日本語に対応していないツールもありますか？",
    a: "はい、OSSの多くは英語がメインですが、当サイトでは説明文を日本語で提供しています。ツール自体の日本語対応状況はツール詳細ページでご確認ください。",
  },
  {
    q: "ツールの掲載をリクエストできますか？",
    a: "はい、お問い合わせページからリクエストを送信いただけます。GitHubリポジトリのURLをお送りください。",
  },
];

export function FAQSection() {
  return (
    <section className="container py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            よくある<span className="text-gradient">質問</span>
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-xl border border-border/60 bg-card px-6 data-[state=open]:border-primary/20 overflow-hidden"
            >
              <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-5 text-left">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5 w-full min-w-0 whitespace-normal break-words">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
