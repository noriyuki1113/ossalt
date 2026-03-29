import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Play, Loader2, CheckCircle2, XCircle, FileJson, Database, Eye } from "lucide-react";
import { SAMPLE_OPENALTERNATIVE_DATA } from "@/lib/importers/sample-data";
import type { ImportPayload } from "@/lib/importers/types";
import { useAuth } from "@/hooks/use-auth";

interface ImportResultData {
  success: boolean;
  dry_run?: boolean;
  scrape_run_id?: string;
  alternatives_upserted: number;
  products_upserted: number;
  links_upserted: number;
  skipped: number;
  errors: string[];
}

export default function AdminImportsPage() {
  const { session } = useAuth();
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<ImportResultData | null>(null);
  const [jsonInput, setJsonInput] = useState("");
  const [activeTab, setActiveTab] = useState("sample");

  const { data: lastRun } = useQuery({
    queryKey: ["admin-last-scrape-run"],
    queryFn: async () => {
      const { data } = await supabase.from("scrape_runs").select("*").order("created_at", { ascending: false }).limit(1);
      return data?.[0] || null;
    },
  });

  const executeImport = async (payload: ImportPayload, dryRun = false) => {
    setRunning(true);
    setResult(null);
    try {
      const finalPayload = { ...payload, dry_run: dryRun };
      const { data, error } = await supabase.functions.invoke("import-data", {
        body: finalPayload,
      });
      if (error) throw error;
      setResult(data as ImportResultData);
      if (data.success) {
        toast.success(dryRun ? "プレビュー完了" : `取り込み完了: ${data.alternatives_upserted}件の代替ページ, ${data.products_upserted}件のプロダクト`);
      }
    } catch (e: any) {
      toast.error(e.message || "取り込みに失敗しました");
      setResult({ success: false, alternatives_upserted: 0, products_upserted: 0, links_upserted: 0, skipped: 0, errors: [e.message] });
    } finally {
      setRunning(false);
    }
  };

  const handleSampleImport = (dryRun = false) => executeImport(SAMPLE_OPENALTERNATIVE_DATA, dryRun);

  const handleJsonImport = (dryRun = false) => {
    try {
      const parsed = JSON.parse(jsonInput) as ImportPayload;
      if (!parsed.source || !Array.isArray(parsed.alternatives)) {
        toast.error("JSONに source と alternatives が必要です");
        return;
      }
      executeImport(parsed, dryRun);
    } catch {
      toast.error("JSONの形式が正しくありません");
    }
  };

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">外部データ取り込み</h1>

      {lastRun && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">最終実行:</span>
              <Badge variant={(lastRun as any).status === "success" ? "default" : (lastRun as any).status === "running" ? "secondary" : "destructive"}>
                {(lastRun as any).status}
              </Badge>
              <span className="text-muted-foreground">{(lastRun as any).source}</span>
              <span className="text-muted-foreground">{new Date((lastRun as any).created_at).toLocaleString("ja-JP")}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="sample"><Database className="mr-2 h-4 w-4" />サンプルデータ</TabsTrigger>
          <TabsTrigger value="json"><FileJson className="mr-2 h-4 w-4" />JSON入力</TabsTrigger>
        </TabsList>

        <TabsContent value="sample">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">OpenAlternative サンプルデータ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                サンプルデータ（{SAMPLE_OPENALTERNATIVE_DATA.alternatives.length}件の代替ページ、
                {SAMPLE_OPENALTERNATIVE_DATA.alternatives.reduce((s, a) => s + a.products.length, 0)}件のプロダクト）を取り込みます。
                既存データは slug ベースでアップサートされます。
              </p>
              <details className="text-sm">
                <summary className="cursor-pointer text-primary hover:underline">含まれるデータを確認</summary>
                <div className="mt-2 space-y-2 pl-4 border-l-2 border-border">
                  {SAMPLE_OPENALTERNATIVE_DATA.alternatives.map((a) => (
                    <div key={a.source_slug}>
                      <span className="font-medium">{a.source_name}の代替</span>
                      <span className="text-muted-foreground ml-2">({a.products.length}件: {a.products.map((p) => p.name).join(", ")})</span>
                    </div>
                  ))}
                </div>
              </details>
              <div className="flex gap-3">
                <Button onClick={() => handleSampleImport(true)} disabled={running} variant="outline">
                  {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Eye className="mr-2 h-4 w-4" />}
                  プレビュー（Dry Run）
                </Button>
                <Button onClick={() => handleSampleImport(false)} disabled={running}>
                  {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                  取り込み実行
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="json">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">JSON手動取り込み</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                ImportPayload形式のJSONを貼り付けて取り込みを実行できます。
              </p>
              <Textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={12}
                placeholder='{"source": "manual-import", "alternatives": [...]}'
                className="font-mono text-xs"
              />
              <div className="flex gap-3">
                <Button onClick={() => handleJsonImport(true)} disabled={running || !jsonInput.trim()} variant="outline">
                  <Eye className="mr-2 h-4 w-4" />プレビュー
                </Button>
                <Button onClick={() => handleJsonImport(false)} disabled={running || !jsonInput.trim()}>
                  {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
                  取り込み実行
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              {result.success ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-destructive" />}
              {result.dry_run ? "プレビュー結果" : "実行結果"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{result.alternatives_upserted}</p>
                <p className="text-xs text-muted-foreground">代替ページ</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{result.products_upserted}</p>
                <p className="text-xs text-muted-foreground">プロダクト</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{result.links_upserted}</p>
                <p className="text-xs text-muted-foreground">紐付け</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-2xl font-bold">{result.skipped}</p>
                <p className="text-xs text-muted-foreground">スキップ</p>
              </div>
            </div>
            {result.errors.length > 0 && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <p className="text-sm font-medium text-destructive mb-1">エラー ({result.errors.length}件)</p>
                <ul className="text-xs text-destructive/80 space-y-1">
                  {result.errors.map((e, i) => <li key={i}>• {e}</li>)}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
