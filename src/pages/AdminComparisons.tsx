import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { useSeo } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft, CheckCircle, XCircle, Loader2, RefreshCw, ExternalLink, Clock
} from "lucide-react";

type ComparisonStatus = "draft" | "review" | "approved" | "published" | "archived";

interface Comparison {
  id: string;
  slug: string;
  oss_name: string;
  saas_name: string;
  alternative_slug: string;
  status: ComparisonStatus;
  quality_score: number | null;
  reviewer_note: string | null;
  created_at: string;
  updated_at: string;
  content: Record<string, unknown> | null;
}

const STATUS_COLORS: Record<ComparisonStatus, string> = {
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  review: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  approved: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  published: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  archived: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
};

function StatusBadge({ status }: { status: ComparisonStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[status]}`}>
      {status}
    </span>
  );
}

function QualityScore({ score }: { score: number | null }) {
  if (score === null) return <span className="text-xs text-muted-foreground">—</span>;
  const pct = Math.round(score * 100);
  const color = pct >= 70 ? "text-green-600" : pct >= 50 ? "text-yellow-600" : "text-red-500";
  return <span className={`text-sm font-mono font-medium ${color}`}>{pct}%</span>;
}

export default function AdminComparisonsPage() {
  useSeo({ title: "Comparisons Pipeline — 管理画面", noindex: true });

  const qc = useQueryClient();
  const [filter, setFilter] = useState<ComparisonStatus | "all">("draft");
  const [selected, setSelected] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const { data: items = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-comparisons", filter],
    queryFn: async () => {
      let q = (supabase as any)
        .from("comparisons")
        .select("id, slug, oss_name, saas_name, alternative_slug, status, quality_score, reviewer_note, created_at, updated_at, content")
        .order("created_at", { ascending: false })
        .limit(50);

      if (filter !== "all") q = q.eq("status", filter);
      const { data } = await q;
      return (data ?? []) as Comparison[];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({
      id,
      status,
      reviewerNote,
    }: {
      id: string;
      status: ComparisonStatus;
      reviewerNote?: string;
    }) => {
      const update: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString(),
      };
      if (reviewerNote !== undefined) update.reviewer_note = reviewerNote;
      if (status === "published") update.published_at = new Date().toISOString();
      const { error } = await (supabase as any).from("comparisons").update(update).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-comparisons"] });
      setSelected(null);
      setNote("");
    },
  });

  const selectedItem = items.find((i) => i.id === selected);

  return (
    <SiteLayout>
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Link to="/admin" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl font-bold">Comparisons Pipeline</h1>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {(["all", "draft", "review", "approved", "published", "archived"] as const).map((s) => (
            <Button
              key={s}
              variant={filter === s ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(s)}
            >
              {s}
            </Button>
          ))}
        </div>

        {/* Item list */}
        <div className="space-y-2">
          {isLoading && (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
              読み込み中...
            </div>
          )}

          {!isLoading && items.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">アイテムがありません</div>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selected === item.id ? "border-primary bg-primary/5" : "hover:bg-secondary/30"
              }`}
              onClick={() => {
                setSelected(selected === item.id ? null : item.id);
                setNote(item.reviewer_note ?? "");
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium">
                      {item.oss_name} vs {item.saas_name}
                    </span>
                    <StatusBadge status={item.status} />
                    <QualityScore score={item.quality_score} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 font-mono">{item.slug}</div>
                  {item.reviewer_note && (
                    <p className="text-xs text-muted-foreground mt-1 italic">{item.reviewer_note}</p>
                  )}
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(item.updated_at).toLocaleDateString("ja-JP")}
                </div>
              </div>

              {selected === item.id && (
                <div className="mt-4 pt-4 border-t space-y-4">
                  {/* Content preview */}
                  {item.content && (
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1">Verdict</div>
                      <p className="text-sm">{(item.content as any).verdict}</p>
                    </div>
                  )}

                  {/* Reviewer note */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      レビューメモ
                    </label>
                    <textarea
                      className="w-full text-sm border rounded p-2 bg-background resize-none"
                      rows={2}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      placeholder="任意メモ..."
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap">
                    {item.status === "draft" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus.mutate({ id: item.id, status: "review", reviewerNote: note });
                        }}
                        disabled={updateStatus.isPending}
                      >
                        レビュー依頼
                      </Button>
                    )}
                    {(item.status === "draft" || item.status === "review") && (
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus.mutate({ id: item.id, status: "approved", reviewerNote: note });
                        }}
                        disabled={updateStatus.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        承認
                      </Button>
                    )}
                    {item.status === "approved" && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus.mutate({ id: item.id, status: "published", reviewerNote: note });
                        }}
                        disabled={updateStatus.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        公開
                      </Button>
                    )}
                    {item.status !== "archived" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus.mutate({ id: item.id, status: "archived", reviewerNote: note });
                        }}
                        disabled={updateStatus.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        アーカイブ
                      </Button>
                    )}
                    <a
                      href={`/compare/${item.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-blue-500 hover:underline ml-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      プレビュー
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
