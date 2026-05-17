import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { useSeo } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, CheckCircle, AlertCircle, Loader2, Sparkles, BarChart3, Bot } from "lucide-react";

interface SyncResult {
  message: string;
  total_parsed: number;
  new_inserted: number;
  skipped_existing: number;
  errors: number;
  timestamp: string;
}

interface RefineResult {
  message: string;
  total: number;
  success: number;
  errors: number;
  updated_samples: string[];
  timestamp: string;
}

function AdminMetrics() {
  const { data: toolCount } = useQuery({
    queryKey: ["admin-tool-count"],
    queryFn: async () => {
      const { count } = await supabase.from("tools").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });
  const { data: subscriberCount } = useQuery({
    queryKey: ["admin-subscriber-count"],
    queryFn: async () => {
      const { count } = await supabase.from("newsletter_subscribers" as any).select("*", { count: "exact", head: true });
      return count || 0;
    },
  });
  const { data: listingCount } = useQuery({
    queryKey: ["admin-listing-count"],
    queryFn: async () => {
      const { count } = await supabase.from("listing_requests").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });
  const { data: leadCount } = useQuery({
    queryKey: ["admin-lead-count"],
    queryFn: async () => {
      const { count } = await supabase.from("monetization_leads").select("*", { count: "exact", head: true });
      return count || 0;
    },
  });

  const metrics = [
    { label: "掲載ツール数", value: toolCount ?? "—" },
    { label: "ニュースレター登録", value: subscriberCount ?? "—" },
    { label: "掲載申請", value: listingCount ?? "—" },
    { label: "収益化リード", value: leadCount ?? "—" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          サイト概要
        </CardTitle>
        <CardDescription>主要指標の現在値</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="text-center p-3 rounded-lg bg-secondary/50">
              <div className="text-2xl font-bold text-foreground">{m.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{m.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminPage() {
  useSeo({
    title: "管理画面",
    noindex: true,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [refineLoading, setRefineLoading] = useState(false);
  const [refineResult, setRefineResult] = useState<RefineResult | null>(null);
  const [refineError, setRefineError] = useState<string | null>(null);

  const runSync = async () => {
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("sync-openalternative");
      if (fnError) throw fnError;
      setResult(data as SyncResult);
    } catch (err: any) {
      setError(err.message || "同期に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  const runRefine = async () => {
    setRefineLoading(true);
    setRefineResult(null);
    setRefineError(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("refine-alternatives");
      if (fnError) throw fnError;
      setRefineResult(data as RefineResult);
    } catch (err: any) {
      setRefineError(err.message || "精査に失敗しました");
    } finally {
      setRefineLoading(false);
    }
  };

  return (
    <SiteLayout>
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        <h1 className="text-3xl font-bold mb-8">管理画面</h1>

        <AdminMetrics />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AIツールカード生成
            </CardTitle>
            <CardDescription>
              GitHub URLを入力するだけで、Claudeがossalt用のツールカード下書きを自動生成します。
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/admin/agent">エージェントを起動する →</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              OpenAlternative 同期
            </CardTitle>
            <CardDescription>
              openalternative.co のREADMEから新しいツールを取得して自動追加します。
              毎週月曜0時に自動実行されます。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={runSync} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  同期中...
                </>
              ) : (
                "今すぐ同期"
              )}
            </Button>

            {result && (
              <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                  <CheckCircle className="h-4 w-4" />
                  同期完了
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>取得ツール数</div>
                  <div className="font-mono font-medium">{result.total_parsed}</div>
                  <div>新規追加</div>
                  <div className="font-mono font-medium text-green-600">{result.new_inserted}</div>
                  <div>既存スキップ</div>
                  <div className="font-mono font-medium text-muted-foreground">{result.skipped_existing}</div>
                  <div>エラー</div>
                  <div className="font-mono font-medium text-red-500">{result.errors}</div>
                </div>
                <div className="text-xs text-muted-foreground pt-1">{result.timestamp}</div>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 p-4">
                <div className="flex items-center gap-2 text-red-600 font-medium">
                  <AlertCircle className="h-4 w-4" />
                  エラー
                </div>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              代替データ精査 (AI)
            </CardTitle>
            <CardDescription>
              AIを使って全ツールの代替元（primary_competitor, replaces）を自動精査・更新します。
              10件ずつバッチ処理で実行します。
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={runRefine} disabled={refineLoading} variant="secondary" className="w-full">
              {refineLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  精査中...（数分かかります）
                </>
              ) : (
                "今すぐ精査"
              )}
            </Button>

            {refineResult && (
              <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                  <CheckCircle className="h-4 w-4" />
                  精査完了
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>対象ツール数</div>
                  <div className="font-mono font-medium">{refineResult.total}</div>
                  <div>成功</div>
                  <div className="font-mono font-medium text-green-600">{refineResult.success}</div>
                  <div>エラー</div>
                  <div className="font-mono font-medium text-red-500">{refineResult.errors}</div>
                </div>
                {refineResult.updated_samples.length > 0 && (
                  <div className="pt-2 border-t">
                    <div className="text-xs font-medium text-muted-foreground mb-1">更新サンプル:</div>
                    {refineResult.updated_samples.map((s, i) => (
                      <div key={i} className="text-xs font-mono">{s}</div>
                    ))}
                  </div>
                )}
                <div className="text-xs text-muted-foreground pt-1">{refineResult.timestamp}</div>
              </div>
            )}

            {refineError && (
              <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 p-4">
                <div className="flex items-center gap-2 text-red-600 font-medium">
                  <AlertCircle className="h-4 w-4" />
                  エラー
                </div>
                <p className="text-sm text-red-600 mt-1">{refineError}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </SiteLayout>
  );
}
