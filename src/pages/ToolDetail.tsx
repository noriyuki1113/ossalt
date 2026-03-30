import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft, ExternalLink, Github, Star, Scale, Share2,
  CheckCircle2, ThumbsUp, ThumbsDown, ArrowRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { ToolCard } from "@/components/ToolCard";
import { useSeo } from "@/hooks/use-seo";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import type { Tool } from "@/hooks/use-tools";
import { COMPETITOR_TO_SLUG } from "./AlternativesPage";

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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold flex items-center gap-3 mb-6">
      <span className="w-1 h-6 rounded-full bg-primary shrink-0" />
      {children}
    </h2>
  );
}

function Divider() {
  return <hr className="border-border my-10" />;
}

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
  const replacesJa = tool?.replaces_ja || [];

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

  const favicon = tool ? getFaviconUrl(tool.url, 64) : null;

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="container py-12">
          <div className="animate-pulse space-y-6 max-w-3xl mx-auto">
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

  const shareUrl = window.location.href;
  const shareText = `${tool.name} — ${tool.description_ja || tool.description_en || ""}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;

  const recommendedUsers = [
    { icon: "👨‍💻", label: "開発者・エンジニア" },
    { icon: "🏢", label: "スタートアップ・中小企業" },
    { icon: "💰", label: "コストを削減したい企業" },
    { icon: "🔒", label: "データをセルフホストしたい人" },
  ];

  const pros = [
    "無料で使える",
    "ソースコードが公開されている",
    "カスタマイズ可能",
    "ベンダーロックインなし",
  ];

  const cons = [
    "セルフホストの技術知識が必要",
    "サポートはコミュニティ依存",
    "エンタープライズ機能は限定的",
  ];

  const features = [
    { text: "オープンソース・無料" },
    { text: "セルフホスト可能" },
    { text: `ライセンス: ${tool.license || "不明"}` },
    { text: `GitHubスター: ${formatStars(tool.stars_num)}` },
    { text: `カテゴリ: ${tool.category_ja || tool.parent_category_ja || "未分類"}` },
  ];

  const comparisonTarget = competitor && competitor !== "有料SaaS" ? competitor : "有料SaaS";

  const comparisonRows = [
    { item: "費用", oss: "無料", saas: "月額$10〜" },
    { item: "ホスティング", oss: "セルフホスト", saas: "クラウド" },
    { item: "カスタマイズ", oss: "✅ 自由", saas: "❌ 制限あり" },
    { item: "サポート", oss: "コミュニティ", saas: "公式サポート" },
    { item: "データ管理", oss: "✅ 完全管理", saas: "❌ 預ける" },
  ];

  return (
    <SiteLayout>
      {/* Back nav */}
      <div className="container pt-8">
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2" asChild>
          <Link to="/"><ArrowLeft className="h-4 w-4" />ツール一覧に戻る</Link>
        </Button>
      </div>

      <div className="container max-w-4xl mx-auto animate-fade-in">
        {/* === 1. Header === */}
        <section className="pt-6 pb-2">
          <div className="flex items-start gap-4 flex-wrap">
            {favicon && <img src={favicon} alt="" width={48} height={48} className="rounded-lg shrink-0 mt-1" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{tool.name}</h1>
                {tool.stars_num != null && tool.stars_num > 0 && (
                  <Badge className="gap-1.5 text-sm px-3 py-1 shrink-0 bg-badge-amber/15 text-badge-amber border-badge-amber/30">
                    <Star className="h-4 w-4 fill-current" />{formatStars(tool.stars_num)}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">{tool.description_ja || "説明なし"}</p>
            {tool.description_en && tool.description_ja && (
              <p className="text-sm text-muted-foreground/60 leading-relaxed italic">{tool.description_en}</p>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {tool.parent_category_ja && <Badge variant="secondary">{tool.parent_category_ja}</Badge>}
            {tool.category_ja && tool.category_ja !== tool.parent_category_ja && (
              <Badge variant="secondary">{tool.category_ja}</Badge>
            )}
            {tool.license && (
              <Badge variant="outline" className="gap-1"><Scale className="h-3 w-3" />{tool.license}</Badge>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {tool.url && (
              <Button size="lg" className="gap-2 rounded-xl text-base" asChild>
                <a href={tool.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />サイトへ
                </a>
              </Button>
            )}
            {tool.github_url && (
              <Button variant="outline" size="lg" className="gap-2 rounded-xl text-base" asChild>
                <a href={tool.github_url} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />GitHubを見る
                </a>
              </Button>
            )}
            <Button variant="outline" size="sm" className="gap-1.5 rounded-lg" asChild>
              <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                <Share2 className="h-3.5 w-3.5" />Xでシェア
              </a>
            </Button>
          </div>
        </section>

        {/* === Alternative Section === */}
        {competitor && (
          <>
            <Divider />
            <section>
              <SectionTitle>このツールは {competitor} の代替です</SectionTitle>
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="text-base px-4 py-2 bg-primary/15 text-primary border-primary/30 font-semibold">
                  {competitor}
                </Badge>
                {replacesJa.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {replacesJa.map((r) => (
                      <Badge key={r} variant="secondary" className="text-xs">
                        {r}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        <Divider />

        {/* === 2. おすすめユーザー === */}
        <section>
          <SectionTitle>こんな人におすすめ</SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {recommendedUsers.map((u) => (
              <div key={u.label} className="rounded-xl border bg-card p-4 text-center space-y-2">
                <span className="text-2xl">{u.icon}</span>
                <p className="text-sm font-medium">{u.label}</p>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* === 3. 概要 === */}
        <section>
          <SectionTitle>概要</SectionTitle>
          <div className="rounded-xl border bg-card p-6 space-y-3">
            <p className="text-base md:text-lg leading-relaxed">
              {tool.name} は、{tool.category_ja || tool.parent_category_ja || "様々な用途"}のためのオープンソースツールです。
            </p>
            {tool.description_ja && (
              <p className="text-muted-foreground leading-relaxed">{tool.description_ja}</p>
            )}
          </div>
        </section>

        <Divider />

        {/* === 4. 主な特徴 === */}
        <section>
          <SectionTitle>主な特徴</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-3">
            {features.map((f) => (
              <div key={f.text} className="flex items-center gap-3 rounded-xl border bg-card p-4">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </section>

        <Divider />

        {/* === 5. メリット・デメリット === */}
        <section>
          <SectionTitle>メリット・デメリット</SectionTitle>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-emerald-500/20 bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <ThumbsUp className="h-5 w-5 text-emerald-400" />
                <h3 className="font-semibold text-emerald-400">メリット</h3>
              </div>
              <ul className="space-y-2">
                {pros.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-emerald-400 mt-0.5">✓</span>{p}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-red-500/20 bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <ThumbsDown className="h-5 w-5 text-red-400" />
                <h3 className="font-semibold text-red-400">デメリット</h3>
              </div>
              <ul className="space-y-2">
                {cons.map((c) => (
                  <li key={c} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="text-red-400 mt-0.5">✗</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <Divider />

        {/* === 6. 比較表 === */}
        <section>
          <SectionTitle>{tool.name} vs {comparisonTarget}</SectionTitle>
          <div className="rounded-xl border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="w-[30%]">項目</TableHead>
                  <TableHead>{tool.name}（OSS）</TableHead>
                  <TableHead>{comparisonTarget}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comparisonRows.map((r) => (
                  <TableRow key={r.item} className="border-border">
                    <TableCell className="font-medium">{r.item}</TableCell>
                    <TableCell>{r.oss}</TableCell>
                    <TableCell>{r.saas}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <Divider />

        {/* === CTA: もっと見る === */}
        {competitor && competitor !== "有料SaaS" && (() => {
          const competitorKey = tool.primary_competitor || "";
          const altSlug = COMPETITOR_TO_SLUG[competitorKey];
          const linkTo = altSlug ? `/alternatives/${altSlug}` : `/?search=${encodeURIComponent(competitor)}`;
          return (
            <section>
              <Button variant="outline" size="lg" className="w-full gap-2 rounded-xl text-base" asChild>
                <Link to={linkTo}>
                  {competitor} の代替をもっと見る <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </section>
          );
        })()}

        {competitor && competitor !== "有料SaaS" && <Divider />}

        {/* === 7. 関連ツール === */}
        {relatedTools && relatedTools.length > 0 && (
          <section>
            <SectionTitle>関連ツール</SectionTitle>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedTools.map((t, i) => (
                <ToolCard key={t.id} tool={t} index={i} />
              ))}
            </div>
          </section>
        )}

        {relatedTools && relatedTools.length > 0 && <Divider />}

        {/* === 8. CTA === */}
        <section className="pb-16">
          <div className="rounded-2xl bg-gradient-to-r from-primary/80 to-primary p-8 md:p-12 text-center space-y-5">
            <h2 className="text-2xl md:text-3xl font-extrabold text-primary-foreground">
              {tool.name} を今すぐ試す
            </h2>
            <p className="text-primary-foreground/80 max-w-lg mx-auto">
              オープンソースで無料。セルフホストで完全にコントロール。
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              {tool.url && (
                <Button size="lg" variant="secondary" className="gap-2 rounded-xl text-base font-semibold" asChild>
                  <a href={tool.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />サイトへ
                  </a>
                </Button>
              )}
              {tool.github_url && (
                <Button size="lg" variant="outline" className="gap-2 rounded-xl text-base font-semibold border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" asChild>
                  <a href={tool.github_url} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />GitHubを見る
                  </a>
                </Button>
              )}
            </div>
          </div>
        </section>

        {/* Bottom back button */}
        <div className="pb-16 flex justify-center">
          <Button variant="outline" size="lg" className="gap-2 rounded-xl" asChild>
            <Link to="/"><ArrowLeft className="h-4 w-4" />ツール一覧に戻る</Link>
          </Button>
        </div>
      </div>
    </SiteLayout>
  );
}
