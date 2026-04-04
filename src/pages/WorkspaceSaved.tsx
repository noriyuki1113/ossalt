import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Trash2, GitCompareArrows, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { SiteLayout } from "@/components/SiteLayout";
import { ToolIcon } from "@/components/ToolIcon";
import { StarCount } from "@/components/StarCount";
import { StatusBadge } from "@/components/workspace/StatusBadge";
import { useSavedTools, type ToolStatus, STATUS_LABELS } from "@/hooks/use-workspace";
import { supabase } from "@/integrations/supabase/client";
import { useSeo } from "@/hooks/use-seo";
import { toast } from "sonner";
import type { Tool } from "@/hooks/use-tools";

export default function WorkspaceSavedPage() {
  const { savedTools, removeTool, updateStatus } = useSavedTools();
  const [filter, setFilter] = useState<ToolStatus | "all">("all");
  const [search, setSearch] = useState("");

  useSeo({
    title: "保存済みツール | ワークスペース | OSSアルタナティブ",
    description: "保存したOSSツールの一覧",
  });

  // Fetch tool data for saved tool IDs
  const toolIds = savedTools.map((s) => s.tool_id);
  const { data: toolsData } = useQuery({
    queryKey: ["tools-by-ids", toolIds],
    queryFn: async () => {
      if (toolIds.length === 0) return [];
      const { data, error } = await supabase
        .from("tools")
        .select("id, name, url, description_ja, description_en, parent_category_ja, github_url, stars_num, language, license")
        .in("id", toolIds);
      if (error) throw error;
      return (data || []) as Tool[];
    },
    enabled: toolIds.length > 0,
  });

  const toolsMap = useMemo(() => {
    const m = new Map<number, Tool>();
    toolsData?.forEach((t) => m.set(t.id, t));
    return m;
  }, [toolsData]);

  const filtered = useMemo(() => {
    let items = savedTools;
    if (filter !== "all") {
      items = items.filter((s) => s.status === filter);
    }
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((s) => {
        const tool = toolsMap.get(s.tool_id);
        return tool?.name?.toLowerCase().includes(q) || tool?.description_ja?.toLowerCase().includes(q);
      });
    }
    return items;
  }, [savedTools, filter, search, toolsMap]);

  return (
    <SiteLayout>
      <div className="container max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6">
          <Link to="/workspace" className="hover:text-foreground transition-colors">ワークスペース</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">保存済みツール</span>
        </nav>

        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-foreground">保存済みツール</h1>
          <span className="text-sm text-muted-foreground">{savedTools.length}件</span>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="ツールを検索…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/40"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${filter === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
            >
              すべて
            </button>
            {(Object.entries(STATUS_LABELS) as [ToolStatus, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-2.5 py-1 text-xs rounded-lg transition-colors ${filter === key ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tool list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm text-muted-foreground">
              {savedTools.length === 0 ? "まだツールが保存されていません" : "条件に一致するツールがありません"}
            </p>
            {savedTools.length === 0 && (
              <Button variant="outline" size="sm" asChild className="mt-4 gap-2 rounded-xl">
                <Link to="/">ツールを探す</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((saved) => {
              const tool = toolsMap.get(saved.tool_id);
              return (
                <div key={saved.id} className="card-unified p-4 flex items-start gap-3">
                  <Link to={`/tools/${saved.tool_id}`} className="shrink-0 mt-0.5">
                    <ToolIcon url={tool?.url} githubUrl={tool?.github_url} name={tool?.name} size={28} />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link to={`/tools/${saved.tool_id}`} className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate">
                        {tool?.name || `Tool #${saved.tool_id}`}
                      </Link>
                      <StatusBadge status={saved.status as ToolStatus} />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                      {tool?.description_ja || tool?.description_en || ""}
                    </p>
                    <div className="flex items-center gap-3">
                      <StarCount count={tool?.stars_num} size="sm" />
                      {tool?.parent_category_ja && (
                        <span className="text-[10px] text-muted-foreground">{tool.parent_category_ja}</span>
                      )}
                    </div>
                    {saved.personal_note && (
                      <p className="text-xs text-muted-foreground mt-2 bg-secondary/40 rounded px-2 py-1">
                        {saved.personal_note}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <select
                      value={saved.status}
                      onChange={(e) => updateStatus.mutate({ toolId: saved.tool_id, status: e.target.value as ToolStatus })}
                      className="text-[11px] bg-transparent border border-border/60 rounded px-1.5 py-1 focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer"
                    >
                      {(Object.entries(STATUS_LABELS) as [ToolStatus, string][]).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        removeTool.mutate(saved.tool_id);
                        toast("保存を解除しました");
                      }}
                      className="h-7 w-7 flex items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Back */}
        <div className="mt-8 pt-6 border-t border-border flex justify-center">
          <Button variant="outline" size="sm" asChild className="gap-2 rounded-xl">
            <Link to="/workspace">
              <ArrowLeft className="h-3.5 w-3.5" />
              ワークスペースに戻る
            </Link>
          </Button>
        </div>
      </div>
    </SiteLayout>
  );
}
