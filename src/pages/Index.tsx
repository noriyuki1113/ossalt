import { useState, useCallback, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SiteLayout } from "@/components/SiteLayout";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ToolCard, ToolCardSkeleton } from "@/components/ToolCard";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedTools } from "@/components/home/FeaturedTools";
import { PopularAlternatives } from "@/components/home/PopularAlternatives";
import { UseCaseSection } from "@/components/home/UseCaseSection";
import { WhyOSSSection } from "@/components/home/WhyOSSSection";
import { NewToolsSection } from "@/components/home/NewToolsSection";
import { FAQSection } from "@/components/home/FAQSection";
import { BottomCTA } from "@/components/home/BottomCTA";
import { TrustSection } from "@/components/home/TrustSection";
import { StatsBar } from "@/components/StatsBar";
import { AdSlot } from "@/components/ads/AdSlot";
import { useTools, type Tool, type SortOption } from "@/hooks/use-tools";
import { useSeo } from "@/hooks/use-seo";

export default function IndexPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlCategory = searchParams.get("category") || "すべて";
  const urlSearch = searchParams.get("search") || "";

  const [search, setSearch] = useState(urlSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [sort, setSort] = useState<SortOption>("stars");
  const [page, setPage] = useState(0);
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const prevSearchRef = useRef(search);

  const isBrowsing = debouncedSearch !== "" || selectedCategory !== "すべて";

  // Category-aware SEO
  const categoryTitle = selectedCategory !== "すべて" ? selectedCategory : null;
  const seoTitle = categoryTitle
    ? `${categoryTitle}のOSS代替ツール一覧 | OSSアルタナティブ`
    : "OSSアルタナティブ | 有料SaaSの代替OSSを日本語で検索・比較";
  const seoDescription = categoryTitle
    ? `${categoryTitle}カテゴリの有料SaaS代替となるオープンソースツールを一覧で比較。無料・セルフホスト可能なOSSを見つけよう。`
    : "Notion・Slack・Figma・Zapierなどの有料SaaSの代替となるオープンソースツールを、日本語で検索・比較できるサイトです。無料・セルフホスト可能なOSSを簡単に見つけられます。";

  useSeo({
    title: seoTitle,
    description: seoDescription,
    canonical: categoryTitle
      ? `https://ossalt.jp/?category=${encodeURIComponent(categoryTitle)}`
      : "https://ossalt.jp/",
  });

  const { data, isLoading } = useTools({
    category: selectedCategory,
    search: debouncedSearch,
    page,
    sort,
  });

  useEffect(() => {
    if (search === prevSearchRef.current && search === debouncedSearch) return;
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(0);
      setAllTools([]);
      prevSearchRef.current = search;
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [search]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== "すべて") params.set("category", selectedCategory);
    if (debouncedSearch) params.set("search", debouncedSearch);
    setSearchParams(params, { replace: true });
  }, [selectedCategory, debouncedSearch, setSearchParams]);

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

  const handleSortChange = useCallback((value: string) => {
    setSort(value as SortOption);
    setPage(0);
    setAllTools([]);
  }, []);

  const hasMore = data ? allTools.length < data.totalCount : false;

  return (
    <SiteLayout>
      {/* Hero */}
      <HeroSection
        search={search}
        onSearchChange={setSearch}
        onCategorySelect={handleCategoryChange}
      />

      {/* Category Filter - Sticky */}
      <section className="sticky top-14 z-40 bg-background/80 backdrop-blur-xl border-b border-border py-2.5">
        <div className="container">
          <CategoryFilter selected={selectedCategory} onSelect={handleCategoryChange} />
        </div>
      </section>

      {isBrowsing ? (
        <section className="container pb-16 pt-8">
          {(isLoading && page === 0) || (!data && allTools.length === 0) ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <ToolCardSkeleton key={i} />
              ))}
            </div>
          ) : allTools.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-muted-foreground">
                  {data?.totalCount ?? 0} 件のツール
                </p>
                <Select value={sort} onValueChange={handleSortChange}>
                  <SelectTrigger className="w-auto gap-1.5 h-9 text-xs rounded-lg border-border">
                    <ArrowUpDown className="h-3.5 w-3.5" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stars">⭐ スター数順</SelectItem>
                    <SelectItem value="recent">🕐 最近更新順</SelectItem>
                    <SelectItem value="name">🔤 A-Z順</SelectItem>
                    <SelectItem value="newest">🆕 新着順</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allTools.map((tool, i) => (
                  <ToolCard key={tool.id} tool={tool} index={i} />
                ))}
              </div>
              {hasMore && (
                <div className="mt-10 text-center">
                  <Button
                    variant="outline"
                    className="rounded-xl px-8 border-border"
                    onClick={() => setPage((p) => p + 1)}
                    disabled={isLoading}
                  >
                    {isLoading ? "読み込み中…" : "さらに読み込む"}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground">ツールが見つかりませんでした</p>
              <p className="text-sm text-muted-foreground mt-1">検索条件を変更してみてください</p>
            </div>
          )}
        </section>
      ) : (
        <>
          <StatsBar />
          <PopularAlternatives />
          <div className="container py-6 px-4 md:px-8">
            <AdSlot slotId="top-after-popular" format="horizontal" />
          </div>
          <UseCaseSection />
          <WhyOSSSection />
          <div className="container py-6 px-4 md:px-8">
            <AdSlot slotId="top-after-usecase" format="horizontal" />
          </div>
          <FeaturedTools />
          <NewToolsSection />
          <TrustSection />
          <FAQSection />
          <BottomCTA />
        </>
      )}
    </SiteLayout>
  );
}
