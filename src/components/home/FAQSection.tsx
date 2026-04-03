import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionHeader } from "@/components/SectionHeader";

const FAQ_ITEMS = [
  { q: "OSSアルタナティブとは何ですか？", a: "Notion・Slack・Jiraなどの有料SaaSに代わるオープンソースツールを、日本語で検索・比較できるサイトです。現在680件以上を掲載しています。" },
  { q: "掲載されているツールは無料ですか？", a: "セルフホスト（自社サーバー運用）であれば基本無料です。一部ツールはクラウド版で有料プランを提供していますが、コア機能は無料で利用できます。" },
  { q: "セルフホストとは何ですか？", a: "自社のサーバーやAWS・GCPなどのクラウド環境にソフトウェアをインストールして運用する方法です。データが外部に出ず、自由にカスタマイズできます。" },
  { q: "日本語に対応していないツールもありますか？", a: "はい、海外製OSSの中にはUIが英語のみのものもあります。当サイトでは各ツールの説明・比較情報を日本語で提供しているため、導入判断には困りません。" },
  { q: "新しいツールの掲載をリクエストできますか？", a: "はい、お問い合わせページからGitHubリポジトリのURLと簡単な説明をお送りください。審査のうえ掲載いたします。" },
];

export function FAQSection() {
  return (
    <section className="container py-12 md:py-20">
      <div className="max-w-2xl mx-auto">
        <SectionHeader title="よくある質問" />

        <Accordion type="single" collapsible className="space-y-2">
          {FAQ_ITEMS.map((item, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="card-unified px-5 data-[state=open]:border-primary/20 overflow-hidden"
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
