import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { LoadingState } from "@/components/StateDisplays";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminAlternativesPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-alternatives"],
    queryFn: async () => {
      const { data, error } = await supabase.from("alternatives").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("alternative_products").delete().eq("alternative_id", id);
      const { error } = await supabase.from("alternatives").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-alternatives"] }); toast.success("削除しました"); setDeleteTarget(null); },
  });

  if (isLoading) return <LoadingState />;

  const filtered = (data || []).filter((a) => a.source_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">代替ページ管理</h1>
        <Button onClick={() => navigate("/admin/alternatives/new")}><Plus className="mr-2 h-4 w-4" />新規作成</Button>
      </div>

      <div className="mb-4">
        <Input placeholder="検索..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>元サービス名</TableHead>
              <TableHead>カテゴリ</TableHead>
              <TableHead>注目</TableHead>
              <TableHead className="w-24">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">データがありません</TableCell></TableRow>
            ) : filtered.map((a: any) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.source_name}の代替</TableCell>
                <TableCell className="text-muted-foreground">{a.category_hint || "—"}</TableCell>
                <TableCell>{a.featured ? "⭐" : "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/alternatives/${a.id}`)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteTarget(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        title="代替ページを削除"
        description="この代替ページと紐付けプロダクトをすべて削除しますか？"
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget)}
      />
    </div>
  );
}
