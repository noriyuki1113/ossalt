import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Star, Flame, Crown, Gem } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { useSeo } from "@/hooks/use-seo";
import type { Tool } from "@/hooks/use-tools";

function formatStars(num: number | null): string {
  if (!num) return "0";
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(num);
}

function getFaviconUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`;
  } catch {
    return null;
  }
}

const CATEGORIES = [
  "AI・機械学習",
  "ビジネスソフトウェア",
  "開発者ツール",
  "インフラ・運用",
  "データ・分析",
  "コンテンツ・パブリッシング",
  "生産性・ユーティリティ",
  "セキュリティ・プライバシー",
  "コミュニティ・ソーシャル",
  "その他",
];

/* ── News Card ── */

function NewsCard({
  tool,
  badge,
  badgeClass,
}: {
  tool: Tool;
  badge?: string;
  badgeClass?: string;
}) {
  const favicon = getFaviconUrl(tool.url);
  return (
    <Link
      to={`/tools/${tool.id}`}
      className="flex gap-4 rounded-xl border bg-card p-4 transition-all hover:-translate-y-0.5 card-glow group"
    >
      <div className="shrink-0 mt-0.5">
        {favicon ? (
          <img src={favicon} alt="" width={28} height={28} className="rounded" loading="lazy" />
        ) : (
          <span className="h-7 w-7 rounded bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center uppercase">
            {tool.name?.charAt(0) || "?"}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
            {tool.name}
          </h3>
          {badge && (
            <Badge className={`text-xs ${badgeClass || ""}`}>{badge}</Badge>
          )}
          {tool.stars_num != null && tool.stars_num > 0 && (
            <Badge className="gap-1 text-xs bg-badge-amber/15 text-badge-amber border-badge-amber/30">
              <Star className="h-3 w-3 fill-current" />
              {formatStars(tool.stars_num)}
            </Badge>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
          {tool.description_ja || tool.description_en || "説明なし"}
        </p>
        <div className="mt-2 flex items-center gap-2">
          {tool.parent_category_ja && (
            <Badge variant="secondary" className="text-xs font-normal">
              {tool.parent_category_ja}
            </Badge>
          )}
          <span className="text-xs text-primary flex items-center gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
            詳細を見る <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function SectionTitle({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <h2 className="text-xl font-bold flex items-center gap-3 mb-5">
      {icon}
      {children}
    </h2>
  );
}

/* ── Page ── */

export default function NewsPage() {
  useSeo({
    title: "OSSニュース・注目ツール | OSSアルタナティブ",
    description:
      "今週の注目OSSツールとGitHubトレンドを毎週更新。人気のオープンソースツールをいち早くチェック。",
    canonical: "https://ossalt.jp/news",
  });

  // Featured: top 5 by stars
  const { data: featured } = useQuery({
    queryKey: ["news-featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .order("stars_num", { ascending: false, nullsFirst: false })
        .limit(5);
      if (error) throw error;
      return data as Tool[];
    },
  });

  // Category picks: 1 random from each category (use offset trick)
  const { data: categoryPicks } = useQuery({
    queryKey: ["news-category-picks"],
    queryFn: async () => {
      const picks: { category: string; tool: Tool }[] = [];
      for (const cat of CATEGORIES) {
        const { count } = await supabase
          .from("tools")
          .select("*", { count: "exact", head: true })
          .eq("parent_category_ja", cat);
        const total = count || 0;
        if (total === 0) continue;
        const offset = Math.floor(Math.random() * Math.min(total, 20));
        const { data } = await supabase
          .from("tools")
          .select("*")
          .eq("parent_category_ja", cat)
          .order("stars_num", { ascending: false, nullsFirst: false })
          .range(offset, offset);
        if (data && data.length > 0) {
          picks.push({ category: cat, tool: data[0] as Tool });
        }
      }
      return picks;
    },
  });

  // Milestone clubs
  const { data: milestones } = useQuery({
    queryKey: ["news-milestones"],
    queryFn: async () => {
      const { data: club100k } = await supabase
        .from("tools")
        .select("*")
        .gte("stars_num", 100000)
        .order("stars_num", { ascending: false, nullsFirst: false });
      const { data: club50k } = await supabase
        .from("tools")
        .select("*")
        .gte("stars_num", 50000)
        .lt("stars_num", 100000)
        .order("stars_num", { ascending: false, nullsFirst: false });
      const { data: club10k } = await supabase
        .from("tools")
        .select("*")
        .gte("stars_num", 10000)
        .lt("stars_num", 50000)
        .order("stars_num", { ascending: false, nullsFirst: false })
        .limit(20);
      return {
        club100k: (club100k as Tool[]) || [],
        club50k: (club50k as Tool[]) || [],
        club10k: (club10k as Tool[]) || [],
      };
    },
  });

  return (
    <SiteLayout>
      <div className="container max-w-4xl mx-auto px-4 pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          ツール一覧に戻る
        </Link>
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-8 animate-fade-in">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
          📰 OSSニュース・注目ツール
        </h1>
        <p className="text-muted-foreground mb-10">
          今週の注目OSSツールとGitHubトレンドをチェック
        </p>

        {/* ── Featured ── */}
        <section className="mb-12">
          <SectionTitle icon={<Flame className="h-5 w-5 text-destructive" />}>
            今週の注目ツール
          </SectionTitle>
          <div className="space-y-3">
            {featured
              ? featured.map((tool) => (
                  <NewsCard
                    key={tool.id}
                    tool={tool}
                    badge="🔥 注目"
                    badgeClass="bg-destructive/15 text-destructive border-destructive/30"
                  />
                ))
              : Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl border bg-card p-5 animate-pulse h-24"
                  />
                ))}
          </div>
        </section>

        {/* ── Category Picks ── */}
        <section className="mb-12">
          <SectionTitle icon={<Crown className="h-5 w-5 text-badge-amber" />}>
            カテゴリ別ピックアップ
          </SectionTitle>
          <div className="space-y-3">
            {categoryPicks
              ? categoryPicks.map(({ category, tool }) => (
                  <div key={category}>
                    <p className="text-xs text-muted-foreground mb-1.5">
                      今日の{category}ピックアップ
                    </p>
                    <NewsCard
                      tool={tool}
                      badge={category}
                      badgeClass="bg-primary/15 text-primary border-primary/30"
                    />
                  </div>
                ))
              : Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl border bg-card p-5 animate-pulse h-24"
                  />
                ))}
          </div>
        </section>

        {/* ── Milestones ── */}
        <section className="mb-12">
          <SectionTitle icon={<Gem className="h-5 w-5 text-primary" />}>
            スター数マイルストーン
          </SectionTitle>

          {milestones && (
            <div className="space-y-6">
              {milestones.club100k.length > 0 && (
                <MilestoneSection
                  title="⭐ 100K超えクラブ"
                  tools={milestones.club100k}
                />
              )}
              {milestones.club50k.length > 0 && (
                <MilestoneSection
                  title="⭐ 50K超えクラブ"
                  tools={milestones.club50k}
                />
              )}
              {milestones.club10k.length > 0 && (
                <MilestoneSection
                  title="⭐ 10K超えクラブ"
                  tools={milestones.club10k}
                />
              )}
            </div>
          )}
        </section>
      </div>

      {/* Bottom */}
      <div className="container max-w-4xl mx-auto px-4 pb-12 flex justify-center">
        <Button variant="outline" className="gap-2 rounded-xl" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            ツール一覧に戻る
          </Link>
        </Button>
      </div>
    </SiteLayout>
  );
}

function MilestoneSection({
  title,
  tools,
}: {
  title: string;
  tools: Tool[];
}) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <h3 className="font-bold mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            to={`/tools/${tool.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm hover:bg-muted/50 transition-colors"
          >
            <span className="font-medium">{tool.name}</span>
            <Badge className="gap-0.5 text-xs bg-badge-amber/15 text-badge-amber border-badge-amber/30">
              <Star className="h-2.5 w-2.5 fill-current" />
              {formatStars(tool.stars_num)}
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
