import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Github, Star, Scale, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { ToolCard, ToolCardSkeleton } from "@/components/ToolCard";
import { useSeo } from "@/hooks/use-seo";
import type { Tool } from "@/hooks/use-tools";

function formatStars(num: number | null): string {
  if (!num) return "0";
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(num);
}

function getFaviconUrl(url: string | null, size = 64): string | null {
  if (!url) return null;
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
  } catch {
    return null;
  }
}

function ShareButton({ tool }: { tool: Tool }) {
  const text = `${tool.name} — ${tool.description_ja || tool.description_en || ""}`;
  const url = window.location.href;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;

  return (
    <Button variant="outline" size="sm" className="gap-1.5 rounded-lg" asChild>
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
        <Share2 className="h-3.5 w-3.5" />
        Xでシェア
      </a>
    </Button>
  );
}

export default function ToolDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: tool, isLoading } = useQuery({
    queryKey: ["tool", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .eq("id", Number(id))
        .single();
      if (error) throw error;
      return data as Tool;
    },
    enabled: !!id,
  });

  const { data: relatedTools } = useQuery({
    queryKey: ["related-tools", tool?.parent_category_ja, tool?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tools")
        .select("*")
        .eq("parent_category_ja", tool!.parent_category_ja!)
        .neq("id", tool!.id)
        .order("stars_num", { ascending: false, nullsFirst: false })
        .limit(6);
      if (error) throw error;
      return (data as Tool[]) || [];
    },
    enabled: !!tool?.parent_category_ja,
  });

  useSeo({
    title: tool ? `${tool.name} — OSSアルタナティブ` : "読み込み中…",
    description: tool?.description_ja || tool?.description_en || "",
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
            <div className="h-5 w-3/4 bg-muted rounded" />
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

  return (
    <SiteLayout>
      {/* Back nav */}
      <div className="container pt-8">
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground -ml-2" asChild>
          <Link to="/"><ArrowLeft className="h-4 w-4" />ツール一覧に戻る</Link>
        </Button>
      </div>

      {/* Hero */}
      <section className="container pt-6 pb-10 max-w-3xl mx-auto animate-fade-in">
        <div className="flex items-start gap-4 flex-wrap">
          {favicon && (
            <img src={favicon} alt="" width={48} height={48} className="rounded-lg shrink-0 mt-1" />
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">{tool.name}</h1>
              {tool.stars_num && tool.stars_num > 0 && (
                <Badge className="gap-1.5 text-sm px-3 py-1 shrink-0 bg-badge-amber/15 text-badge-amber border-badge-amber/30">
                  <Star className="h-4 w-4 fill-current" />
                  {formatStars(tool.stars_num)}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mt-5 space-y-3">
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            {tool.description_ja || "説明なし"}
          </p>
          {tool.description_en && tool.description_ja && (
            <p className="text-sm text-muted-foreground/70 leading-relaxed italic">
              {tool.description_en}
            </p>
          )}
        </div>

        {/* Badges */}
        <div className="mt-5 flex flex-wrap gap-2">
          {tool.parent_category_ja && (
            <Badge variant="secondary" className="text-sm">{tool.parent_category_ja}</Badge>
          )}
          {tool.category_ja && tool.category_ja !== tool.parent_category_ja && (
            <Badge variant="secondary" className="text-sm">{tool.category_ja}</Badge>
          )}
          {tool.license && (
            <Badge variant="outline" className="text-sm gap-1">
              <Scale className="h-3 w-3" />{tool.license}
            </Badge>
          )}
        </div>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-wrap gap-3">
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
          <ShareButton tool={tool} />
        </div>
      </section>

      {/* GitHub info card */}
      {tool.github_url && (
        <section className="container pb-10 max-w-3xl mx-auto">
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">GitHub 情報</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {tool.stars_num != null && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Star className="h-4 w-4 text-badge-amber" />
                  <span className="text-foreground font-medium">{formatStars(tool.stars_num)}</span>
                  <span className="text-sm">stars</span>
                </div>
              )}
              {tool.license && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Scale className="h-4 w-4" />
                  <span className="text-foreground font-medium">{tool.license}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Alternative services hint */}
      {tool.category_ja && (
        <section className="container pb-10 max-w-3xl mx-auto">
          <div className="rounded-xl border bg-card p-6">
            <h2 className="text-lg font-semibold mb-2">代替できるサービス</h2>
            <p className="text-sm text-muted-foreground">
              {tool.name} は「{tool.category_ja}」カテゴリのオープンソースツールです。
              同様の機能を持つ有料SaaSの代替として利用できます。
            </p>
          </div>
        </section>
      )}

      {/* Related tools */}
      {relatedTools && relatedTools.length > 0 && (
        <section className="container pb-16 max-w-5xl mx-auto">
          <h2 className="text-xl font-bold mb-6">関連ツール</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTools.map((t, i) => (
              <ToolCard key={t.id} tool={t} index={i} />
            ))}
          </div>
        </section>
      )}
    </SiteLayout>
  );
}
