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
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/StateDisplays";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

const emptyProduct: Record<string, any> = {
  name: "", slug: "", short_description: "", description: "", japanese_name: "", website_url: "", github_url: "",
  logo_url: "", license: "", github_stars: 0, is_open_source: true, is_self_hostable: true, has_cloud: true,
  supports_japanese: false, self_host_difficulty: "medium", best_for: "", not_good_for: "",
  source_origin: "", featured: false, status: "draft",
};

export default function AdminProductsPage() {
  const qc = useQueryClient();
  const [editProduct, setEditProduct] = useState<any>(emptyProduct);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: products, isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (product: any) => {
      const { id, created_at, updated_at, ...rest } = product;
      if (id) {
        const { error } = await supabase.from("products").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(rest);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-products"] }); toast.success("保存しました"); setDialogOpen(false); },
    onError: () => toast.error("保存に失敗しました"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("products").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-products"] }); toast.success("削除しました"); },
  });

  if (isLoading) return <LoadingState />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">プロダクト管理</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditProduct(emptyProduct)}><Plus className="mr-2 h-4 w-4" />新規作成</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editProduct.id ? "編集" : "新規作成"}</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(editProduct); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>名前</Label><Input value={editProduct.name} onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })} required /></div>
                <div><Label>スラッグ</Label><Input value={editProduct.slug} onChange={(e) => setEditProduct({ ...editProduct, slug: e.target.value })} required /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>日本語名</Label><Input value={editProduct.japanese_name || ""} onChange={(e) => setEditProduct({ ...editProduct, japanese_name: e.target.value })} /></div>
                <div><Label>ライセンス</Label><Input value={editProduct.license || ""} onChange={(e) => setEditProduct({ ...editProduct, license: e.target.value })} /></div>
              </div>
              <div><Label>短い説明</Label><Input value={editProduct.short_description || ""} onChange={(e) => setEditProduct({ ...editProduct, short_description: e.target.value })} /></div>
              <div><Label>詳細説明</Label><Textarea value={editProduct.description || ""} onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })} rows={3} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>公式サイトURL</Label><Input value={editProduct.website_url || ""} onChange={(e) => setEditProduct({ ...editProduct, website_url: e.target.value })} /></div>
                <div><Label>GitHub URL</Label><Input value={editProduct.github_url || ""} onChange={(e) => setEditProduct({ ...editProduct, github_url: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>ロゴURL</Label><Input value={editProduct.logo_url || ""} onChange={(e) => setEditProduct({ ...editProduct, logo_url: e.target.value })} /></div>
                <div><Label>GitHub Stars</Label><Input type="number" value={editProduct.github_stars || 0} onChange={(e) => setEditProduct({ ...editProduct, github_stars: parseInt(e.target.value) || 0 })} /></div>
              </div>
              <div><Label>向いている人</Label><Input value={editProduct.best_for || ""} onChange={(e) => setEditProduct({ ...editProduct, best_for: e.target.value })} /></div>
              <div><Label>向いていない人</Label><Input value={editProduct.not_good_for || ""} onChange={(e) => setEditProduct({ ...editProduct, not_good_for: e.target.value })} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>セルフホスト難易度</Label>
                  <select value={editProduct.self_host_difficulty || "medium"} onChange={(e) => setEditProduct({ ...editProduct, self_host_difficulty: e.target.value })} className="w-full border rounded px-2 py-1 text-sm bg-background">
                    <option value="easy">簡単</option>
                    <option value="medium">普通</option>
                    <option value="hard">難しい</option>
                  </select>
                </div>
                <div>
                  <Label>ステータス</Label>
                  <select value={editProduct.status} onChange={(e) => setEditProduct({ ...editProduct, status: e.target.value })} className="w-full border rounded px-2 py-1 text-sm bg-background">
                    <option value="draft">下書き</option>
                    <option value="published">公開</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { key: "is_open_source", label: "OSS" },
                  { key: "is_self_hostable", label: "セルフホスト" },
                  { key: "has_cloud", label: "クラウド版" },
                  { key: "supports_japanese", label: "日本語対応" },
                  { key: "featured", label: "注目" },
                ].map((f) => (
                  <div key={f.key} className="flex items-center gap-2">
                    <Switch checked={editProduct[f.key] || false} onCheckedChange={(v) => setEditProduct({ ...editProduct, [f.key]: v })} />
                    <Label>{f.label}</Label>
                  </div>
                ))}
              </div>
              <Button type="submit" disabled={saveMutation.isPending} className="w-full">{saveMutation.isPending ? "保存中..." : "保存"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="surface-elevated rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名前</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead>Stars</TableHead>
              <TableHead>日本語</TableHead>
              <TableHead className="w-24">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.name}</TableCell>
                <TableCell><Badge variant={p.status === "published" ? "default" : "secondary"}>{p.status === "published" ? "公開" : "下書き"}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{(p as any).github_stars || 0}</TableCell>
                <TableCell>{p.supports_japanese ? "✓" : "—"}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditProduct(p as any); setDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { if (confirm("削除しますか？")) deleteMutation.mutate(p.id); }}><Trash2 className="h-4 w-4" /></Button>
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
