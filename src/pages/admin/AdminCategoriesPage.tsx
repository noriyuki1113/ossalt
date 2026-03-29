import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingState } from "@/components/StateDisplays";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

const empty = { name: "", slug: "", description: "", icon: "", sort_order: 0 };

export default function AdminCategoriesPage() {
  const qc = useQueryClient();
  const [edit, setEdit] = useState<typeof empty & { id?: string }>(empty);
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const save = useMutation({
    mutationFn: async (item: typeof empty & { id?: string }) => {
      if (item.id) {
        const { id, ...rest } = item;
        const { error } = await supabase.from("categories").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert(item);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-categories"] }); toast.success("保存しました"); setOpen(false); },
    onError: () => toast.error("保存に失敗しました"),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("categories").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-categories"] }); toast.success("削除しました"); },
  });

  if (isLoading) return <LoadingState />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">カテゴリ管理</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={() => setEdit(empty)}><Plus className="mr-2 h-4 w-4" />新規</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{edit.id ? "編集" : "新規"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(edit); }} className="space-y-4">
              <div><Label>名前</Label><Input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} required /></div>
              <div><Label>スラッグ</Label><Input value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: e.target.value })} required /></div>
              <div><Label>説明</Label><Textarea value={edit.description || ""} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></div>
              <div><Label>アイコン</Label><Input value={edit.icon || ""} onChange={(e) => setEdit({ ...edit, icon: e.target.value })} /></div>
              <div><Label>並び順</Label><Input type="number" value={edit.sort_order} onChange={(e) => setEdit({ ...edit, sort_order: parseInt(e.target.value) || 0 })} /></div>
              <Button type="submit" className="w-full" disabled={save.isPending}>{save.isPending ? "保存中..." : "保存"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="surface-elevated rounded-lg overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>名前</TableHead><TableHead>スラッグ</TableHead><TableHead>並び順</TableHead><TableHead className="w-24">操作</TableHead></TableRow></TableHeader>
          <TableBody>
            {data?.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.name}</TableCell>
                <TableCell className="text-muted-foreground">{c.slug}</TableCell>
                <TableCell>{c.sort_order}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEdit(c as any); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { if (confirm("削除しますか？")) del.mutate(c.id); }}><Trash2 className="h-4 w-4" /></Button>
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
