import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ExternalLink, Github, Star, ArrowRight, Copy,
  Users, Zap, Shield, GitFork, Clock, Code2, Scale,
  CheckCircle2, XCircle, Twitter, ChevronRight,
  Server, HardDrive, Settings, MessageSquare, Box, Building2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { ToolIcon } from "@/components/ToolIcon";
import { AlternativeBadge } from "@/components/AlternativeBadge";
import { formatCount, getLanguageBadgeClass } from "@/lib/format";
import { useSeo } from "@/hooks/use-seo";
import type { Tool } from "@/hooks/use-tools";
import { COMPETITOR_TO_SLUG, COMPARE_LINKS } from "./AlternativesPage";
import { CATEGORY_TO_SLUG } from "./Index";
import { toast } from "sonner";
import { AdSlot } from "@/components/ads/AdSlot";
import { ConsultationCTA } from "@/components/ads/ConsultationCTA";
import { PartnerCTA } from "@/components/ads/PartnerCTA";
import { EditorialInsightCard } from "@/components/EditorialInsightCard";
import { RelatedGuideCard } from "@/components/RelatedGuideCard";
import { CommunityParticipationCTA } from "@/components/CommunityParticipationCTA";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { SaveToWorkspaceButton } from "@/components/workspace/SaveToWorkspaceButton";
import { AddToCompareButton } from "@/components/workspace/AddToCompareButton";
import { track } from "@/lib/track";
import { KeyFeaturesList } from "@/components/tool/KeyFeaturesList";
import { SimilarProjectsSection } from "@/components/tool/SimilarProjectsSection";
import { AffiliateCTA } from "@/components/ads/AffiliateCTA";
import { usePartnerCards } from "@/hooks/use-partner-cards";

/* ── helpers ── */

function getTargetUsers(tool: Tool, competitor: string | null): { text: string; icon: typeof Users }[] {
  const cat = (tool.parent_category_ja || "").toLowerCase();
  const results: { text: string; icon: typeof Users }[] = [];

  if (competitor && competitor !== "有料SaaS") {
    results.push({ text: `${competitor}のコストや制約に不満がある方`, icon: Zap });
  } else {
    results.push({ text: "有料SaaSのコストを削減したい方", icon: Zap });
  }

  if (cat.includes("ai")) {
    results.push({ text: "AIツールを自社サーバーで運用したい方", icon: Server });
    results.push({ text: "プライベートデータを外部に出したくない方", icon: Shield });
  } else if (cat.includes("開発")) {
    results.push({ text: "開発環境を自由にカスタマイズしたい方", icon: Settings });
    results.push({ text: "チーム開発の効率を上げたい方", icon: Users });
  } else if (cat.includes("インフラ")) {
    results.push({ text: "インフラを自社で管理・運用したい方", icon: HardDrive });
    results.push({ text: "特定ベンダーに依存したくない方", icon: Shield });
  } else if (cat.includes("ビジネス") || cat.includes("生産性")) {
    results.push({ text: "チームの生産性ツールを内製化したい方", icon: Users });
    results.push({ text: "ワークフローを自由にカスタマイズしたい方", icon: Settings });
  } else if (cat.includes("データ")) {
    results.push({ text: "データを自社で完全管理したい方", icon: HardDrive });
    results.push({ text: "ダッシュボードを自由に構築したい方", icon: Settings });
  } else if (cat.includes("セキュリティ")) {
    results.push({ text: "セキュリティを自社管理したい方", icon: Shield });
    results.push({ text: "コンプライアンス対応が必要な方", icon: CheckCircle2 });
  } else if (cat.includes("コミュニティ")) {
    results.push({ text: "社内コミュニケーション基盤を自前で持ちたい方", icon: MessageSquare });
    results.push({ text: "データの外部共有を最小限にしたい方", icon: Shield });
  } else {
    results.push({ text: "自分のサーバーでツールを運用したい方", icon: Server });
    results.push({ text: "ツールを自由にカスタマイズしたい方", icon: Settings });
  }

  return results.slice(0, 3);
}

function getNotGoodFor(tool: Tool): { text: string; icon: typeof XCircle }[] {
  const stars = tool.stars_num || 0;
  const results: { text: string; icon: typeof XCircle }[] = [];
  results.push({ text: "サーバー運用の知識がない方には導入ハードルが高い場合があります", icon: XCircle });
  if (stars < 5000) {
    results.push({ text: "コミュニティが小さく、日本語情報が少ない場合があります", icon: XCircle });
  }
  if (stars < 1000) {
    results.push({ text: "開発が停滞するリスクがあります。GitHubの更新頻度を確認してください", icon: XCircle });
  }
  return results.slice(0, 3);
}

function getBenefits(tool: Tool): { title: string; desc: string }[] {
  const cat = (tool.parent_category_ja || "").toLowerCase();
  const benefits: { title: string; desc: string }[] = [
    { title: "ライセンス費用ゼロ", desc: `${tool.license && tool.license !== "NOASSERTION" ? tool.license : "オープンソース"}ライセンスで、チーム規模が増えても追加費用なし` },
    { title: "データの完全管理", desc: "セルフホストにより顧客データを外部に預けず、自社で完全にコントロール" },
  ];

  if (cat.includes("ai")) {
    benefits.push({ title: "モデル選択の自由", desc: "好きなAIモデルを統合し、用途に合わせて最適化可能" });
  } else if (cat.includes("開発")) {
    benefits.push({ title: "豊富なAPI連携", desc: "CI/CDや既存ツールチェーンとスムーズに統合可能" });
  } else if (cat.includes("インフラ")) {
    benefits.push({ title: "マルチクラウド対応", desc: "AWS・GCP・Azure等、特定ベンダーにロックインされない" });
  } else if (cat.includes("データ")) {
    benefits.push({ title: "柔軟な可視化", desc: "ダッシュボードやレポートを自由にカスタマイズ可能" });
  } else {
    benefits.push({ title: "活発なコミュニティ", desc: `${(tool.forks_num || 0) > 1000 ? formatCount(tool.forks_num!) + "以上のフォークと" : ""}多くの開発者が継続的に改善中` });
  }

  benefits.push({ title: "透明性と安全性", desc: "ソースコードが公開されており、セキュリティ監査や独自の修正が可能" });

  return benefits;
}

function getComparisonRows(tool: Tool, competitor: string): [string, string, string, boolean][] {
  return [
    ["費用", "無料（セルフホスト）", "月額課金制", true],
    ["データ管理", "自社サーバーで完全管理", "ベンダー管理", true],
    ["カスタマイズ性", "ソースコード改変可能", "提供機能に限定", true],
    ["導入難易度", "サーバー構築が必要", "アカウント登録のみ", false],
    ["運用責任", "自社で保守・更新", "ベンダーが対応", false],
    ["セルフホスト", "対応", "非対応", true],
    ["ベンダーロックイン", "なし", "あり", true],
  ];
}

function getDifficultyInfo(tool: Tool) {
  const stars = tool.stars_num || 0;
  const hasForks = (tool.forks_num || 0) > 500;
  
  let setupLevel: "easy" | "medium" | "hard" = "medium";
  let setupLabel = "中程度";
  let setupDesc = "Docker等の基本的なインフラ知識があれば導入可能";
  
  let selfHostLevel: "easy" | "medium" | "hard" = "medium";
  let selfHostLabel = "中程度";
  let selfHostDesc = "サーバーの用意とDockerの基本操作が必要";

  if (stars > 50000 && hasForks) {
    setupLevel = "easy";
    setupLabel = "比較的かんたん";
    setupDesc = "公式ドキュメントが充実しており、Docker Composeで手軽に始められます";
    selfHostLevel = "easy";
    selfHostLabel = "比較的かんたん";
    selfHostDesc = "ワンクリックデプロイや公式Helmチャートが用意されている可能性が高い";
  } else if (stars > 10000) {
    setupDesc = "公式ドキュメントに沿って進めれば、30分〜1時間程度で導入可能";
    selfHostDesc = "Docker Composeでの運用が一般的。バックアップ設計は自前で必要";
  } else if (stars < 3000) {
    setupLevel = "hard";
    setupLabel = "やや高め";
    setupDesc = "ドキュメントや日本語情報が限られるため、技術力が求められます";
    selfHostLevel = "hard";
    selfHostLabel = "やや高め";
    selfHostDesc = "手動でのビルド・設定が必要な場合があり、運用経験が求められます";
  }

  return { setupLevel, setupLabel, setupDesc, selfHostLevel, selfHostLabel, selfHostDesc };
}

/* ── Main ── */

export default function ToolDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: tool, isLoading } = useQuery({
    queryKey: ["tool", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("tools").select("*").eq("id", Number(id)).single();
      if (error) throw error;
      return data as Tool;
    },
    enabled: !!id,
  });

  // Related tools: same competitor first, then same category
  const { data: relatedTools } = useQuery({
    queryKey: ["related-tools", tool?.primary_competitor, tool?.parent_category_ja, tool?.id],
    queryFn: async () => {
      const results: Tool[] = [];

      // Same competitor
      if (tool!.primary_competitor && tool!.primary_competitor !== "有料SaaS") {
        const { data } = await supabase
          .from("tools").select("*")
          .eq("primary_competitor", tool!.primary_competitor)
          .neq("id", tool!.id)
          .order("stars_num", { ascending: false, nullsFirst: false })
          .limit(6);
        if (data) results.push(...(data as Tool[]));
      }

      // Fill with same category if needed
      if (results.length < 6 && tool!.parent_category_ja) {
        const existingIds = new Set([tool!.id, ...results.map(t => t.id)]);
        const { data } = await supabase
          .from("tools").select("*")
          .eq("parent_category_ja", tool!.parent_category_ja!)
          .order("stars_num", { ascending: false, nullsFirst: false })
          .limit(10);
        if (data) {
          for (const t of data as Tool[]) {
            if (!existingIds.has(t.id) && results.length < 6) {
              results.push(t);
            }
          }
        }
      }

      return results;
    },
    enabled: !!tool,
  });

  const { data: partnerCards = [] } = usePartnerCards(tool?.id ?? 0, tool?.name ?? null);

  const competitorJa = tool?.primary_competitor_ja || null;
  const competitorEn = tool?.primary_competitor || "";
  // Use English name for short display; it's always a clean name like "Notion", "Zapier"
  const competitorDisplay = competitorEn || competitorJa || null;
  const hasCompetitor = competitorEn && competitorEn !== "有料SaaS";

  // Map Japanese parent category → schema.org applicationCategory
  const SCHEMA_CATEGORY: Record<string, string> = {
    "AI・ML": "DeveloperApplication",
    "開発ツール": "DeveloperApplication",
    "インフラ・運用": "DeveloperApplication",
    "データ・分析": "BusinessApplication",
    "業務ソフト": "BusinessApplication",
    "コンテンツ": "WebApplication",
    "生産性・便利ツール": "UtilitiesApplication",
    "セキュリティ": "SecurityApplication",
    "コミュニティ": "SocialNetworkingApplication",
  };

  const seoTitle = tool
    ? hasCompetitor
      ? `${tool.name}は${competitorDisplay}の代替？特徴と違いを解説`
      : `${tool.name} — OSSアルタナティブ`
    : "OSSアルタナティブ";
  const seoDescription = tool
    ? hasCompetitor
      ? `${tool.name}は${competitorDisplay}の代替OSSです。${tool.description_ja || ""}。無料・セルフホスト可能。`
      : tool.description_ja || tool.description_en || ""
    : "";

  const toolOgImage = "https://ossalt.jp/og-image.png";

  const jsonLd = tool ? {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: tool.name,
        description: tool.description_ja || tool.description_en || "",
        applicationCategory: SCHEMA_CATEGORY[tool.parent_category_ja || ""] ?? "SoftwareApplication",
        applicationSubCategory: tool.category_ja || tool.parent_category_ja || undefined,
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "JPY",
          availability: "https://schema.org/InStock",
        },
        isAccessibleForFree: true,
        operatingSystem: "Linux, Windows, macOS, Web",
        ...(tool.url ? { url: tool.url } : {}),
        ...(tool.github_url ? { codeRepository: tool.github_url, sameAs: tool.github_url } : {}),
        ...(tool.license && tool.license !== "NOASSERTION" ? { license: tool.license } : {}),
        ...(tool.last_commit ? { dateModified: tool.last_commit.split("T")[0] } : {}),
        ...(tool.language ? { programmingLanguage: tool.language } : {}),
        ...(tool.stars_num ? { aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: tool.stars_num >= 10000 ? "4.8" : tool.stars_num >= 1000 ? "4.5" : "4.0",
          ratingCount: tool.stars_num,
          bestRating: "5",
          worstRating: "1",
        }} : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: "https://ossalt.jp" },
          ...(tool.parent_category_ja && CATEGORY_TO_SLUG[tool.parent_category_ja] ? [{
            "@type": "ListItem",
            position: 2,
            name: tool.parent_category_ja,
            item: `https://ossalt.jp/category/${CATEGORY_TO_SLUG[tool.parent_category_ja]}`,
          }] : []),
          {
            "@type": "ListItem",
            position: tool.parent_category_ja && CATEGORY_TO_SLUG[tool.parent_category_ja] ? 3 : 2,
            name: tool.name || "",
            item: `https://ossalt.jp/tools/${tool.id}`,
          },
        ],
      },
    ],
  } : undefined;

  useSeo({
    title: seoTitle,
    description: seoDescription,
    canonical: tool ? `https://ossalt.jp/tools/${tool.id}` : undefined,
    ogImage: toolOgImage,
    jsonLd,
  });

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="container py-16 max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-4 w-48 bg-secondary rounded" />
            <div className="h-8 w-72 bg-secondary rounded" />
            <div className="h-5 w-full bg-secondary rounded" />
            <div className="h-5 w-3/4 bg-secondary rounded" />
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="h-32 bg-secondary rounded-xl" />
              <div className="h-32 bg-secondary rounded-xl" />
            </div>
          </div>
        </div>
      </SiteLayout>
    );
  }

  if (!tool) {
    return (
      <SiteLayout>
        <div className="container py-24 text-center">
          <p className="text-muted-foreground text-lg">ツールが見つかりませんでした</p>
          <Button variant="outline" className="mt-6 rounded-xl" asChild>
            <Link to="/">ツール一覧に戻る</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const shareUrl = `https://ossalt.jp/tools/${tool.id}`;
  const shareText = `${tool.name} — ${tool.description_ja || tool.description_en || ""}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const hatenaUrl = `https://b.hatena.ne.jp/add?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`;
  const altSlug = COMPETITOR_TO_SLUG[competitorEn];
  const targetUsers = getTargetUsers(tool, competitorDisplay);
  const notGoodFor = getNotGoodFor(tool);
  const benefits = getBenefits(tool);
  const comparisonRows = hasCompetitor ? getComparisonRows(tool, competitorDisplay!) : [];
  const difficulty = getDifficultyInfo(tool);
  const langClass = tool.language ? getLanguageBadgeClass(tool.language) : null;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("リンクをコピーしました");
  };

  const lastCommitText = tool.last_commit
    ? formatDistanceToNow(new Date(tool.last_commit), { addSuffix: true, locale: ja })
    : null;

  return (
    <SiteLayout>
      <div className="container max-w-4xl mx-auto px-4 md:px-8">

        {/* ── 2. Breadcrumb ── */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground pt-6 pb-6 overflow-x-auto">
          <Link to="/" className="hover:text-foreground transition-colors shrink-0">ホーム</Link>
          <ChevronRight className="h-3 w-3 shrink-0" />
          {tool.parent_category_ja && (
            <>
              <Link
                to={CATEGORY_TO_SLUG[tool.parent_category_ja] ? `/category/${CATEGORY_TO_SLUG[tool.parent_category_ja]}` : `/`}
                className="hover:text-foreground transition-colors shrink-0"
              >
                {tool.parent_category_ja}
              </Link>
              <ChevronRight className="h-3 w-3 shrink-0" />
            </>
          )}
          <span className="text-foreground font-medium truncate">{tool.name}</span>
        </nav>

        {/* ── 3. Hero ── */}
        <section className="pb-10 -mx-4 md:-mx-8 px-4 md:px-8 pt-4 rounded-2xl bg-gradient-to-b from-primary/[0.04] to-transparent">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-10">

            {/* Left: Identity */}
            <div className="flex-1 min-w-0">
              {/* Competitor context — always first */}
              {hasCompetitor && (
                <div className="mb-3">
                  <AlternativeBadge competitor={competitorDisplay!} />
                </div>
              )}

              {/* Tool name + icon */}
              <div className="flex items-center gap-3.5 mb-3">
                <ToolIcon url={tool.url} githubUrl={tool.github_url} name={tool.name} size={44} />
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground leading-tight">
                  {tool.name}
                </h1>
              </div>

              {/* One-line summary */}
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-5 max-w-xl">
                {tool.description_ja || tool.description_en || `${tool.name}は${tool.category_ja || tool.parent_category_ja || "多用途"}のオープンソースツールです。`}
              </p>

              {/* Metadata row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground mb-5">
                {tool.stars_num && (
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    <span className="font-semibold text-foreground tabular-nums">{formatCount(tool.stars_num)}</span>
                    <span>stars</span>
                  </span>
                )}
                {tool.forks_num && tool.forks_num > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <GitFork className="h-3.5 w-3.5" />
                    <span className="font-medium text-foreground tabular-nums">{formatCount(tool.forks_num)}</span>
                  </span>
                )}
                {lastCommitText && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{lastCommitText}</span>
                  </span>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                {tool.language && langClass && (
                  <Badge className={`text-[11px] font-normal border px-2.5 py-0.5 h-6 ${langClass}`}>
                    <Code2 className="h-3 w-3 mr-1" />
                    {tool.language}
                  </Badge>
                )}
                {tool.category_ja && (
                  <Badge variant="secondary" className="text-[11px] font-normal px-2.5 py-0.5 h-6">
                    {tool.category_ja}
                  </Badge>
                )}
                {tool.parent_category_ja && tool.parent_category_ja !== tool.category_ja && (
                  <Badge variant="secondary" className="text-[11px] font-normal px-2.5 py-0.5 h-6">
                    {tool.parent_category_ja}
                  </Badge>
                )}
                {tool.license && tool.license !== "NOASSERTION" && (
                  <Badge variant="outline" className="text-[11px] font-normal px-2.5 py-0.5 h-6">
                    <Scale className="h-3 w-3 mr-1" />
                    {tool.license}
                  </Badge>
                )}
              </div>
            </div>

            {/* Right: CTAs */}
            <div className="lg:w-[260px] shrink-0">
              <div className="card-unified p-5 space-y-3">
                {/* Primary external CTAs — most important first */}
                <div className="space-y-2">
                  {tool.url && (
                    <Button className="w-full gap-2 rounded-lg h-10 text-sm font-semibold" asChild>
                      <a href={tool.url} target="_blank" rel="noopener noreferrer"
                        onClick={() => track("external_link_click", { tool: tool.name, target: "official", url: tool.url })}
                      >
                        公式サイトへ <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                  {tool.github_url && (
                    <Button variant="outline" className="w-full gap-2 rounded-lg h-9 text-sm border-border" asChild>
                      <a href={tool.github_url} target="_blank" rel="noopener noreferrer"
                        onClick={() => track("external_link_click", { tool: tool.name, target: "github", url: tool.github_url })}
                      >
                        <Github className="h-4 w-4" /> GitHubを見る
                      </a>
                    </Button>
                  )}
                </div>

                {/* Workspace actions */}
                <div className="border-t border-border/60 pt-3 space-y-2">
                  <SaveToWorkspaceButton toolId={tool.id} toolName={tool.name || undefined} source="tool_detail" className="w-full justify-center" />
                  <AddToCompareButton toolId={tool.id} toolName={tool.name || undefined} source="tool_detail" className="w-full justify-center" />
                </div>

                {/* Alternative link */}
                {altSlug && (
                  <Link
                    to={`/alternatives/${altSlug}`}
                    className="flex items-center justify-center gap-1.5 text-xs font-medium text-primary hover:underline pt-1"
                  >
                    {competitorDisplay}の代替を比較 <ArrowRight className="h-3 w-3" />
                  </Link>
                )}

                {/* Share row */}
                <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                  <span className="text-[10px] text-muted-foreground mr-auto">共有</span>
                  <button
                    onClick={copyLink}
                    className="h-7 w-7 rounded-md border border-border/60 flex items-center justify-center hover:bg-secondary transition-colors"
                    title="リンクをコピー"
                  >
                    <Copy className="h-3 w-3 text-muted-foreground" />
                  </button>
                  <a
                    href={twitterUrl} target="_blank" rel="noopener noreferrer"
                    className="h-7 w-7 rounded-md border border-border/60 flex items-center justify-center hover:bg-secondary transition-colors"
                    title="Xでシェア"
                  >
                    <Twitter className="h-3 w-3 text-muted-foreground" />
                  </a>
                  <a
                    href={hatenaUrl} target="_blank" rel="noopener noreferrer"
                    className="h-7 w-7 rounded-md border border-border/60 flex items-center justify-center hover:bg-secondary transition-colors font-black text-[11px] text-muted-foreground"
                    title="はてなブックマークに追加"
                  >
                    B!
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Alternative-to summary ── */}
        {(() => {
          const replaces = (tool.replaces_ja && tool.replaces_ja.length > 0)
            ? tool.replaces_ja
            : (tool.replaces && tool.replaces.length > 0)
              ? tool.replaces
              : (hasCompetitor ? [competitorDisplay!] : []);
          if (!replaces.length) return null;
          return (
            <section className="py-6">
              <div className="card-unified p-4 sm:p-5">
                <h2 className="text-sm font-semibold text-foreground mb-2">
                  {tool.name} は何の代替として使えるOSS？
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-3">
                  {tool.name} は {replaces.join(" / ")} の代替として使えるオープンソースツールです。
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {replaces.map((r) => (
                    <AlternativeBadge key={r} competitor={r} size="sm" />
                  ))}
                </div>
              </div>
            </section>
          );
        })()}


        {tool.github_url && (tool.stars_num || tool.forks_num || tool.last_commit || tool.license) && (
          <section className="py-6">
            <div className="card-unified p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Github className="h-4 w-4" />
                  GitHub
                </h2>
                <a
                  href={tool.github_url} target="_blank" rel="noopener noreferrer"
                  onClick={() => track("external_link_click", { tool: tool.name, target: "github_stats", url: tool.github_url })}
                  className="text-xs text-primary hover:underline flex items-center gap-1 font-medium"
                >
                  リポジトリを見る <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {tool.stars_num != null && tool.stars_num > 0 && (
                  <div className="text-center p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20">
                    <p className="text-2xl font-black text-amber-500 tabular-nums">{formatCount(tool.stars_num)}</p>
                    <p className="text-[11px] text-muted-foreground mt-1 flex items-center justify-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> Stars
                    </p>
                  </div>
                )}
                {tool.forks_num != null && tool.forks_num > 0 && (
                  <div className="text-center p-3 rounded-xl bg-secondary/60">
                    <p className="text-2xl font-black text-foreground tabular-nums">{formatCount(tool.forks_num)}</p>
                    <p className="text-[11px] text-muted-foreground mt-1 flex items-center justify-center gap-1">
                      <GitFork className="h-3 w-3" /> Forks
                    </p>
                  </div>
                )}
                {lastCommitText && (
                  <div className="text-center p-3 rounded-xl bg-secondary/60">
                    <p className="text-sm font-bold text-foreground leading-tight">{lastCommitText}</p>
                    <p className="text-[11px] text-muted-foreground mt-1 flex items-center justify-center gap-1">
                      <Clock className="h-3 w-3" /> 最終更新
                    </p>
                  </div>
                )}
                {tool.license && tool.license !== "NOASSERTION" && (
                  <div className="text-center p-3 rounded-xl bg-secondary/60">
                    <p className="text-sm font-bold text-foreground leading-tight">{tool.license}</p>
                    <p className="text-[11px] text-muted-foreground mt-1 flex items-center justify-center gap-1">
                      <Scale className="h-3 w-3" /> ライセンス
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        <div className="border-t border-border/60" />

        {/* ── 4. Quick Decision Summary ── */}
        <section className="py-8">
          <h2 className="text-lg font-bold text-foreground mb-4">導入判断サマリー</h2>
          <div className="card-unified p-4 sm:p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-[10px] text-muted-foreground mb-2">導入難易度</p>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  difficulty.setupLevel === "easy"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : difficulty.setupLevel === "medium"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}>
                  {difficulty.setupLabel}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground mb-2">セルフホスト</p>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  difficulty.selfHostLevel === "easy"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : difficulty.selfHostLevel === "medium"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}>
                  {difficulty.selfHostLabel}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground mb-2">対象ユーザー</p>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-secondary text-foreground border-border">
                  {(tool.stars_num || 0) > 20000 ? "技術者〜非技術者" : "技術者向け"}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground mb-2">チーム規模</p>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border bg-secondary text-foreground border-border">
                  {(tool.stars_num || 0) > 30000 ? "小〜大規模" : "小〜中規模"}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-border/40">
              <div>
                <p className="text-[11px] font-medium text-foreground mb-1">導入について</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{difficulty.setupDesc}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-foreground mb-1">セルフホストについて</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{difficulty.selfHostDesc}</p>
                {[415, 185, 217, 340].includes(tool.id) && (
                  <>
                    <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
                      このOSSはセルフホスト運用にも対応しています。自分のサーバーで使いたい場合は、セルフホスト環境の選び方も確認しておきましょう。
                    </p>
                    <Link to="/selfhost-vps" className="inline-flex items-center gap-1 mt-1.5 text-[11px] text-primary hover:underline">
                      セルフホスト環境を見る <ArrowRight className="h-3 w-3" />
                    </Link>
                    {tool.id === 415 && (
                      <Link to="/guides/n8n-selfhost-vps" className="inline-flex items-center gap-1 mt-1.5 ml-3 text-[11px] text-primary hover:underline">
                        n8nセルフホスト手順 <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                    {tool.id === 185 && (
                      <Link to="/guides/appflowy-selfhost-vps" className="inline-flex items-center gap-1 mt-1.5 ml-3 text-[11px] text-primary hover:underline">
                        AppFlowyセルフホスト手順 <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                    {tool.id === 217 && (
                      <Link to="/guides/baserow-selfhost-vps" className="inline-flex items-center gap-1 mt-1.5 ml-3 text-[11px] text-primary hover:underline">
                        Baserowセルフホスト手順 <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                    {tool.id === 340 && (
                      <Link to="/guides/plausible-selfhost-vps" className="inline-flex items-center gap-1 mt-1.5 ml-3 text-[11px] text-primary hover:underline">
                        Plausibleセルフホスト手順 <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="border-t border-border/60" />

        {/* ── 5. Who it's for + Not good for ── */}
        <section className="py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                こんな人におすすめ
              </h2>
              <div className="space-y-2.5">
                {targetUsers.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <p className="text-sm text-foreground leading-relaxed pt-1">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                <XCircle className="h-4 w-4 text-muted-foreground" />
                注意すべきケース
              </h2>
              <div className="space-y-2.5">
                {notGoodFor.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="h-7 w-7 rounded-md bg-muted flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed pt-1">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="border-t border-border/60" />

        {/* ── 6. Benefits ── */}
        <section className="py-8">
          <h2 className="text-lg font-bold text-foreground mb-4">主なメリット</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {benefits.map((b, i) => (
              <div key={i} className="card-unified p-4 border-l-2 border-l-primary/50">
                <div className="flex items-center gap-2 mb-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                  <p className="font-semibold text-sm text-foreground">{b.title}</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-[22px]">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-border/60" />

        {/* ── 6b. Key Features ── */}
        <KeyFeaturesList tool={tool} />

        {/* ── 6. Comparison table ── */}
        {hasCompetitor && (
          <>
            <div className="border-t border-border/60" />
            <section className="py-10">
              <h2 className="text-lg font-bold text-foreground mb-5">
                {tool.name} vs {competitorDisplay}
              </h2>
              <div className="card-unified overflow-hidden overflow-x-auto">
                <table className="w-full text-sm min-w-[400px]">
                  <thead>
                    <tr className="border-b border-border/60">
                      <th className="text-left p-3 md:p-4 font-medium text-muted-foreground text-xs w-[28%]">比較項目</th>
                      <th className="text-left p-3 md:p-4 font-medium text-primary text-xs bg-primary/[0.03]">
                        {tool.name}
                        <span className="text-[10px] text-muted-foreground font-normal ml-1">(OSS)</span>
                      </th>
                      <th className="text-left p-3 md:p-4 font-medium text-muted-foreground text-xs">
                        {competitorEn || competitorDisplay}
                        <span className="text-[10px] text-muted-foreground/50 font-normal ml-1">(SaaS)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map(([label, oss, saas, ossWins]) => (
                      <tr key={label} className="border-b border-border/30 last:border-0">
                        <td className="p-3 md:p-4 text-muted-foreground text-xs">{label}</td>
                        <td className={`p-3 md:p-4 text-xs font-medium bg-primary/[0.02] ${ossWins ? "text-foreground" : "text-muted-foreground"}`}>
                          {ossWins
                            ? <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />{oss}</span>
                            : oss}
                        </td>
                        <td className={`p-3 md:p-4 text-xs font-medium ${!ossWins ? "text-foreground" : "text-muted-foreground"}`}>
                          {saas}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {altSlug && (
                <Link
                  to={`/alternatives/${altSlug}`}
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline font-medium mt-4"
                >
                  {competitorEn}の代替をもっと見る
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </section>
          </>
        )}

        <div className="border-t border-border/60" />

        {/* ── 7. Deployment details (compact, no duplication) ── */}
        <section className="py-8">
          <h2 className="text-lg font-bold text-foreground mb-4">導入環境</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="card-unified p-4 flex flex-col items-center gap-2">
              <Box className="h-5 w-5 text-primary/70" />
              <p className="text-[10px] text-muted-foreground">Docker対応</p>
              <p className="text-xs font-semibold text-foreground text-center">
                {(tool.stars_num || 0) > 5000 ? "対応（推定）" : "要確認"}
              </p>
            </div>
            <div className="card-unified p-4 flex flex-col items-center gap-2">
              <Server className="h-5 w-5 text-primary/70" />
              <p className="text-[10px] text-muted-foreground">セルフホスト</p>
              <p className="text-xs font-semibold text-foreground">可能</p>
            </div>
            <div className="card-unified p-4 flex flex-col items-center gap-2">
              <Users className="h-5 w-5 text-primary/70" />
              <p className="text-[10px] text-muted-foreground">対象ユーザー</p>
              <p className="text-xs font-semibold text-foreground text-center">
                {(tool.stars_num || 0) > 20000 ? "技術者〜非技術者" : "技術者向け"}
              </p>
            </div>
            <div className="card-unified p-4 flex flex-col items-center gap-2">
              <Building2 className="h-5 w-5 text-primary/70" />
              <p className="text-[10px] text-muted-foreground">チーム規模</p>
              <p className="text-xs font-semibold text-foreground text-center">
                {(tool.stars_num || 0) > 30000 ? "小〜大規模" : "小〜中規模"}
              </p>
            </div>
          </div>
        </section>

        <div className="border-t border-border/60" />

        {/* ── 8. Overview / Description ── */}
        <section className="py-10">
          <h2 className="text-lg font-bold text-foreground mb-5">概要</h2>
          <div className="card-unified p-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {tool.description_ja || `${tool.name}は${tool.category_ja || tool.parent_category_ja || "多用途"}のオープンソースツールです。`}
            </p>
            {tool.description_en && tool.description_ja && (
              <p className="text-xs text-muted-foreground/50 leading-relaxed mt-3 italic">
                {tool.description_en}
              </p>
            )}

            {/* Technical meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-4 border-t border-border/60">
              {tool.language && (
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">言語</p>
                  <p className="text-sm font-medium flex items-center gap-1.5 text-foreground">
                    <Code2 className="h-3.5 w-3.5" />{tool.language}
                  </p>
                </div>
              )}
              {tool.license && tool.license !== "NOASSERTION" && (
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">ライセンス</p>
                  <p className="text-sm font-medium flex items-center gap-1.5 text-foreground">
                    <Scale className="h-3.5 w-3.5" />{tool.license}
                  </p>
                </div>
              )}
              {tool.forks_num != null && tool.forks_num > 0 && (
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">フォーク</p>
                  <p className="text-sm font-medium flex items-center gap-1.5 text-foreground">
                    <GitFork className="h-3.5 w-3.5" />{formatCount(tool.forks_num)}
                  </p>
                </div>
              )}
              {lastCommitText && (
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">最終更新</p>
                  <p className="text-sm font-medium flex items-center gap-1.5 text-foreground">
                    <Clock className="h-3.5 w-3.5" />{lastCommitText}
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── Affiliate CTA ── */}
        {partnerCards.length > 0 && (
          <>
            <div className="border-t border-border/60" />
            <div className="py-6">
              <AffiliateCTA toolName={tool.name || ""} cards={partnerCards} />
            </div>
          </>
        )}

        {/* ── Ad slot before related tools ── */}
        <div className="border-t border-border/60" />
        <div className="py-6">
          <AdSlot slotId="detail-before-related" format="horizontal" />
        </div>

        {/* ── 9. Similar projects ── */}
        {relatedTools && relatedTools.length > 0 && (
          <>
            <div className="border-t border-border/60" />
            <SimilarProjectsSection
              tools={relatedTools}
              currentTool={tool}
              competitorDisplay={competitorDisplay}
              hasCompetitor={!!hasCompetitor}
              altSlug={altSlug}
            />
          </>
        )}

        {/* ── 10. Links ── */}
        <div className="border-t border-border/60" />
        <section className="py-10">
          <h2 className="text-lg font-bold text-foreground mb-5">公式リンク</h2>
          <div className="flex flex-wrap gap-3">
            {tool.url && (
              <a
                href={tool.url} target="_blank" rel="noopener noreferrer"
                className="card-unified px-4 py-3 flex items-center gap-2 text-sm text-foreground hover:border-primary/30 transition-colors"
                onClick={() => track("external_link_click", { tool: tool.name, target: "official_bottom", url: tool.url })}
              >
                <ExternalLink className="h-4 w-4 text-primary" />
                公式サイト
              </a>
            )}
            {tool.github_url && (
              <a
                href={tool.github_url} target="_blank" rel="noopener noreferrer"
                className="card-unified px-4 py-3 flex items-center gap-2 text-sm text-foreground hover:border-primary/30 transition-colors"
                onClick={() => track("external_link_click", { tool: tool.name, target: "github_bottom", url: tool.github_url })}
              >
                <Github className="h-4 w-4" />
                GitHub リポジトリ
              </a>
            )}
            {tool.github_url && (
              <a
                href={`${tool.github_url}/issues`} target="_blank" rel="noopener noreferrer"
                className="card-unified px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground hover:border-primary/30 transition-colors"
              >
                <MessageSquare className="h-4 w-4" />
                Issues
              </a>
            )}
          </div>
        </section>

        {/* ── 11. Editorial Insight ── */}
        <div className="border-t border-border/60" />
        <section className="py-8">
          <EditorialInsightCard tool={tool} />
        </section>

        {/* ── 12. Related Guides ── */}
        {hasCompetitor && altSlug && (
          <section className="pb-8">
            <RelatedGuideCard
              guides={[
                {
                  title: `${competitorDisplay}代替を選ぶときのポイント`,
                  description: `${competitorDisplay}の代わりに使えるOSSを比較・選定するための観点を解説`,
                  href: competitorDisplay === "Notion" ? "/guides/notion-alternatives"
                    : competitorDisplay === "Slack" ? "/guides/slack-alternatives"
                    : `/alternatives/${altSlug}`,
                },
                {
                  title: "セルフホスト前提で見るべき観点",
                  description: "サーバー運用・バックアップ・セキュリティの基本を確認",
                  href: "/guides/self-hosting",
                },
                {
                  title: "OSS導入でコストを削減する方法",
                  description: "SaaSからOSSへの移行で期待できるコスト削減シミュレーション",
                  href: "/savings",
                },
              ]}
            />
          </section>
        )}

        {/* ── 13. Community Participation ── */}
        <div className="border-t border-border/60" />
        <section className="py-8">
          <CommunityParticipationCTA toolName={tool.name || undefined} context="detail" />
        </section>

        {/* ── 14. Newsletter ── */}
        <section className="pb-8">
          <NewsletterSignup />
        </section>

        {/* ── Partner CTA ── */}
        <div className="pb-4">
          <PartnerCTA toolName={tool.name || undefined} />
        </div>

        {/* ── Consultation CTA ── */}
        <div className="pb-4">
          <ConsultationCTA toolName={tool.name || undefined} />
        </div>

        {/* ── Share Bar ── */}
        <div className="border-t border-border/60" />
        <section className="py-6">
          <p className="text-xs text-muted-foreground text-center mb-3">このページをシェア</p>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={copyLink}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/60 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
            >
              <Copy className="h-3.5 w-3.5" /> リンクをコピー
            </button>
            <a
              href={twitterUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/60 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
            >
              <Twitter className="h-3.5 w-3.5" /> Xでシェア
            </a>
            <a
              href={hatenaUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border/60 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
            >
              <span className="font-black text-[13px] leading-none">B!</span> はてなブックマーク
            </a>
          </div>
        </section>

        {/* ── Compare page links ── */}
        {(() => {
          const altSlug = hasCompetitor && competitorEn ? COMPETITOR_TO_SLUG[competitorEn] : null;
          const compareItems = altSlug ? (COMPARE_LINKS[altSlug] ?? []) : [];
          const matchedCompare = compareItems.find(({ ossName }) =>
            (tool.name || "").toLowerCase().replace(/[^a-z0-9]/g, "") ===
            ossName.toLowerCase().replace(/[^a-z0-9]/g, "")
          );
          if (!matchedCompare) return null;
          return (
            <section className="mb-8 pt-6 border-t border-border/60">
              <Link
                to={`/compare/${matchedCompare.slug}`}
                className="card-unified p-4 flex items-center justify-between gap-3 hover:border-primary/40 transition-colors group"
              >
                <div>
                  <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {matchedCompare.ossName} vs {competitorEn} を徹底比較
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    コスト・機能・セルフホスト対応を項目別に比較
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </Link>
            </section>
          );
        })()}

        {/* ── Bottom CTAs ── */}
        <div className="pb-12 flex flex-col sm:flex-row items-center justify-center gap-3">
          {tool.parent_category_ja && (
            <Button className="w-full sm:w-auto gap-2 rounded-xl" asChild>
              <Link to={CATEGORY_TO_SLUG[tool.parent_category_ja] ? `/category/${CATEGORY_TO_SLUG[tool.parent_category_ja]}` : `/`}>
                {tool.parent_category_ja}のツールを見る <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
          <Button variant="outline" className="w-full sm:w-auto gap-2 rounded-xl border-border" asChild>
            <Link to="/">
              全てのツールを見る <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </SiteLayout>
  );
}
