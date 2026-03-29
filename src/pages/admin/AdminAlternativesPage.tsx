import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingState } from "@/components/StateDisplays";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

const empty = { source_name: "", source_slug: "", description: "", japanese_source_name: "", japanese_source_description: "", category_hint: "", source_url: "", featured: false };

export default function AdminAlternativesPage() {
  const qc = useQueryClient();
  const [edit, setEdit] = useState<typeof empty & { id?: string }>(empty);
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-alternatives"],
    queryFn: async () => {
      const { data, error } = await supabase.from("alternatives").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async (item: typeof empty & { id?: string }) => {
      const { id, ...rest } = item as any;
      if (id) {
        const { error } = await supabase.from("alternatives").update({ source_name: rest.source_name, source_slug: rest.source_slug, description: rest.description, featured: rest.featured }).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("alternatives").insert({ source_name: rest.source_name, source_slug: rest.source_slug, description: rest.description, featured: rest.featured });
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-alternatives"] }); toast.success("保存しました"); setOpen(false); },
    onError: () => toast.error("失敗しました"),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("alternatives").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-alternatives"] }); toast.success("削除しました"); },
  });

  if (isLoading) return <LoadingState />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">代替ページ管理</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={() => setEdit(empty)}><Plus className="mr-2 h-4 w-4" />新規</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{edit.id ? "編集" : "新規"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(edit); }} className="space-y-4">
              <div><Label>元サービス名</Label><Input value={edit.source_name} onChange={(e) => setEdit({ ...edit, source_name: e.target.value })} required /></div>
              <div><Label>スラッグ</Label><Input value={edit.source_slug} onChange={(e) => setEdit({ ...edit, source_slug: e.target.value })} required /></div>
              <div><Label>説明</Label><Textarea value={edit.description || ""} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></div>
              <div><Label>カテゴリヒント</Label><Input value={edit.category_hint || ""} onChange={(e) => setEdit({ ...edit, category_hint: e.target.value })} placeholder="例: チャット, CMS" /></div>
              <div><Label>元サービスURL</Label><Input value={edit.source_url || ""} onChange={(e) => setEdit({ ...edit, source_url: e.target.value })} /></div>
              <div className="flex items-center gap-2">
                <Switch checked={edit.featured || false} onCheckedChange={(v) => setEdit({ ...edit, featured: v })} />
                <Label>注目</Label>
              </div>
              <Button type="submit" className="w-full" disabled={save.isPending}>{save.isPending ? "保存中..." : "保存"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="surface-elevated rounded-lg overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>元サービス名</TableHead><TableHead>カテゴリ</TableHead><TableHead>注目</TableHead><TableHead className="w-24">操作</TableHead></TableRow></TableHeader>
          <TableBody>
            {data?.map((a: any) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.source_name}の代替</TableCell>
                <TableCell className="text-muted-foreground">{a.category_hint || "—"}</TableCell>
                <TableCell>{a.featured ? "⭐" : "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEdit({ source_name: a.source_name, source_slug: a.source_slug, description: a.description, japanese_source_name: a.japanese_source_name || "", japanese_source_description: a.japanese_source_description || "", category_hint: a.category_hint || "", source_url: a.source_url || "", featured: a.featured, id: a.id }); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { if (confirm("削除しますか？")) del.mutate(a.id); }}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
