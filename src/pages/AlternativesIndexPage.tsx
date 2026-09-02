import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { useSeo } from "@/hooks/use-seo";
import { SLUG_MAP } from "@/pages/AlternativesPage";

export default function AlternativesIndexPage() {
  const [search, setSearch] = useState("");

  const entries = useMemo(
    () =>
      Object.entries(SLUG_MAP)
        .filter(([, name]) => name.toLowerCase().includes(search.trim().toLowerCase()))
        .sort(([, a], [, b]) => a.localeCompare(b)),
    [search],
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "代替OSSツール一覧 | OSSアルタナティブ",
        description: "Notion・Slack・Figmaなど、有料SaaSごとの代替OSSツール一覧ページへのリンク集。",
        url: "https://ossalt.jp/alternatives",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: "https://ossalt.jp/" },
          { "@type": "ListItem", position: 2, name: "代替ツール一覧", item: "https://ossalt.jp/alternatives" },
        ],
      },
    ],
  };

  useSeo({
    title: "代替OSSツール一覧 | OSSアルタナティブ",
    description: "Notion・Slack・Figmaなど、有料SaaSごとの代替OSSツール一覧ページへのリンク集。目的のSaaSを選んで、無料でセルフホスト可能なOSS代替を探せます。",
    canonical: "https://ossalt.jp/alternatives",
    jsonLd,
  });

  return (
    <SiteLayout>
      <div className="container max-w-4xl mx-auto px-4 py-10 animate-fade-in">
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            SaaS別に代替OSSを探す
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            置き換えたい有料SaaSを選ぶと、そのOSS代替ツール一覧が見られます
          </p>
        </div>

        <div className="relative max-w-sm mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SaaS名で絞り込む…"
            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/40 focus:border-primary/40"
          />
        </div>

        {entries.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-12">該当するSaaSが見つかりませんでした</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {entries.map(([slug, name]) => (
              <Link
                key={slug}
                to={`/alternatives/${slug}`}
                className="group flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-3 hover:border-primary/40 hover:-translate-y-0.5 transition-all"
              >
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                  {name}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
