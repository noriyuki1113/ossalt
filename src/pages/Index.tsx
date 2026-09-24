import { useState, useCallback, useEffect, useRef, useMemo, lazy, Suspense } from "react";
import { useSearchParams, useParams, useNavigate, Link } from "react-router-dom";
import { Box, ChevronRight, Clock3, Flame, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { CategoryFilter } from "@/components/CategoryFilter";
import { ToolCard, ToolCardSkeleton } from "@/components/ToolCard";
import { HeroSection } from "@/components/home/HeroSection";
import { QuickAlternativesPills } from "@/components/home/QuickAlternativesPills";

import { CategorySponsorCTA } from "@/components/ads/CategorySponsorCTA";
import { useAlternativeListings, useCategories, type AlternativeListing, type SortOption } from "@/hooks/use-alternatives";
import { findCategoryBySlug, collectSlugs, type CategoryNode } from "@/lib/category-tree";

// FilterToolbar uses @radix-ui/react-select (352 kB) — lazy-load to keep it out of initial bundle
const FilterToolbar = lazy(() => import("@/components/discovery/FilterToolbar").then(m => ({ default: m.FilterToolbar })));
import { useSeo } from "@/hooks/use-seo";

export default function IndexPage() {
  const { slug: categorySlug } = useParams<{ slug?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { data: categoryTree = [] } = useCategories();
  const selectedCategoryNode: CategoryNode | null = categorySlug ? findCategoryBySlug(categoryTree, categorySlug) : null;
  const categoryTargetSlugs = selectedCategoryNode ? collectSlugs(selectedCategoryNode) : undefined;

  const urlSearch = searchParams.get("search") || "";

  // The URL is the source of truth, including browser back/forward and shared links.
  useEffect(() => {
    setSearch(urlSearch);
    setPage(0);
    setAllListings([]);
  }, [urlSearch, categorySlug]);

  const [search, setSearch] = useState(urlSearch);
  const debouncedSearch = urlSearch;
  const [sort, setSort] = useState<SortOption>("stars");
  const [license, setLicense] = useState("");
  const [hasGithub, setHasGithub] = useState(false);
  const [hasDocker, setHasDocker] = useState(false);
  const [page, setPage] = useState(0);
  const [allListings, setAllListings] = useState<AlternativeListing[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const commitSearch = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value.trim()) params.set("search", value.trim());
    else params.delete("search");
    setSearchParams(params, { replace: true });
    setPage(0);
  }, [searchParams, setSearchParams]);

  const categoryTitle = selectedCategoryNode ? `${selectedCategoryNode.nameJa}のOSS代替ツール一覧` : null;
  const categoryDescription = selectedCategoryNode
    ? `${selectedCategoryNode.nameJa}カテゴリの有料SaaSの代替となるオープンソースツールを比較。無料・セルフホスト可能。`
    : null;

  const seoTitle = categoryTitle
    ? `${categoryTitle} | OSSアルタナティブ`
    : "OSSアルタナティブ | 有料SaaSの代替OSSを日本語で検索・比較";
  const seoDescription = categoryDescription
    || "Notion・Slack・Figma・Zapierなどの有料SaaSの代替となるオープンソースツールを、日本語で検索・比較できるサイトです。無料・セルフホスト可能なOSSを簡単に見つけられます。";
  const seoCanonical = selectedCategoryNode
    ? `https://ossalt.jp/category/${selectedCategoryNode.slug}`
    : "https://ossalt.jp/";

  const jsonLd = useMemo(() => {
    // Homepage: WebSite + SiteLinksSearchBox + Organization
    if (!selectedCategoryNode && !debouncedSearch) {
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
    if (!selectedCategoryNode || !categoryTitle) return undefined;
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CollectionPage",
          name: categoryTitle,
          description: categoryDescription,
          url: seoCanonical,
          isPartOf: { "@type": "WebSite", name: "OSSアルタナティブ", url: "https://ossalt.jp" },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "ホーム", item: "https://ossalt.jp" },
            { "@type": "ListItem", position: 2, name: categoryTitle, item: seoCanonical },
          ],
        },
      ],
    };
  }, [selectedCategoryNode, categoryTitle, categoryDescription, seoCanonical, debouncedSearch]);

  useSeo({
    title: seoTitle,
    description: seoDescription,
    canonical: seoCanonical,
    jsonLd,
  });

  const { data, isLoading, isError, refetch } = useAlternativeListings({
    categorySlugs: categoryTargetSlugs,
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
    if (data?.listings) {
      if (page === 0) {
        setAllListings(data.listings);
      } else {
        setAllListings((prev) => Array.from(new Map([...prev, ...data.listings].map(l => [l.relation_id, l])).values()));
      }
    }
  }, [data, page]);

  const handleCategoryChange = useCallback((slug: string | null) => {
    setPage(0);
    setAllListings([]);
    const params = new URLSearchParams(searchParams);
    navigate({ pathname: slug ? `/category/${slug}` : "/", search: params.toString() });
  }, [navigate, searchParams]);

  const handleSortChange = useCallback((value: SortOption) => {
    setSort(value);
    setPage(0);
    setAllListings([]);
  }, []);

  const handleLicenseChange = useCallback((value: string) => {
    setLicense(value);
    setPage(0);
    setAllListings([]);
  }, []);

  const handleHasGithubChange = useCallback((value: boolean) => {
    setHasGithub(value);
    setPage(0);
    setAllListings([]);
  }, []);

  const handleHasDockerChange = useCallback((value: boolean) => {
    setHasDocker(value);
    setPage(0);
    setAllListings([]);
  }, []);

  const applyCollection = useCallback((collection: "popular" | "new" | "ai" | "selfhost") => {
    setSearch("");
    setLicense("");
    setHasGithub(false);
    setHasDocker(collection === "selfhost");
    setSort(collection === "new" ? "newest" : "stars");
    setPage(0);
    setAllListings([]);
    navigate(collection === "ai" ? "/category/ai" : "/");
  }, [navigate]);

  // Read page zero directly so submitting a cached query never blanks its results.
  const visibleListings = page === 0 ? data?.listings ?? [] : allListings;
  const hasMore = data ? visibleListings.length < data.totalCount : false;

  const otherTopLevelCategories = categoryTree.filter((c) => c.slug !== categorySlug);

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
          <CategoryFilter categories={categoryTree} selectedSlug={categorySlug ?? null} onSelect={handleCategoryChange} />
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

      <section id="search-results" aria-label="検索結果" className="container pb-16 pt-8 scroll-mt-36">
        {!selectedCategoryNode && !debouncedSearch && !license && !hasGithub && !hasDocker && (
          <div className="mb-6 max-w-2xl">
            <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground">
              OSSを探す
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              人気順で表示しています。用途、ライセンス、GitHubの有無で絞り込めます。
            </p>
          </div>
        )}
        {selectedCategoryNode && !debouncedSearch && (
          <div className="mb-6">
            <nav aria-label="パンくずリスト" className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
              <Link to="/" className="hover:text-foreground transition-colors">ホーム</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-medium">
                {selectedCategoryNode.nameJa}
              </span>
            </nav>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground">
              {categoryTitle}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground max-w-2xl">
              {categoryDescription}
            </p>
          </div>
        )}

        {isError ? (
          <div role="alert" className="text-center py-12 space-y-4">
            <p>ツールを読み込めませんでした。時間をおいて再度お試しください。</p>
            <Button variant="outline" onClick={() => refetch()}>再読み込み</Button>
          </div>
        ) : (isLoading && page === 0) || (!data && visibleListings.length === 0) ? (
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
        ) : visibleListings.length > 0 ? (
          <>
            <Suspense fallback={<div className="h-10" />}>
              <FilterToolbar
                sort={sort} onSortChange={handleSortChange}
                license={license} onLicenseChange={handleLicenseChange}
                hasGithub={hasGithub} onHasGithubChange={handleHasGithubChange}
                hasDocker={hasDocker} onHasDockerChange={handleHasDockerChange}
                totalCount={data?.totalCount ?? visibleListings.length}
              />
            </Suspense>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              {visibleListings.map((listing, i) => (
                <ToolCard key={listing.relation_id} listing={listing} index={i} />
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
                setPage(0); setAllListings([]); navigate("/");
              }}>検索条件をリセット</Button>
            </div>
          </div>
        )}

        {selectedCategoryNode && !debouncedSearch && (
          <div className="mt-4">
            <CategorySponsorCTA category={selectedCategoryNode.nameJa} />
          </div>
        )}

        {selectedCategoryNode && !debouncedSearch && otherTopLevelCategories.length > 0 && (
          <div className="mt-8 pt-8 border-t border-border">
            <h2 className="text-sm font-semibold text-foreground mb-3">他のカテゴリも見る</h2>
            <div className="flex flex-wrap gap-2">
              {otherTopLevelCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  className="text-xs px-3 py-1.5 rounded-lg bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  {cat.nameJa}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </SiteLayout>
  );
}
