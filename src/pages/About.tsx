import { SiteLayout } from "@/components/SiteLayout";
import { useSeo } from "@/hooks/use-seo";
import { Link } from "react-router-dom";
import { BookOpen, Search, Globe, Heart } from "lucide-react";
import { PageBackTop, PageBackBottom } from "@/components/PageBackNav";
import { BookOpen, Search, Globe, Heart } from "lucide-react";

export default function AboutPage() {
  useSeo({
    title: "サイトについて",
    description: "OSSアルタナティブは、有料SaaSの代わりに使えるオープンソースツールを日本語で検索・比較できるディレクトリサイトです。",
  });

  const features = [
    { icon: BookOpen, text: "680件以上のOSSツールを掲載" },
    { icon: Globe, text: "日本語での説明・検索に対応" },
    { icon: Search, text: "有料サービスとの比較情報を提供" },
    { icon: Heart, text: "完全無料で利用可能" },
  ];

  return (
    <SiteLayout>
      <PageBackTop />
      <div className="container max-w-3xl mx-auto py-12 px-4 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8">
          OSSアルタナティブについて
        </h1>

        <div className="prose-dark space-y-6 text-muted-foreground leading-relaxed">
          <p className="text-base md:text-lg">
            OSSアルタナティブは、有料SaaSの代わりに使えるオープンソースツールを
            日本語で検索・比較できるディレクトリサイトです。
          </p>
        </div>

        <hr className="border-border my-10" />

        <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
          <span className="w-1 h-6 rounded-full bg-primary shrink-0" />
          特徴
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {features.map((f) => (
            <div key={f.text} className="flex items-center gap-3 rounded-xl border bg-card p-4">
              <f.icon className="h-5 w-5 text-primary shrink-0" />
              <span className="text-sm font-medium">{f.text}</span>
            </div>
          ))}
        </div>

        <hr className="border-border my-10" />

        <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
          <span className="w-1 h-6 rounded-full bg-primary shrink-0" />
          データについて
        </h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            掲載データは{" "}
            <a
              href="https://openalternative.co"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              OpenAlternative（openalternative.co）
            </a>
            のCC0ライセンスデータをもとに、日本語化・加工して提供しています。
          </p>
        </div>

        <hr className="border-border my-10" />

        <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
          <span className="w-1 h-6 rounded-full bg-primary shrink-0" />
          運営
        </h2>
        <p className="text-muted-foreground">
          個人運営のサイトです。
          <Link to="/contact" className="text-primary hover:underline ml-1">
            お問い合わせはこちら
          </Link>
          からお願いします。
        </p>
      </div>
      <PageBackBottom />
    </SiteLayout>
  );
}
