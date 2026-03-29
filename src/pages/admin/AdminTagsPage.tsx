import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingState } from "@/components/StateDisplays";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminTagsPage() {
  const qc = useQueryClient();
  const [edit, setEdit] = useState({ name: "", slug: "", id: undefined as string | undefined });
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-tags"],
    queryFn: async () => { const { data, error } = await supabase.from("tags").select("*").order("name"); if (error) throw error; return data; },
  });

  const save = useMutation({
    mutationFn: async (item: { name: string; slug: string; id?: string }) => {
      if (item.id) {
        const { error } = await supabase.from("tags").update({ name: item.name, slug: item.slug }).eq("id", item.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("tags").insert({ name: item.name, slug: item.slug });
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-tags"] }); toast.success("保存しました"); setOpen(false); },
    onError: () => toast.error("失敗しました"),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("tags").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-tags"] }); toast.success("削除しました"); },
  });

  if (isLoading) return <LoadingState />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">タグ管理</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button onClick={() => setEdit({ name: "", slug: "", id: undefined })}><Plus className="mr-2 h-4 w-4" />新規</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{edit.id ? "編集" : "新規"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); save.mutate(edit); }} className="space-y-4">
              <div><Label>名前</Label><Input value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} required /></div>
              <div><Label>スラッグ</Label><Input value={edit.slug} onChange={(e) => setEdit({ ...edit, slug: e.target.value })} required /></div>
              <Button type="submit" className="w-full" disabled={save.isPending}>{save.isPending ? "保存中..." : "保存"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="surface-elevated rounded-lg overflow-hidden">
        <Table>
          <TableHeader><TableRow><TableHead>名前</TableHead><TableHead>スラッグ</TableHead><TableHead className="w-24">操作</TableHead></TableRow></TableHeader>
          <TableBody>
            {data?.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell className="text-muted-foreground">{t.slug}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEdit(t); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { if (confirm("削除しますか？")) del.mutate(t.id); }}><Trash2 className="h-4 w-4" /></Button>
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
