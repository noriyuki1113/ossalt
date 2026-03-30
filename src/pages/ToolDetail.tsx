import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft, ExternalLink, Github, Star, Scale,
  CheckCircle2, ArrowRight, Copy, Server, Clock,
  GitFork, Linkedin, Twitter,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { useSeo } from "@/hooks/use-seo";
import type { Tool } from "@/hooks/use-tools";
import { COMPETITOR_TO_SLUG } from "./AlternativesPage";
import { toast } from "sonner";

/* ── helpers ── */

function formatStars(num: number | null): string {
  if (!num) return "0";
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(num);
}

function getFaviconUrl(url: string | null, size = 64): string | null {
  if (!url) return null;
  try {
    return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=${size}`;
  } catch {
    return null;
  }
}

/* Infer tech tags from category */
function inferTechTags(tool: Tool): string[] {
  const cat = (tool.parent_category_en || tool.category_en || "").toLowerCase();
  const desc = (tool.description_en || "").toLowerCase();
  const tags: string[] = [];

  if (cat.includes("ai") || cat.includes("machine")) {
    tags.push("Python", "LangChain", "OpenAI");
  } else if (cat.includes("developer") || cat.includes("dev")) {
    tags.push("TypeScript", "React", "Docker");
  } else if (cat.includes("infra") || cat.includes("ops")) {
    tags.push("Kubernetes", "Terraform", "Go");
  } else if (cat.includes("data") || cat.includes("analytics")) {
    tags.push("PostgreSQL", "Redis", "Elasticsearch");
  } else if (cat.includes("content") || cat.includes("publishing")) {
    tags.push("Next.js", "Markdown", "Node.js");
  } else if (cat.includes("security") || cat.includes("privacy")) {
    tags.push("Go", "Rust", "OAuth");
  } else if (cat.includes("business") || cat.includes("productivity")) {
    tags.push("TypeScript", "PostgreSQL", "Docker");
  } else if (cat.includes("community") || cat.includes("social")) {
    tags.push("Ruby", "React", "Redis");
  } else {
    tags.push("Open Source", "Self-hosted");
  }

  // Add from description
  if (desc.includes("rust")) tags.push("Rust");
  if (desc.includes("golang") || desc.includes(" go ")) tags.push("Go");
  if (desc.includes("python")) tags.push("Python");

  return [...new Set(tags)].slice(0, 5);
}

/* Generate key benefits from category */
function getKeyBenefits(tool: Tool): string[] {
  const base = [
    `${tool.license || "オープンソース"}ライセンスで完全無料`,
    "セルフホスト対応でデータを完全管理",
  ];
  const cat = (tool.parent_category_ja || "").toLowerCase();
  if (cat.includes("ai")) {
    base.push("最新のAIモデルを自由に統合", "プライベートデータでの運用が可能");
  } else if (cat.includes("開発")) {
    base.push("CI/CDパイプラインに統合可能", "APIファーストで拡張が容易");
  } else if (cat.includes("インフラ")) {
    base.push("マルチクラウド対応", "Infrastructure as Codeで管理");
  } else if (cat.includes("ビジネス") || cat.includes("生産性")) {
    base.push("チーム規模を問わず利用可能", "カスタムワークフローに対応");
  } else if (cat.includes("データ")) {
    base.push("リアルタイムダッシュボードを構築", "複数データソースを統合");
  } else if (cat.includes("セキュリティ")) {
    base.push("コンプライアンス要件に対応", "監査ログの完全管理");
  } else {
    base.push("コミュニティ主導の活発な開発", "プラグイン・拡張で機能追加");
  }
  return base.slice(0, 4);
}

/* ── Compact related card ── */

function RelatedCard({ tool }: { tool: Tool }) {
  const favicon = getFaviconUrl(tool.url, 32);
  return (
    <Link
      to={`/tools/${tool.id}`}
      className="flex items-start gap-3 rounded-xl border bg-card p-4 transition-all hover:-translate-y-0.5 card-glow"
    >
      {favicon ? (
        <img src={favicon} alt="" width={20} height={20} className="rounded shrink-0 mt-0.5" loading="lazy" />
      ) : (
        <span className="h-5 w-5 rounded bg-muted text-muted-foreground text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5 uppercase">
          {tool.name?.charAt(0) || "?"}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-sm truncate">{tool.name}</h4>
          {tool.stars_num != null && tool.stars_num > 0 && (
            <Badge className="gap-0.5 text-[10px] bg-badge-amber/15 text-badge-amber border-badge-amber/30 shrink-0">
              <Star className="h-2.5 w-2.5 fill-current" />
              {formatStars(tool.stars_num)}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
          {tool.description_ja || tool.description_en || ""}
        </p>
      </div>
    </Link>
  );
}

/* ── Main Page ── */

export default function ToolDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: tool, isLoading } = useQuery({
    queryKey: ["tool", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tools").select("*").eq("id", Number(id)).single();
      if (error) throw error;
      return data as Tool;
    },
    enabled: !!id,
  });

  const { data: relatedTools } = useQuery({
    queryKey: ["related-tools", tool?.parent_category_ja, tool?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tools").select("*")
        .eq("parent_category_ja", tool!.parent_category_ja!)
        .neq("id", tool!.id)
        .order("stars_num", { ascending: false, nullsFirst: false })
        .limit(6);
      if (error) throw error;
      return (data as Tool[]) || [];
    },
    enabled: !!tool?.parent_category_ja,
  });

  const competitor = tool?.primary_competitor_ja || tool?.primary_competitor || null;

  const seoTitle = tool
    ? competitor && competitor !== "有料SaaS"
      ? `${tool.name}は${competitor}の代替？特徴と違いを解説`
      : `${tool.name} — OSSアルタナティブ`
    : "読み込み中…";

  const seoDescription = tool
    ? competitor && competitor !== "有料SaaS"
      ? `${tool.name}は${competitor}の代替OSSです。${tool.description_ja || ""}。無料・セルフホスト可能。`
      : tool.description_ja || tool.description_en || ""
    : "";

  const jsonLd = tool
    ? {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: tool.name,
        description: tool.description_ja || tool.description_en || "",
        applicationCategory: tool.category_ja || tool.parent_category_ja || "",
        offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
        operatingSystem: "Web",
        ...(tool.url ? { url: tool.url } : {}),
      }
    : undefined;

  useSeo({
    title: seoTitle,
    description: seoDescription,
    canonical: tool ? `https://find-my-alt.lovable.app/tools/${tool.id}` : undefined,
    ogImage: "https://find-my-alt.lovable.app/og-image.png",
    jsonLd,
  });

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="container py-12">
          <div className="animate-pulse space-y-6 max-w-5xl mx-auto">
            <div className="h-6 w-40 bg-muted rounded" />
            <div className="h-10 w-64 bg-muted rounded" />
            <div className="h-5 w-full bg-muted rounded" />
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (!tool) {
    return (
      <SiteLayout>
        <div className="container py-20 text-center">
          <p className="text-muted-foreground text-lg">ツールが見つかりませんでした</p>
          <Button variant="outline" className="mt-6" asChild>
            <Link to="/"><ArrowLeft className="h-4 w-4 mr-2" />ツール一覧に戻る</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const favicon = getFaviconUrl(tool.url, 64);
  const shareUrl = `https://find-my-alt.lovable.app/tools/${tool.id}`;
  const shareText = `${tool.name} — ${tool.description_ja || tool.description_en || ""}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;

  const keyBenefits = getKeyBenefits(tool);
  const techTags = inferTechTags(tool);

  const competitorKey = tool.primary_competitor || "";
  const altSlug = COMPETITOR_TO_SLUG[competitorKey];

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("リンクをコピーしました");
  };

  return (
    <SiteLayout>
      {/* Back nav */}
      <div className="container max-w-6xl mx-auto pt-6 px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          ツール一覧に戻る
        </Link>
      </div>

      {/* ── Two-column layout ── */}
      <div className="container max-w-6xl mx-auto px-4 py-8 animate-fade-in">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── LEFT COLUMN (main) ── */}
          <div className="flex-1 min-w-0 lg:max-w-[70%]">

            {/* Header */}
            <section>
              <div className="flex items-start gap-4">
                {favicon ? (
                  <img
                    src={favicon}
                    alt=""
                    width={64}
                    height={64}
                    className="rounded-xl shrink-0 border border-border"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <span className="h-16 w-16 rounded-xl bg-muted text-muted-foreground text-2xl font-bold flex items-center justify-center shrink-0 uppercase border border-border">
                    {tool.name?.charAt(0) || "?"}
                  </span>
                )}
                <div className="min-w-0">
                  <h1 className="text-3xl font-extrabold tracking-tight">{tool.name}</h1>
                  {competitor && competitor !== "有料SaaS" && (
                    <p className="text-sm text-primary mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
                      {competitor} の代替
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 space-y-2">
                <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                  {tool.description_ja || "説明なし"}
                </p>
                {tool.description_en && tool.description_ja && (
                  <p className="text-sm text-muted-foreground/50 leading-relaxed italic">
                    {tool.description_en}
                  </p>
                )}
              </div>
            </section>

            {/* Buttons */}
            <section className="mt-6 flex flex-wrap items-center gap-3">
              {tool.url && (
                <Button size="lg" className="gap-2 rounded-xl text-base" asChild>
                  <a href={tool.url} target="_blank" rel="noopener noreferrer">
                    サイトへ <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {tool.github_url && (
                <Button variant="outline" size="lg" className="gap-2 rounded-xl text-base" asChild>
                  <a href={tool.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                    GitHubを見る
                  </a>
                </Button>
              )}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={copyLink}
                  className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  title="リンクをコピー"
                >
                  <Copy className="h-4 w-4 text-muted-foreground" />
                </button>
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  title="Xでシェア"
                >
                  <Twitter className="h-4 w-4 text-muted-foreground" />
                </a>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  title="LinkedInでシェア"
                >
                  <Linkedin className="h-4 w-4 text-muted-foreground" />
                </a>
              </div>
            </section>

            <hr className="border-border my-8" />

            {/* Description & Key Benefits */}
            <section>
              <h2 className="text-xl font-bold mb-4">{tool.name} とは？</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {tool.name} は、{tool.category_ja || tool.parent_category_ja || "様々な用途"}のためのオープンソースツールです。
                {tool.description_ja && ` ${tool.description_ja}`}
                {competitor && competitor !== "有料SaaS" && ` ${competitor}の代替として多くの開発者に利用されています。`}
              </p>

              <h3 className="text-base font-semibold mb-3">主なメリット</h3>
              <ul className="space-y-2.5">
                {keyBenefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{b}</span>
                  </li>
                ))}
              </ul>
            </section>

            <hr className="border-border my-8" />

            {/* Category & Tags */}
            <section>
              <h2 className="text-lg font-bold mb-3">カテゴリ</h2>
              <div className="flex flex-wrap gap-2">
                {tool.parent_category_ja && (
                  <Badge variant="secondary" className="text-sm">{tool.parent_category_ja}</Badge>
                )}
                {tool.category_ja && tool.category_ja !== tool.parent_category_ja && (
                  <Badge variant="secondary" className="text-sm">{tool.category_ja}</Badge>
                )}
                {tool.license && (
                  <Badge variant="outline" className="gap-1 text-sm">
                    <Scale className="h-3 w-3" />{tool.license}
                  </Badge>
                )}
              </div>
            </section>
          </div>

          {/* ── RIGHT COLUMN (sidebar) ── */}
          <aside className="w-full lg:w-[30%] shrink-0 space-y-5">

            {/* GitHub Status Card */}
            <div className="rounded-xl border bg-card p-5">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                GitHub情報
              </h3>
              <div className="space-y-3">
                {tool.stars_num != null && tool.stars_num > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-4 w-4 text-badge-amber" />
                      スター数
                    </span>
                    <span className="font-semibold text-sm">{formatStars(tool.stars_num)}</span>
                  </div>
                )}
                {tool.github_url && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <GitFork className="h-4 w-4" />
                        フォーク数
                      </span>
                      <span className="text-sm text-muted-foreground">—</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        最終コミット
                      </span>
                      <span className="text-sm text-muted-foreground">—</span>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Server className="h-4 w-4" />
                    Self-hosted
                  </span>
                  <span className="font-semibold text-sm text-primary">Yes</span>
                </div>
              </div>

              {tool.github_url && (
                <Button variant="outline" className="w-full mt-4 gap-2 rounded-xl text-sm" asChild>
                  <a href={tool.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                    View Repository
                  </a>
                </Button>
              )}
            </div>

            {/* Categories sidebar */}
            <div className="rounded-xl border bg-card p-5">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                カテゴリ
              </h3>
              <div className="flex flex-col gap-1.5">
                {tool.parent_category_ja && (
                  <Link
                    to={`/?category=${encodeURIComponent(tool.parent_category_ja)}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {tool.parent_category_ja}
                  </Link>
                )}
                {tool.category_ja && tool.category_ja !== tool.parent_category_ja && (
                  <Link
                    to={`/?category=${encodeURIComponent(tool.parent_category_ja || "")}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {tool.category_ja}
                  </Link>
                )}
              </div>
            </div>

            {/* Built with (tech tags) */}
            <div className="rounded-xl border bg-card p-5">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Built with
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {techTags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs font-normal">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="rounded-xl border bg-card p-5">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Share
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={copyLink}
                  className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  title="Copy Link"
                >
                  <Copy className="h-4 w-4 text-muted-foreground" />
                </button>
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  title="X"
                >
                  <Twitter className="h-4 w-4 text-muted-foreground" />
                </a>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-9 w-9 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  title="LinkedIn"
                >
                  <Linkedin className="h-4 w-4 text-muted-foreground" />
                </a>
              </div>
            </div>

            {/* Check alternatives */}
            {competitor && competitor !== "有料SaaS" && altSlug && (
              <div className="rounded-xl border bg-card p-5">
                <Link
                  to={`/alternatives/${altSlug}`}
                  className="flex items-center gap-2 text-sm text-primary hover:underline font-medium"
                >
                  Check {competitorKey} alternatives
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </aside>
        </div>

        {/* ── Bottom sections (full width) ── */}
        <hr className="border-border my-10" />

        {/* Related tools */}
        {relatedTools && relatedTools.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-6">関連するOSSプロジェクト</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {relatedTools.map((t) => (
                <RelatedCard key={t.id} tool={t} />
              ))}
            </div>
          </section>
        )}

        {/* View all */}
        <div className="mt-10 pb-16 flex justify-center">
          <Button variant="outline" size="lg" className="gap-2 rounded-xl" asChild>
            <Link to="/">
              View all tools <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </SiteLayout>
  );
}
