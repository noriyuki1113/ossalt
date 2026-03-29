import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
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
  const initialCategory = searchParams.get("category") || "すべて";
  const initialSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [page, setPage] = useState(0);
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useSeo({
    title: "OSSアルタナティブ — 有料SaaSの代わりに使えるオープンソースツール集",
    description:
      "680件以上のオープンソースツールを日本語で検索。有料SaaSの代替となるOSSを見つけましょう。",
  });

  const { data, isLoading } = useTools({
    category: selectedCategory,
    search: debouncedSearch,
    page,
  });

  // Debounce search
  useEffect(() => {
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
      setAllTools([]);
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
      <section className="relative bg-gradient-to-b from-primary/[0.06] via-background to-background">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
        </div>
        <div className="container relative py-14 md:py-20 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
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

      {/* Category Filter */}
      <section className="container py-4">
        <CategoryFilter selected={selectedCategory} onSelect={handleCategoryChange} />
      </section>

      {/* Tool Grid */}
      <section className="container pb-16">
        {isLoading && page === 0 ? (
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
              {allTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
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
