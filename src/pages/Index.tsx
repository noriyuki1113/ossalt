import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, Trophy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { CategoryFilter } from "@/components/CategoryFilter";
import { StatsBar } from "@/components/StatsBar";
import { ToolCard, ToolCardSkeleton } from "@/components/ToolCard";
import { useTools, type Tool } from "@/hooks/use-tools";
import { useSeo } from "@/hooks/use-seo";

export default function IndexPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get("category") || "すべて";
  const urlSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(urlSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [page, setPage] = useState(0);
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const prevSearchRef = useRef(search);

  useSeo({
    title: "OSSアルタナティブ - 有料SaaSの代わりに使えるオープンソースツール集",
    description:
      "680件のオープンソースツールを日本語で検索。Notion・Slack・Figmaなど有料SaaSの無料代替を見つけよう。",
    canonical: "https://find-my-alt.lovable.app/",
  });

  const { data, isLoading } = useTools({
    category: selectedCategory,
    search: debouncedSearch,
    page,
  });

  // Debounce search - only reset when search value actually changes
  useEffect(() => {
    if (search === prevSearchRef.current && search === debouncedSearch) {
      return; // No actual change, skip (prevents clearing on mount)
    }
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
      setAllTools([]);
      prevSearchRef.current = search;
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  // Sync URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== "すべて") params.set("category", selectedCategory);
    if (debouncedSearch) params.set("search", debouncedSearch);
    setSearchParams(params, { replace: true });
  }, [selectedCategory, debouncedSearch, setSearchParams]);

  // Accumulate tools for "load more"
  useEffect(() => {
    if (data?.tools) {
      if (page === 0) {
        setAllTools(data.tools);
      } else {
        setAllTools((prev) => [...prev, ...data.tools]);
      }
    }
  }, [data, page]);

  const handleCategoryChange = useCallback((cat: string) => {
    setSelectedCategory(cat);
    setPage(0);
    setAllTools([]);
  }, []);

  const hasMore = data ? allTools.length < data.totalCount : false;

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-primary/8 rounded-full blur-3xl" />
          <div className="absolute top-20 left-1/3 w-[400px] h-[300px] bg-[hsl(270_70%_60%/0.06)] rounded-full blur-3xl" />
        </div>
        <div className="container relative py-14 md:py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-gradient">
            OSSアルタナティブ
          </h1>
          <p className="mt-3 text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            有料SaaSの代わりに使えるオープンソースツール集
          </p>

          <div className="mt-8 max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ツール名・説明で検索…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 pl-10 rounded-xl text-base border-border focus-visible:ring-primary"
            />
          </div>

          <div className="mt-8">
            <StatsBar />
          </div>
        </div>
      </section>

      {/* Ranking CTA */}
      <section className="container pt-4 pb-2 flex justify-center">
        <Button variant="outline" className="gap-2 rounded-xl" asChild>
          <Link to="/ranking">
            <Trophy className="h-4 w-4 text-badge-amber" />
            🏆 ランキングを見る
          </Link>
        </Button>
      </section>

      {/* Category Filter - Sticky */}
      <section className="sticky top-14 z-40 bg-background/90 backdrop-blur-md border-b py-3">
        <div className="container">
          <CategoryFilter selected={selectedCategory} onSelect={handleCategoryChange} />
        </div>
      </section>

      {/* Tool Grid */}
      <section className="container pb-16 pt-6">
        {(isLoading && page === 0) || (!data && allTools.length === 0) ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <ToolCardSkeleton key={i} />
            ))}
          </div>
        ) : allTools.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-5">
              {data?.totalCount ?? 0} 件のツール
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {allTools.map((tool, i) => (
                <ToolCard key={tool.id} tool={tool} index={i} />
              ))}
            </div>
            {hasMore && (
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  className="rounded-xl px-8"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={isLoading}
                >
                  {isLoading ? "読み込み中…" : "さらに読み込む"}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground">ツールが見つかりませんでした</p>
            <p className="text-sm text-muted-foreground mt-1">検索条件を変更してみてください</p>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
