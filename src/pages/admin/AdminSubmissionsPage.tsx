import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingState } from "@/components/StateDisplays";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

export default function AdminSubmissionsPage() {
  const qc = useQueryClient();

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
  const statusVariant = (s: string) => s === "pending" ? "secondary" as const : s === "approved" ? "default" as const : "destructive" as const;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">掲載申請管理</h1>
      <div className="surface-elevated rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>サービス名</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>メール</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead className="w-24">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.product_name}</TableCell>
                <TableCell><a href={s.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">{s.website_url}</a></TableCell>
                <TableCell className="text-sm">{s.email}</TableCell>
                <TableCell><Badge variant={statusVariant(s.status)}>{statusLabel(s.status)}</Badge></TableCell>
                <TableCell>
                  {s.status === "pending" && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => updateStatus.mutate({ id: s.id, status: "approved" })}><Check className="h-4 w-4 text-accent" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => updateStatus.mutate({ id: s.id, status: "rejected" })}><X className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
