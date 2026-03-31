import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface SyncResult {
  message: string;
  total_parsed: number;
  new_inserted: number;
  skipped_existing: number;
  errors: number;
  timestamp: string;
}

export default function AdminPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runSync = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "sync-openalternative"
      );

      if (fnError) throw fnError;
      setResult(data as SyncResult);
    } catch (err: any) {
      setError(err.message || "同期に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">管理画面</h1>

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
                <div className="text-xs text-muted-foreground pt-1">
                  {result.timestamp}
                </div>
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
      </div>
    </SiteLayout>
  );
}
