import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LoadingState } from "@/components/StateDisplays";
import { toast } from "sonner";
import { Check, X, Eye } from "lucide-react";

export default function AdminSubmissionsPage() {
  const qc = useQueryClient();
  const [detail, setDetail] = useState<any>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("submissions").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("submissions").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-submissions"] }); toast.success("更新しました"); },
  });

  if (isLoading) return <LoadingState />;

  const statusLabel = (s: string) => s === "pending" ? "未対応" : s === "approved" ? "承認" : "却下";
  const statusVariant = (s: string): "secondary" | "default" | "destructive" =>
    s === "pending" ? "secondary" : s === "approved" ? "default" : "destructive";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">掲載申請管理</h1>
      <div className="bg-card border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>サービス名</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>メール</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead>日時</TableHead>
              <TableHead className="w-32">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(data || []).length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">申請はありません</TableCell></TableRow>
            ) : (data || []).map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.product_name}</TableCell>
                <TableCell><a href={s.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm truncate max-w-[200px] inline-block">{s.website_url}</a></TableCell>
                <TableCell className="text-sm">{s.email}</TableCell>
                <TableCell><Badge variant={statusVariant(s.status)}>{statusLabel(s.status)}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{new Date(s.created_at).toLocaleDateString("ja-JP")}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setDetail(s)}><Eye className="h-4 w-4" /></Button>
                    {s.status === "pending" && (
                      <>
                        <Button variant="ghost" size="icon" onClick={() => updateStatus.mutate({ id: s.id, status: "approved" })}><Check className="h-4 w-4 text-green-600" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => updateStatus.mutate({ id: s.id, status: "rejected" })}><X className="h-4 w-4 text-destructive" /></Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!detail} onOpenChange={() => setDetail(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>申請詳細</DialogTitle></DialogHeader>
          {detail && (
            <div className="space-y-3 text-sm">
              <div><span className="font-medium text-muted-foreground">サービス名:</span> {detail.product_name}</div>
              <div><span className="font-medium text-muted-foreground">公式URL:</span> <a href={detail.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{detail.website_url}</a></div>
              <div><span className="font-medium text-muted-foreground">GitHub:</span> {(detail as any).github_url ? <a href={(detail as any).github_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{(detail as any).github_url}</a> : "—"}</div>
              <div><span className="font-medium text-muted-foreground">メール:</span> {detail.email}</div>
              <div><span className="font-medium text-muted-foreground">メッセージ:</span><p className="mt-1 whitespace-pre-wrap">{detail.message || "なし"}</p></div>
              <div><span className="font-medium text-muted-foreground">ステータス:</span> <Badge variant={statusVariant(detail.status)}>{statusLabel(detail.status)}</Badge></div>
              {detail.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button size="sm" onClick={() => { updateStatus.mutate({ id: detail.id, status: "approved" }); setDetail(null); }}>承認</Button>
                  <Button size="sm" variant="destructive" onClick={() => { updateStatus.mutate({ id: detail.id, status: "rejected" }); setDetail(null); }}>却下</Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
