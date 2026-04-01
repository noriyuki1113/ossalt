import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft, ExternalLink, Github, Star,
  ArrowRight, Copy, Users, Zap, Shield,
  GitFork, Clock, Code2, Server, Scale,
  CheckCircle2, XCircle, Twitter,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
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

function getGithubAvatarUrl(githubUrl: string | null): string | null {
  if (!githubUrl) return null;
  try {
    const parts = new URL(githubUrl).pathname.split("/").filter(Boolean);
    if (parts.length > 0) return `https://github.com/${parts[0]}.png?size=128`;
  } catch {}
  return null;
}

/** Generate "who this is for" based on category */
function getTargetUsers(tool: Tool, competitor: string | null): string[] {
  const cat = (tool.parent_category_ja || "").toLowerCase();
  const results: string[] = [];

  if (competitor && competitor !== "有料SaaS") {
    results.push(`${competitor}の代わりを探している人`);
  } else {
    results.push("有料SaaSのコストを削減したい人");
  }

  if (cat.includes("ai")) {
    results.push("AIツールを自社サーバーで運用したい人");
    results.push("プライベートデータを外部に出したくない人");
  } else if (cat.includes("開発")) {
    results.push("開発環境をカスタマイズしたいエンジニア");
    results.push("チーム開発の効率を上げたい人");
  } else if (cat.includes("インフラ")) {
    results.push("インフラを自分で管理したいエンジニア");
    results.push("マルチクラウド環境を構築したい人");
  } else if (cat.includes("ビジネス") || cat.includes("生産性")) {
    results.push("チームの生産性を上げたい人");
    results.push("ワークフローを自動化したい人");
  } else if (cat.includes("データ")) {
    results.push("データを自社で完全管理したい人");
    results.push("ダッシュボードを自由に作りたい人");
  } else if (cat.includes("セキュリティ")) {
    results.push("セキュリティを自社管理したい人");
    results.push("コンプライアンス対応が必要な人");
  } else {
    results.push("自分のサーバーで運用したい人");
    results.push("ツールを自由にカスタマイズしたい人");
  }

  return results.slice(0, 3);
}

/** Generate 3 simple benefits */
function getBenefits(tool: Tool): { title: string; desc: string }[] {
  const cat = (tool.parent_category_ja || "").toLowerCase();
  const benefits: { title: string; desc: string }[] = [
    { title: "完全無料", desc: `${tool.license || "オープンソース"}ライセンスで費用ゼロ` },
    { title: "データを自分で管理", desc: "セルフホストで外部にデータを預けない" },
  ];

  if (cat.includes("ai")) {
    benefits.push({ title: "AIモデルを自由に選択", desc: "好きなモデルを統合して利用可能" });
  } else if (cat.includes("開発")) {
    benefits.push({ title: "API連携が豊富", desc: "CI/CDや他ツールとスムーズに連携" });
  } else if (cat.includes("インフラ")) {
    benefits.push({ title: "マルチクラウド対応", desc: "特定ベンダーにロックインされない" });
  } else if (cat.includes("データ")) {
    benefits.push({ title: "柔軟な可視化", desc: "ダッシュボードを自由にカスタマイズ" });
  } else {
    benefits.push({ title: "コミュニティ活発", desc: "多くの開発者が継続的に改善中" });
  }

  return benefits;
}

/* Related card */
function RelatedCard({ tool }: { tool: Tool }) {
  const favicon = getFaviconUrl(tool.url, 32);
  const comp = tool.primary_competitor_ja || tool.primary_competitor;
  return (
    <Link
      to={`/tools/${tool.id}`}
      className="group flex flex-col rounded-xl border border-border/60 bg-card p-5 transition-all hover:-translate-y-0.5 card-glow"
    >
      <div className="flex items-center gap-3 mb-2 min-w-0">
        {favicon ? (
          <img src={favicon} alt="" width={24} height={24} className="rounded-md shrink-0" loading="lazy" />
        ) : (
          <span className="h-6 w-6 rounded-md bg-secondary text-muted-foreground text-xs font-bold flex items-center justify-center shrink-0 uppercase">
            {tool.name?.charAt(0) || "?"}
          </span>
        )}
        <h4 className="font-semibold text-sm truncate flex-1 min-w-0">{tool.name}</h4>
        {tool.stars_num != null && tool.stars_num > 0 && (
          <span className="flex items-center gap-0.5 text-[11px] text-badge-amber shrink-0">
            <Star className="h-3 w-3 fill-current" />
            {formatStars(tool.stars_num)}
          </span>
        )}
      </div>
      {comp && comp !== "有料SaaS" && (
        <span className="text-[11px] text-accent mb-2">{comp} の代替</span>
      )}
      <p className="text-xs text-muted-foreground line-clamp-2 break-words">
        {tool.description_ja || tool.description_en || ""}
      </p>
    </Link>
  );
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

  const { data: relatedTools } = useQuery({
    queryKey: ["related-tools", tool?.parent_category_ja, tool?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tools").select("*")
        .eq("parent_category_ja", tool!.parent_category_ja!)
        .neq("id", tool!.id)
        .order("stars_num", { ascending: false, nullsFirst: false })
        .limit(5);
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
  const jsonLd = tool ? {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description_ja || tool.description_en || "",
    applicationCategory: tool.category_ja || tool.parent_category_ja || "",
    offers: { "@type": "Offer", price: "0", priceCurrency: "JPY" },
    operatingSystem: "Web",
    ...(tool.url ? { url: tool.url } : {}),
  } : undefined;

  useSeo({
    title: seoTitle,
    description: seoDescription,
    canonical: tool ? `https://ossalt.jp/tools/${tool.id}` : undefined,
    ogImage: "https://ossalt.jp/og-image.png",
    jsonLd,
  });

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="container py-16">
          <div className="animate-pulse space-y-6 max-w-3xl mx-auto">
            <div className="h-6 w-40 bg-secondary rounded" />
            <div className="h-10 w-64 bg-secondary rounded" />
            <div className="h-5 w-full bg-secondary rounded" />
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
            <Link to="/"><ArrowLeft className="h-4 w-4 mr-2" />ツール一覧に戻る</Link>
          </Button>
        </div>
      </SiteLayout>
    );
  }

  const favicon = getFaviconUrl(tool.url, 64);
  const shareUrl = `https://ossalt.jp/tools/${tool.id}`;
  const shareText = `${tool.name} — ${tool.description_ja || tool.description_en || ""}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const competitorKey = tool.primary_competitor || "";
  const altSlug = COMPETITOR_TO_SLUG[competitorKey];
  const targetUsers = getTargetUsers(tool, competitor);
  const benefits = getBenefits(tool);

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("リンクをコピーしました");
  };

  const targetIcons = [Users, Zap, Shield];

  return (
    <SiteLayout>
      {/* Back */}
      <div className="container max-w-3xl mx-auto pt-6 px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          ツール一覧に戻る
        </Link>
      </div>

      <div className="container max-w-3xl mx-auto px-4 py-8 space-y-10 animate-fade-in">

        {/* ① Header */}
        <section>
          <div className="flex items-start gap-4 mb-4">
            {favicon ? (
              <img
                src={favicon} alt="" width={56} height={56}
                className="rounded-xl shrink-0 border border-border/60"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
              />
            ) : (
              <span className="h-14 w-14 rounded-xl bg-secondary text-muted-foreground text-xl font-bold flex items-center justify-center shrink-0 uppercase border border-border/60">
                {tool.name?.charAt(0) || "?"}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">{tool.name}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                {competitor && competitor !== "有料SaaS" && (
                  <span className="inline-flex items-center text-xs font-medium text-accent bg-accent/10 border border-accent/15 rounded-md px-2 py-0.5">
                    {competitor} の代替
                  </span>
                )}
                {tool.stars_num != null && tool.stars_num > 0 && (
                  <span className="flex items-center gap-1 text-xs text-badge-amber font-medium">
                    <Star className="h-3 w-3 fill-current" />
                    {formatStars(tool.stars_num)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {tool.url && (
              <Button size="lg" className="gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <a href={tool.url} target="_blank" rel="noopener noreferrer">
                  公式サイト <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            )}
            {tool.github_url && (
              <Button variant="outline" size="lg" className="gap-2 rounded-xl border-border/60" asChild>
                <a href={tool.github_url} target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" /> GitHub
                </a>
              </Button>
            )}
            <div className="flex items-center gap-1.5">
              <button
                onClick={copyLink}
                className="h-9 w-9 rounded-lg border border-border/60 flex items-center justify-center hover:bg-secondary transition-colors"
                title="リンクをコピー"
              >
                <Copy className="h-4 w-4 text-muted-foreground" />
              </button>
              <a
                href={twitterUrl} target="_blank" rel="noopener noreferrer"
                className="h-9 w-9 rounded-lg border border-border/60 flex items-center justify-center hover:bg-secondary transition-colors"
                title="Xでシェア"
              >
                <Twitter className="h-4 w-4 text-muted-foreground" />
              </a>
            </div>
          </div>
        </section>

        {/* ② One-line description */}
        <section className="rounded-xl border border-border/60 bg-card p-6">
          <p className="text-base md:text-lg text-foreground leading-relaxed">
            {tool.name} は、
            {competitor && competitor !== "有料SaaS"
              ? `${competitor}の代替となる、`
              : ""}
            {tool.category_ja || tool.parent_category_ja || "多用途"}のオープンソースツールです。
          </p>
        </section>

        {/* ③ Who it's for */}
        <section>
          <h2 className="text-lg font-bold mb-4">こんな人におすすめ</h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {targetUsers.map((text, i) => {
              const Icon = targetIcons[i] || Users;
              return (
                <div
                  key={i}
                  className="rounded-xl border border-border/60 bg-card p-5 flex flex-col items-start gap-3"
                >
                  <div className="h-9 w-9 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-accent" />
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{text}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ④ Benefits */}
        <section>
          <h2 className="text-lg font-bold mb-4">主なメリット</h2>
          <div className="space-y-3">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-4">
                <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-foreground">{b.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ⑤ Comparison table */}
        {competitor && competitor !== "有料SaaS" && (
          <section>
            <h2 className="text-lg font-bold mb-4">{tool.name} vs {competitor}</h2>
            <div className="rounded-xl border border-border/60 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-card">
                    <th className="text-left p-4 font-medium text-muted-foreground w-[30%]">項目</th>
                    <th className="text-left p-4 font-medium text-accent">{tool.name}</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">{tool.primary_competitor || competitor}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["料金", "無料〜", "有料"],
                    ["セルフホスト", "○", "×"],
                    ["日本語情報", "△", "△"],
                    ["導入難易度", "中", "低"],
                    ["拡張性", "高", "中"],
                  ].map(([label, oss, saas]) => (
                    <tr key={label} className="border-b border-border/30 last:border-0">
                      <td className="p-4 text-muted-foreground">{label}</td>
                      <td className="p-4 font-medium text-foreground">{oss}</td>
                      <td className="p-4 text-muted-foreground">{saas}</td>
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
                {competitorKey}の代替をもっと見る
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </section>
        )}

        {/* ⑥ Overview / Details */}
        <section className="rounded-xl border border-border/60 bg-card p-6 space-y-4">
          <h2 className="text-lg font-bold">概要</h2>
          <p className="text-muted-foreground leading-relaxed">
            {tool.description_ja || "説明なし"}
          </p>
          {tool.description_en && tool.description_ja && (
            <p className="text-sm text-muted-foreground/50 leading-relaxed italic">
              {tool.description_en}
            </p>
          )}

          {/* Meta info */}
          <div className="border-t border-border/40 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {tool.language && (
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">言語</p>
                <p className="text-sm font-medium flex items-center gap-1.5"><Code2 className="h-3.5 w-3.5" />{tool.language}</p>
              </div>
            )}
            {tool.license && tool.license !== "NOASSERTION" && (
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">ライセンス</p>
                <p className="text-sm font-medium flex items-center gap-1.5"><Scale className="h-3.5 w-3.5" />{tool.license}</p>
              </div>
            )}
            {tool.forks_num != null && tool.forks_num > 0 && (
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">フォーク</p>
                <p className="text-sm font-medium flex items-center gap-1.5"><GitFork className="h-3.5 w-3.5" />{formatStars(tool.forks_num)}</p>
              </div>
            )}
            {tool.last_commit && (
              <div>
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">最終更新</p>
                <p className="text-sm font-medium flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDistanceToNow(new Date(tool.last_commit), { addSuffix: true, locale: ja })}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ⑦ Related tools */}
        {relatedTools && relatedTools.length > 0 && (
          <section>
            <h2 className="text-lg font-bold mb-4">関連するOSSツール</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedTools.slice(0, 3).map((t) => <RelatedCard key={t.id} tool={t} />)}
            </div>
            {relatedTools.length > 3 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {relatedTools.slice(3, 5).map((t) => <RelatedCard key={t.id} tool={t} />)}
              </div>
            )}
          </section>
        )}

        <div className="pb-12 flex justify-center">
          <Button variant="outline" size="lg" className="gap-2 rounded-xl border-border/60" asChild>
            <Link to="/">
              全てのツールを見る <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </SiteLayout>
  );
}
