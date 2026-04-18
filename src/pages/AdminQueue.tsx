import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { useSeo } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, CheckCircle, XCircle, Loader2, RefreshCw, AlertCircle, Clock } from "lucide-react";

type QueueStatus = "pending" | "processing" | "normalized" | "rejected" | "duplicate";

interface QueueItem {
  id: string;
  source_type: string;
  github_url: string | null;
  status: QueueStatus;
  priority: number;
  raw_data: Record<string, unknown>;
  rejection_reason: string | null;
  error_message: string | null;
  discovered_at: string;
  processed_at: string | null;
}

interface QueueStats {
  status: QueueStatus;
  count: number;
  oldest: string;
  newest: string;
}

const STATUS_COLORS: Record<QueueStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  normalized: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  duplicate: "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400",
};

function StatusBadge({ status }: { status: QueueStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[status]}`}>
      {status}
    </span>
  );
}

function QueueStatsCard({ stats }: { stats: QueueStats[] }) {
  const order: QueueStatus[] = ["pending", "processing", "normalized", "rejected", "duplicate"];
  const statsMap = Object.fromEntries(stats.map((s) => [s.status, s]));

  return (
    <Card>
      <CardHeader>
        <CardTitle>キュー統計</CardTitle>
        <CardDescription>ステータス別の件数</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {order.map((status) => {
            const s = statsMap[status];
            return (
              <div key={status} className="text-center p-3 rounded-lg bg-secondary/50">
                <div className="text-2xl font-bold">{s?.count ?? 0}</div>
                <div className="mt-1">
                  <StatusBadge status={status} />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminQueuePage() {
  useSeo({ title: "Ingestion Queue — 管理画面", noindex: true });

  const qc = useQueryClient();
  const [filter, setFilter] = useState<QueueStatus | "all">("pending");
  const [selected, setSelected] = useState<string | null>(null);

  const { data: stats = [] } = useQuery({
    queryKey: ["admin-queue-stats"],
    queryFn: async () => {
      const { data } = await (supabase as any).from("ingestion_queue_stats").select("*");
      return (data ?? []) as QueueStats[];
    },
    refetchInterval: 15000,
  });

  const { data: items = [], isLoading, refetch } = useQuery({
    queryKey: ["admin-queue", filter],
    queryFn: async () => {
      let q = (supabase as any)
        .from("ingestion_queue")
        .select("id, source_type, github_url, status, priority, raw_data, rejection_reason, error_message, discovered_at, processed_at")
        .order("priority", { ascending: true })
        .order("discovered_at", { ascending: true })
        .limit(50);

      if (filter !== "all") q = q.eq("status", filter);
      const { data } = await q;
      return (data ?? []) as QueueItem[];
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { error } = await (supabase as any)
        .from("ingestion_queue")
        .update({ status: "rejected", rejection_reason: reason, processed_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-queue"] });
      qc.invalidateQueries({ queryKey: ["admin-queue-stats"] });
      setSelected(null);
    },
  });

  const resetMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any)
        .from("ingestion_queue")
        .update({ status: "pending", error_message: null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-queue"] }),
  });

  const selectedItem = items.find((i) => i.id === selected);

  return (
    <SiteLayout>
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Link to="/admin" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-2xl font-bold">Ingestion Queue</h1>
          <Button variant="ghost" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        <QueueStatsCard stats={stats} />

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {(["all", "pending", "processing", "normalized", "rejected", "duplicate"] as const).map((s) => (
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
              onClick={() => setSelected(selected === item.id ? null : item.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium truncate">
                      {(item.raw_data?.name as string) ?? "unnamed"}
                    </span>
                    <StatusBadge status={item.status} />
                    <span className="text-xs text-muted-foreground">p:{item.priority}</span>
                    <span className="text-xs text-muted-foreground">{item.source_type}</span>
                  </div>
                  {item.github_url && (
                    <a
                      href={item.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline mt-0.5 block"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.github_url}
                    </a>
                  )}
                  {item.rejection_reason && (
                    <p className="text-xs text-red-500 mt-1">{item.rejection_reason}</p>
                  )}
                  {item.error_message && (
                    <p className="text-xs text-orange-500 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {item.error_message}
                    </p>
                  )}
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {new Date(item.discovered_at).toLocaleDateString("ja-JP")}
                </div>
              </div>

              {selected === item.id && (
                <div className="mt-4 pt-4 border-t space-y-3">
                  <pre className="text-xs bg-muted rounded p-3 overflow-auto max-h-48">
                    {JSON.stringify(item.raw_data, null, 2)}
                  </pre>
                  <div className="flex gap-2">
                    {item.status === "pending" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          rejectMutation.mutate({ id: item.id, reason: "手動却下" });
                        }}
                        disabled={rejectMutation.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        却下
                      </Button>
                    )}
                    {(item.status === "rejected" || item.error_message) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          resetMutation.mutate(item.id);
                        }}
                        disabled={resetMutation.isPending}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        再処理
                      </Button>
                    )}
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
