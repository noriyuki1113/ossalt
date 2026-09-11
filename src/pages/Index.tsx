import { useState, useCallback, useEffect, useRef, useMemo, lazy, Suspense } from "react";
import { useSearchParams, useParams, useNavigate, Link } from "react-router-dom";
import { Box, ChevronRight, Clock3, Flame, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ToolCard, ToolCardSkeleton } from "@/components/ToolCard";
import { HeroSection } from "@/components/home/HeroSection";
import { QuickAlternativesPills } from "@/components/home/QuickAlternativesPills";
import { SponsorPitchSection } from "@/components/home/SponsorPitchSection";
import { StatsBar } from "@/components/StatsBar";
import { LazySection } from "@/components/LazySection";

import { CategorySponsorCTA } from "@/components/ads/CategorySponsorCTA";
import { useTools, type Tool, type SortOption } from "@/hooks/use-tools";

// FilterToolbar uses @radix-ui/react-select (352 kB) — lazy-load to keep it out of initial bundle
const FilterToolbar = lazy(() => import("@/components/discovery/FilterToolbar").then(m => ({ default: m.FilterToolbar })));
import { useSeo } from "@/hooks/use-seo";

// Lazy-load all below-fold sections (code + data deferred until near viewport)
const PopularAlternativesSection = lazy(() => import("@/components/home/PopularAlternativesSection").then(m => ({ default: m.PopularAlternativesSection })));
const PopularComparisonsSection = lazy(() => import("@/components/home/PopularComparisonsSection").then(m => ({ default: m.PopularComparisonsSection })));
const PopularCategoriesGrid = lazy(() => import("@/components/home/PopularCategoriesGrid").then(m => ({ default: m.PopularCategoriesGrid })));
const FeaturedToolsRail = lazy(() => import("@/components/home/FeaturedToolsRail").then(m => ({ default: m.FeaturedToolsRail })));
const NewToolsSection = lazy(() => import("@/components/home/NewToolsSection").then(m => ({ default: m.NewToolsSection })));
const WhyOSSSection = lazy(() => import("@/components/home/WhyOSSSection").then(m => ({ default: m.WhyOSSSection })));
const FAQSection = lazy(() => import("@/components/home/FAQSection").then(m => ({ default: m.FAQSection })));
const BottomCTA = lazy(() => import("@/components/home/BottomCTA").then(m => ({ default: m.BottomCTA })));
const SelfHostHomeSection = lazy(() => import("@/components/home/SelfHostHomeSection").then(m => ({ default: m.SelfHostHomeSection })));
const NewGuidesSection = lazy(() => import("@/components/home/NewGuidesSection").then(m => ({ default: m.NewGuidesSection })));

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

function SectionFallback() {
  return <div className="h-32" />;
}

export default function IndexPage() {
  const { slug: categorySlug } = useParams<{ slug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const slugCategory = categorySlug ? CATEGORY_SLUG_MAP[categorySlug] : null;
  const urlCategory = slugCategory || searchParams.get("category") || "すべて";
  const urlSearch = searchParams.get("search") || "";

  useEffect(() => {
    const qCat = searchParams.get("category");
    if (qCat && !categorySlug && CATEGORY_TO_SLUG[qCat]) {
      const params = new URLSearchParams(searchParams);
      params.delete("category");
      navigate({ pathname: `/category/${CATEGORY_TO_SLUG[qCat]}`, search: params.toString() }, { replace: true });
    }
  }, [searchParams, categorySlug, navigate]);

  // The URL is the source of truth, including browser back/forward and shared links.
  useEffect(() => {
    setSearch(urlSearch);
    setPage(0);
    setAllTools([]);
  }, [urlSearch, urlCategory]);

  const [search, setSearch] = useState(urlSearch);
  const debouncedSearch = urlSearch;
  const selectedCategory = urlCategory;
  const [sort, setSort] = useState<SortOption>("stars");
  const [license, setLicense] = useState("");
  const [hasGithub, setHasGithub] = useState(false);
  const [hasDocker, setHasDocker] = useState(false);
  const [page, setPage] = useState(0);
  const [allTools, setAllTools] = useState<Tool[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const commitSearch = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value.trim()) params.set("search", value.trim());
    else params.delete("search");
    setSearchParams(params, { replace: true });
    setPage(0);
  }, [searchParams, setSearchParams]);

  // The home page is a directory first: visitors can browse useful tools before
  // they know the name of a specific SaaS product.
  const isBrowsing = true;

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

  const jsonLd = useMemo(() => {
    // Homepage: WebSite + SiteLinksSearchBox + Organization
    if (selectedCategory === "すべて" && !debouncedSearch) {
      return {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "WebSite",
            "@id": "https://ossalt.jp/#website",
            "url": "https://ossalt.jp",
            "name": "OSSアルタナティブ",
            "description": "有料SaaSの代替となるオープンソースツールを日本語で検索・比較できるサイト",
            "inLanguage": "ja",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://ossalt.jp/?search={search_term_string}",
              },
              "query-input": "required name=search_term_string",
            },
          },
          {
            "@type": "Organization",
            "@id": "https://ossalt.jp/#organization",
            "url": "https://ossalt.jp",
            "name": "OSSアルタナティブ",
            "logo": {
              "@type": "ImageObject",
              "url": "https://ossalt.jp/logo.png",
              "width": 512,
              "height": 512,
            },
            "sameAs": ["https://github.com/ossalt-jp"],
          },
        ],
      };
    }

    // Category page: CollectionPage + BreadcrumbList
    if (!categorySeo) return undefined;
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          name: categorySeo.title,
          description: categorySeo.description,
          url: seoCanonical,
          isPartOf: { "@type": "WebSite", name: "OSSアルタナティブ", url: "https://ossalt.jp" },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "ホーム", item: "https://ossalt.jp" },
            { "@type": "ListItem", position: 2, name: categorySeo.title, item: seoCanonical },
          ],
        },
      ],
    };
  }, [categorySeo, selectedCategory, seoCanonical, debouncedSearch]);

  useSeo({
    title: seoTitle,
    description: seoDescription,
    canonical: seoCanonical,
    jsonLd,
  });

  const { data, isLoading, isError, refetch } = useTools({
    category: selectedCategory,
    search: debouncedSearch,
    page,
    sort,
    license: license || undefined,
    hasGithub: hasGithub || undefined,
    hasDocker: hasDocker || undefined,
  });

  useEffect(() => {
    if (search.trim() === debouncedSearch) return;
    debounceRef.current = setTimeout(() => {
      commitSearch(search);
    }, 300);
    return () => clearTimeout(debounceRef.current);
  }, [search, debouncedSearch, commitSearch]);

  useEffect(() => {
    if (data?.tools) {
      if (page === 0) {
        setAllTools(data.tools);
      } else {
        setAllTools((prev) => Array.from(new Map([...prev, ...data.tools].map(tool => [tool.id, tool])).values()));
      }
    }
  }, [data, page]);

  const handleCategoryChange = useCallback((cat: string) => {
    setPage(0);
    setAllTools([]);
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    const slug = CATEGORY_TO_SLUG[cat];
    navigate({ pathname: slug ? `/category/${slug}` : "/", search: params.toString() });
  }, [navigate, searchParams]);

  const handleSortChange = useCallback((value: SortOption) => {
    setSort(value);
    setPage(0);
    setAllTools([]);
  }, []);

  const handleLicenseChange = useCallback((value: string) => {
    setLicense(value);
    setPage(0);
    setAllTools([]);
  }, []);

  const handleHasGithubChange = useCallback((value: boolean) => {
    setHasGithub(value);
    setPage(0);
    setAllTools([]);
  }, []);

  const handleHasDockerChange = useCallback((value: boolean) => {
    setHasDocker(value);
    setPage(0);
    setAllTools([]);
  }, []);

  const applyCollection = useCallback((collection: "popular" | "new" | "ai" | "selfhost") => {
    setSearch("");
    setLicense("");
    setHasGithub(false);
    setHasDocker(collection === "selfhost");
    setSort(collection === "new" ? "newest" : "stars");
    setPage(0);
    setAllTools([]);
    navigate(collection === "ai" ? "/category/ai-ml" : "/");
  }, [navigate]);

  // Read page zero directly so submitting a cached query never blanks its results.
  const visibleTools = page === 0 ? data?.tools ?? [] : allTools;
  const hasMore = data ? visibleTools.length < data.totalCount : false;

  return (
    <SiteLayout>
      <HeroSection
        search={search}
        onSearchChange={setSearch}
        onSearchSubmit={() => {
          clearTimeout(debounceRef.current);
          setSearch(search.trim());
          commitSearch(search);
          window.setTimeout(() => document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
        }}
      />

      <QuickAlternativesPills />

      <section className="sticky top-14 z-40 bg-background/80 backdrop-blur-xl border-b border-border py-2.5">
        <div className="container">
          <CategoryFilter selected={selectedCategory} onSelect={handleCategoryChange} />
        </div>
      </section>

      <section className="border-b border-border bg-secondary/20">
        <div className="container flex gap-2 overflow-x-auto py-3 scrollbar-hide" aria-label="コレクション">
          {[
            { id: "popular", label: "人気", icon: Flame },
            { id: "new", label: "新着", icon: Clock3 },
            { id: "ai", label: "AI", icon: Sparkles },
            { id: "selfhost", label: "Docker対応", icon: Box },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => applyCollection(id as "popular" | "new" | "ai" | "selfhost")}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/40 hover:bg-primary/[0.06] hover:text-primary transition-colors"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
      </section>

      {isBrowsing ? (
        <section id="search-results" aria-label="検索結果" className="container pb-16 pt-8 scroll-mt-36">
          {selectedCategory === "すべて" && !debouncedSearch && !license && !hasGithub && !hasDocker && (
            <div className="mb-6 max-w-2xl">
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground">
                OSSを探す
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                人気順で表示しています。用途、ライセンス、GitHubの有無で絞り込めます。
              </p>
            </div>
          )}
          {selectedCategory !== "すべて" && !debouncedSearch && (
            <div className="mb-6">
              <nav aria-label="パンくずリスト" className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                <Link to="/" className="hover:text-foreground transition-colors">ホーム</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground font-medium">
                  {categorySeo?.title || `${selectedCategory}のOSSツール`}
                </span>
              </nav>
              <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground">
                {categorySeo?.title || `${selectedCategory}のOSSツール`}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
                {categorySeo?.description || ""}
              </p>
            </div>
          )}

          {isError ? (
            <div role="alert" className="text-center py-12 space-y-4">
              <p>ツールを読み込めませんでした。時間をおいて再度お試しください。</p>
              <Button variant="outline" onClick={() => refetch()}>再読み込み</Button>
            </div>
          ) : (isLoading && page === 0) || (!data && visibleTools.length === 0) ? (
            <>
              <Suspense fallback={<div className="h-10" />}>
                <FilterToolbar
                  sort={sort} onSortChange={handleSortChange}
                  license={license} onLicenseChange={handleLicenseChange}
                  hasGithub={hasGithub} onHasGithubChange={handleHasGithubChange}
                  hasDocker={hasDocker} onHasDockerChange={handleHasDockerChange}
                  totalCount={0}
                />
              </Suspense>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <ToolCardSkeleton key={i} />
                ))}
              </div>
            </>
          ) : visibleTools.length > 0 ? (
            <>
              <Suspense fallback={<div className="h-10" />}>
                <FilterToolbar
                  sort={sort} onSortChange={handleSortChange}
                  license={license} onLicenseChange={handleLicenseChange}
                  hasGithub={hasGithub} onHasGithubChange={handleHasGithubChange}
                  hasDocker={hasDocker} onHasDockerChange={handleHasDockerChange}
                  totalCount={data?.totalCount ?? visibleTools.length}
                />
              </Suspense>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {visibleTools.map((tool, i) => (
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
              <p className="text-sm text-muted-foreground mt-2">サービス名を短くするか、絞り込み条件を解除してください。</p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <Button variant="outline" onClick={() => {
                  clearTimeout(debounceRef.current);
                  setLicense(""); setHasGithub(false); setHasDocker(false); setSearch("");
                  setPage(0); setAllTools([]); navigate("/");
                }}>検索条件をリセット</Button>
                <Button variant="outline" asChild><Link to="/alternatives">サービス別の代替一覧を見る</Link></Button>
              </div>
            </div>
          )}

          {selectedCategory !== "すべて" && !debouncedSearch && (
            <div className="mt-4">
              <CategorySponsorCTA category={selectedCategory} />
            </div>
          )}

          {selectedCategory !== "すべて" && !debouncedSearch && (
            <div className="mt-8 pt-8 border-t border-border">
              <h2 className="text-sm font-semibold text-foreground mb-3">他のカテゴリも見る</h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(CATEGORY_SLUG_MAP)
                  .filter(([, label]) => label !== selectedCategory)
                  .map(([slug, label]) => (
                    <Link
                      key={slug}
                      to={`/category/${slug}`}
                      className="text-xs px-3 py-1.5 rounded-lg bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </section>
      ) : (
        <>
          {/* Above-fold: stats only — no extra network requests */}
          <StatsBar />

          {/* Below-fold: deferred via IntersectionObserver (code + data) */}
          <LazySection placeholderHeight="200px">
            <Suspense fallback={<SectionFallback />}>
              <PopularAlternativesSection />
            </Suspense>
          </LazySection>

          <LazySection placeholderHeight="300px">
            <Suspense fallback={<SectionFallback />}>
              <PopularComparisonsSection />
            </Suspense>
          </LazySection>

          <LazySection placeholderHeight="350px">
            <Suspense fallback={<SectionFallback />}>
              <PopularCategoriesGrid />
            </Suspense>
          </LazySection>

          <LazySection placeholderHeight="240px">
            <Suspense fallback={<SectionFallback />}>
              <FeaturedToolsRail />
            </Suspense>
          </LazySection>

          <LazySection placeholderHeight="400px">
            <Suspense fallback={<SectionFallback />}>
              <NewToolsSection />
            </Suspense>
          </LazySection>

          <LazySection placeholderHeight="200px">
            <Suspense fallback={<SectionFallback />}>
              <SelfHostHomeSection />
            </Suspense>
          </LazySection>

          <LazySection placeholderHeight="200px">
            <Suspense fallback={<SectionFallback />}>
              <NewGuidesSection />
            </Suspense>
          </LazySection>

          <LazySection placeholderHeight="200px">
            <Suspense fallback={<SectionFallback />}>
              <WhyOSSSection />
            </Suspense>
          </LazySection>

          <LazySection placeholderHeight="200px">
            <Suspense fallback={<SectionFallback />}>
              <FAQSection />
            </Suspense>
          </LazySection>

          <LazySection placeholderHeight="120px">
            <Suspense fallback={<SectionFallback />}>
              <BottomCTA />
            </Suspense>
          </LazySection>

          <SponsorPitchSection />
        </>
      )}
    </SiteLayout>
  );
}
