import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Star, ArrowLeft, Trophy, Flame, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiteLayout } from "@/components/SiteLayout";
import { useSeo } from "@/hooks/use-seo";
import type { Tool } from "@/hooks/use-tools";

/* ---------- helpers ---------- */

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

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "今日";
  if (days === 1) return "1日前";
  if (days < 7) return `${days}日前`;
  if (days < 30) return `${Math.floor(days / 7)}週間前`;
  if (days < 365) return `${Math.floor(days / 30)}ヶ月前`;
  return `${Math.floor(days / 365)}年前`;
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

/* ---------- Rank Badge ---------- */

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span className="absolute -top-2 -left-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 text-sm font-extrabold text-black shadow-lg shadow-yellow-500/30">
        1
      </span>
    );
  if (rank === 2)
    return (
      <span className="absolute -top-2 -left-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-gray-300 to-gray-400 text-sm font-extrabold text-black shadow-lg shadow-gray-400/30">
        2
      </span>
    );
  if (rank === 3)
    return (
      <span className="absolute -top-2 -left-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-600 to-amber-700 text-sm font-extrabold text-white shadow-lg shadow-amber-700/30">
        3
      </span>
    );
  return (
    <span className="absolute -top-1.5 -left-1.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
      {rank}
    </span>
  );
}

/* ---------- Ranking Card ---------- */

function RankingCard({
  tool,
  rank,
  showNew,
}: {
  tool: Tool;
  rank: number;
  showNew?: boolean;
}) {
  const isTop3 = rank <= 3;
  const favicon = getFaviconUrl(tool.url);

  return (
    <Link
      to={`/tools/${tool.id}`}
      className={`relative block group rounded-xl border p-5 transition-all hover:-translate-y-0.5 animate-fade-in ${
        isTop3
          ? "bg-card border-primary/30 shadow-lg shadow-primary/5"
          : "bg-card card-glow"
      }`}
      style={{
        animationDelay: `${Math.min(rank * 40, 800)}ms`,
        animationFillMode: "both",
      }}
    >
      <RankBadge rank={rank} />

      <div className="ml-6 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          {favicon ? (
            <>
              <img
                src={favicon}
                alt=""
                width={20}
                height={20}
                className="rounded shrink-0"
                loading="lazy"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                  const fallback = (e.currentTarget as HTMLImageElement)
                    .nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <span
                className="h-5 w-5 rounded bg-muted text-muted-foreground text-[11px] font-bold items-center justify-center shrink-0 uppercase"
                style={{ display: "none" }}
              >
                {tool.name?.charAt(0) || "?"}
              </span>
            </>
          ) : (
            <span className="h-5 w-5 rounded bg-muted text-muted-foreground text-[11px] font-bold flex items-center justify-center shrink-0 uppercase">
              {tool.name?.charAt(0) || "?"}
            </span>
          )}
          <h3
            className={`font-semibold leading-tight truncate ${
              isTop3 ? "text-lg" : "text-base"
            }`}
          >
            {tool.name}
          </h3>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {showNew && (
            <Badge className="gap-1 text-xs bg-destructive/15 text-destructive border-destructive/30">
              <Flame className="h-3 w-3" />
              新着
            </Badge>
          )}
          {tool.stars_num != null && tool.stars_num > 0 && (
            <Badge className="gap-1 font-medium text-xs bg-badge-amber/15 text-badge-amber border-badge-amber/30">
              <Star className="h-3 w-3 fill-current" />
              {formatStars(tool.stars_num)}
            </Badge>
          )}
        </div>
      </div>

      <p className="ml-6 mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
        {tool.description_ja || tool.description_en || "説明なし"}
      </p>

      <div className="ml-6 mt-3 flex flex-wrap items-center gap-2">
        {tool.parent_category_ja && (
          <Badge variant="secondary" className="text-xs font-normal">
            {tool.parent_category_ja}
          </Badge>
        )}
        {showNew && tool.created_at && (
          <span className="text-xs text-muted-foreground">
            {timeAgo(tool.created_at)}
          </span>
        )}
      </div>
    </Link>
  );
}

/* ---------- Tab: Overall ---------- */

function OverallTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["ranking-overall"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .order("stars_num", { ascending: false, nullsFirst: false })
        .limit(50);
      if (error) throw error;
      return data as Tool[];
    },
  });

  if (isLoading) return <SkeletonList />;
  if (!data?.length)
    return <p className="text-center text-muted-foreground py-12">データがありません</p>;

  return (
    <div className="space-y-3">
      {data.map((tool, i) => (
        <RankingCard key={tool.id} tool={tool} rank={i + 1} />
      ))}
    </div>
  );
}

/* ---------- Tab: Category ---------- */

function CategoryTab() {
  const [category, setCategory] = useState(CATEGORIES[0]);

  const { data, isLoading } = useQuery({
    queryKey: ["ranking-category", category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .eq("parent_category_ja", category)
        .order("stars_num", { ascending: false, nullsFirst: false })
        .limit(20);
      if (error) throw error;
      return data as Tool[];
    },
  });

  return (
    <div>
      <div className="mb-6">
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full max-w-xs rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <SkeletonList count={6} />
      ) : !data?.length ? (
        <p className="text-center text-muted-foreground py-12">データがありません</p>
      ) : (
        <div className="space-y-3">
          {data.map((tool, i) => (
            <RankingCard key={tool.id} tool={tool} rank={i + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Tab: Trending ---------- */

function TrendingTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["ranking-trending"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .order("created_at", { ascending: false, nullsFirst: false })
        .limit(20);
      if (error) throw error;
      return data as Tool[];
    },
  });

  if (isLoading) return <SkeletonList count={6} />;
  if (!data?.length)
    return <p className="text-center text-muted-foreground py-12">データがありません</p>;

  return (
    <div className="space-y-3">
      {data.map((tool, i) => (
        <RankingCard key={tool.id} tool={tool} rank={i + 1} showNew />
      ))}
    </div>
  );
}

/* ---------- Tab: Annual Best ---------- */

function AnnualBestTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["ranking-annual-best"],
    queryFn: async () => {
      // Fetch top tools per category — get enough to cover all categories
      const results: { category: string; tools: Tool[] }[] = [];
      for (const cat of CATEGORIES) {
        const { data, error } = await supabase
          .from("tools")
          .select("*")
          .eq("parent_category_ja", cat)
          .order("stars_num", { ascending: false, nullsFirst: false })
          .limit(3);
        if (error) throw error;
        if (data && data.length > 0) {
          results.push({ category: cat, tools: data as Tool[] });
        }
      }
      return results;
    },
  });

  if (isLoading) return <SkeletonList count={6} />;
  if (!data?.length)
    return <p className="text-center text-muted-foreground py-12">データがありません</p>;

  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="space-y-6">
      {data.map(({ category, tools }) => (
        <div
          key={category}
          className="rounded-xl border bg-card p-5 animate-fade-in"
        >
          <h3 className="flex items-center gap-2 text-lg font-bold mb-4">
            <Crown className="h-5 w-5 text-badge-amber" />
            {category} 部門
          </h3>
          <div className="space-y-2">
            {tools.map((tool, i) => (
              <Link
                key={tool.id}
                to={`/tools/${tool.id}`}
                className="flex items-center gap-3 rounded-lg p-3 hover:bg-muted/50 transition-colors group"
              >
                <span className="text-xl shrink-0">{medals[i]}</span>
                <span className="font-semibold truncate group-hover:text-primary transition-colors">
                  {i + 1}位: {tool.name}
                </span>
                {tool.stars_num != null && tool.stars_num > 0 && (
                  <Badge className="ml-auto shrink-0 gap-1 text-xs bg-badge-amber/15 text-badge-amber border-badge-amber/30">
                    <Star className="h-3 w-3 fill-current" />
                    {formatStars(tool.stars_num)}
                  </Badge>
                )}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Skeleton ---------- */

function SkeletonList({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-5 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-full bg-muted" />
            <div className="h-5 w-40 bg-muted rounded" />
            <div className="ml-auto h-5 w-16 bg-muted rounded-full" />
          </div>
          <div className="mt-3 h-4 w-3/4 bg-muted rounded" />
        </div>
      ))}
    </div>
  );
}

/* ---------- Main Page ---------- */

export default function RankingPage() {
  useSeo({
    title: "OSSツール人気ランキング | OSSアルタナティブ",
    description:
      "GitHubスター数で見るOSSツール人気ランキング。AI・開発・生産性など全カテゴリのトップツールを一覧で確認。",
    canonical: "https://ossalt.jp/ranking",
  });

  return (
    <SiteLayout>
      {/* Top back nav */}
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <Trophy className="h-7 w-7 text-badge-amber" />
            OSSツール人気ランキング
          </h1>
          <p className="mt-2 text-muted-foreground">
            GitHubスター数で見る人気オープンソースツールのランキング
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overall" className="space-y-6">
          <TabsList className="w-full justify-start gap-1 bg-muted/50 p-1 rounded-xl overflow-x-auto flex-nowrap">
            <TabsTrigger value="overall" className="rounded-lg text-sm whitespace-nowrap">
              総合
            </TabsTrigger>
            <TabsTrigger value="category" className="rounded-lg text-sm whitespace-nowrap">
              カテゴリ別
            </TabsTrigger>
            <TabsTrigger value="trending" className="rounded-lg text-sm whitespace-nowrap">
              今週のトレンド
            </TabsTrigger>
            <TabsTrigger value="annual" className="rounded-lg text-sm whitespace-nowrap">
              年間Best
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overall">
            <OverallTab />
          </TabsContent>
          <TabsContent value="category">
            <CategoryTab />
          </TabsContent>
          <TabsContent value="trending">
            <TrendingTab />
          </TabsContent>
          <TabsContent value="annual">
            <AnnualBestTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom back button */}
      <div className="container max-w-4xl mx-auto px-4 pb-12 pt-6 flex justify-center">
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
