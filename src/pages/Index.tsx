import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { useSearchParams, useParams, useNavigate, Link } from "react-router-dom";
import { ArrowUpDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SiteLayout } from "@/components/SiteLayout";
import { CategoryFilter, CATEGORY_MAP } from "@/components/CategoryFilter";
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

/* ── Category slug mapping for /category/:slug URLs ── */

const CATEGORY_SLUG_MAP: Record<string, string> = {
  "ai-ml": "AI・ML",
  "business": "業務ソフト",
  "developer-tools": "開発ツール",
  "infrastructure": "インフラ・運用",
  "data-analytics": "データ・分析",
  "content": "コンテンツ",
  "productivity": "生産性・便利ツール",
  "security": "セキュリティ",
  "community": "コミュニティ",
  "other": "その他",
};

// Reverse: Japanese label → slug
const CATEGORY_TO_SLUG: Record<string, string> = {};
for (const [slug, label] of Object.entries(CATEGORY_SLUG_MAP)) {
  CATEGORY_TO_SLUG[label] = slug;
}

export { CATEGORY_SLUG_MAP, CATEGORY_TO_SLUG };

/* ── Category SEO descriptions ── */

const CATEGORY_SEO: Record<string, { title: string; description: string }> = {
  "AI・ML": {
    title: "AI・機械学習のOSS代替ツール一覧",
    description: "ChatGPT・Copilotなどの有料AIサービスの代替となるオープンソースのAI・機械学習ツールを比較。無料・セルフホスト可能。",
  },
  "業務ソフト": {
    title: "業務ソフトのOSS代替ツール一覧",
    description: "Notion・Asana・Jiraなどの有料業務ソフトの代替となるオープンソースツールを比較。無料・セルフホスト可能。",
  },
  "開発ツール": {
    title: "開発ツールのOSS代替一覧",
    description: "GitHub Copilot・Postmanなどの有料開発ツールの代替となるオープンソースツールを比較。無料・セルフホスト可能。",
  },
  "インフラ・運用": {
    title: "インフラ・運用のOSS代替ツール一覧",
    description: "Datadog・PagerDutyなどのインフラ監視・運用ツールの代替OSSを比較。無料・セルフホスト可能。",
  },
  "データ・分析": {
    title: "データ分析のOSS代替ツール一覧",
    description: "Tableau・Google Analyticsなどのデータ分析ツールの代替OSSを比較。無料・セルフホスト可能。",
  },
  "コンテンツ": {
    title: "コンテンツ管理のOSS代替ツール一覧",
    description: "WordPress・Contentfulなどの有料CMSの代替となるオープンソースツールを比較。無料・セルフホスト可能。",
  },
  "生産性・便利ツール": {
    title: "生産性ツールのOSS代替一覧",
    description: "Evernote・Zapierなどの生産性ツールの代替となるオープンソースツールを比較。無料・セルフホスト可能。",
  },
  "セキュリティ": {
    title: "セキュリティのOSS代替ツール一覧",
    description: "Auth0・Oktaなどの認証・セキュリティツールの代替OSSを比較。無料・セルフホスト可能。",
  },
  "コミュニティ": {
    title: "コミュニティツールのOSS代替一覧",
    description: "Slack・Intercomなどのコミュニケーションツールの代替OSSを比較。無料・セルフホスト可能。",
  },
  "その他": {
    title: "その他のOSS代替ツール一覧",
    description: "さまざまなカテゴリの有料SaaSの代替となるオープンソースツールを比較。",
  },
};

export default function IndexPage() {
  const { slug: categorySlug } = useParams<{ slug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Resolve category from URL slug or query param
  const slugCategory = categorySlug ? CATEGORY_SLUG_MAP[categorySlug] : null;
  const urlCategory = slugCategory || searchParams.get("category") || "すべて";
  const urlSearch = searchParams.get("search") || "";

  // Redirect legacy ?category= to /category/:slug if we have a slug mapping
  useEffect(() => {
    const qCat = searchParams.get("category");
    if (qCat && !categorySlug && CATEGORY_TO_SLUG[qCat]) {
      navigate(`/category/${CATEGORY_TO_SLUG[qCat]}`, { replace: true });
    }
  }, [searchParams, categorySlug, navigate]);

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
  const categorySeo = selectedCategory !== "すべて" ? CATEGORY_SEO[selectedCategory] : null;
  const seoTitle = categorySeo
    ? `${categorySeo.title} | OSSアルタナティブ`
    : "OSSアルタナティブ | 有料SaaSの代替OSSを日本語で検索・比較";
  const seoDescription = categorySeo
    ? categorySeo.description
    : "Notion・Slack・Figma・Zapierなどの有料SaaSの代替となるオープンソースツールを、日本語で検索・比較できるサイトです。無料・セルフホスト可能なOSSを簡単に見つけられます。";
  const categoryCanonicalSlug = CATEGORY_TO_SLUG[selectedCategory];
  const seoCanonical = categoryCanonicalSlug
    ? `https://ossalt.jp/category/${categoryCanonicalSlug}`
    : "https://ossalt.jp/";

  // JSON-LD for category pages
  const jsonLd = useMemo(() => {
    if (!categorySeo || selectedCategory === "すべて") return undefined;
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: categorySeo.title,
      description: categorySeo.description,
      url: seoCanonical,
      isPartOf: {
        "@type": "WebSite",
        name: "OSSアルタナティブ",
        url: "https://ossalt.jp",
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: "https://ossalt.jp" },
          { "@type": "ListItem", position: 2, name: categorySeo.title, item: seoCanonical },
        ],
      },
    };
  }, [categorySeo, selectedCategory, seoCanonical]);

  useSeo({
    title: seoTitle,
    description: seoDescription,
    canonical: seoCanonical,
    jsonLd,
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
    // Only update query params when not using /category/:slug route
    if (categorySlug) return;
    const params = new URLSearchParams();
    if (selectedCategory !== "すべて") params.set("category", selectedCategory);
    if (debouncedSearch) params.set("search", debouncedSearch);
    setSearchParams(params, { replace: true });
  }, [selectedCategory, debouncedSearch, setSearchParams, categorySlug]);

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
    // Navigate to /category/:slug for SEO-friendly URLs
    const slug = CATEGORY_TO_SLUG[cat];
    if (slug) {
      navigate(`/category/${slug}`);
    } else {
      navigate("/");
    }
  }, [navigate]);

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
          {/* Category page heading for SEO */}
          {selectedCategory !== "すべて" && !debouncedSearch && (
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground">
                {categorySeo?.title || `${selectedCategory}のOSSツール`}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {categorySeo?.description?.slice(0, 80) || ""}
              </p>
            </div>
          )}

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
