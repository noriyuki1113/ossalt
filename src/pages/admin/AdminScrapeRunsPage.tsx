import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/StateDisplays";
import { Eye } from "lucide-react";
import { useState } from "react";

export default function AdminScrapeRunsPage() {
  const [detail, setDetail] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-scrape-runs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("scrape_runs").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <LoadingState />;

  const statusVariant = (s: string): "default" | "secondary" | "destructive" =>
    s === "success" ? "default" : s === "running" ? "secondary" : "destructive";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">取り込み実行ログ</h1>

      {(data || []).length === 0 ? (
        <Card><CardContent className="py-8 text-center text-muted-foreground">実行ログはありません</CardContent></Card>
      ) : (
        <div className="bg-card border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ソース</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead>開始</TableHead>
                <TableHead>終了</TableHead>
                <TableHead>結果</TableHead>
                <TableHead className="w-16">詳細</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data || []).map((r: any) => {
                const meta = r.meta as any;
                return (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.source}</TableCell>
                    <TableCell><Badge variant={statusVariant(r.status)}>{r.status}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.started_at ? new Date(r.started_at).toLocaleString("ja-JP") : "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{r.finished_at ? new Date(r.finished_at).toLocaleString("ja-JP") : "—"}</TableCell>
                    <TableCell className="text-sm">
                      {meta ? (
                        <span>
                          代替{meta.alternatives_upserted || 0} / プロダクト{meta.products_upserted || 0} / 紐付け{meta.links_upserted || 0}
                        </span>
                      ) : "—"}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => setDetail(r)}><Eye className="h-4 w-4" /></Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>実行ログ詳細</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-3 text-sm">
              <div><span className="font-medium text-muted-foreground">ソース:</span> {detail.source}</div>
              <div><span className="font-medium text-muted-foreground">ステータス:</span> <Badge variant={statusVariant(detail.status)}>{detail.status}</Badge></div>
              <div><span className="font-medium text-muted-foreground">開始:</span> {detail.started_at ? new Date(detail.started_at).toLocaleString("ja-JP") : "—"}</div>
              <div><span className="font-medium text-muted-foreground">終了:</span> {detail.finished_at ? new Date(detail.finished_at).toLocaleString("ja-JP") : "—"}</div>
              {detail.error_message && (
                <div className="bg-destructive/10 p-3 rounded-lg">
                  <span className="font-medium text-destructive">エラー:</span>
                  <p className="mt-1 text-destructive/80 whitespace-pre-wrap">{detail.error_message}</p>
                </div>
              )}
              {detail.meta && (
                <div>
                  <span className="font-medium text-muted-foreground">メタデータ:</span>
                  <pre className="mt-1 bg-muted rounded-lg p-3 text-xs overflow-auto max-h-48">{JSON.stringify(detail.meta, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
