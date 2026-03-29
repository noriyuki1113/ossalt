import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Pencil, Trash2, Eye, Plus } from "lucide-react";

export default function AdminArticlesPage() {
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: articles, isLoading } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("articles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from("articles").delete().eq("id", deleteId);
    if (error) { toast.error("削除に失敗しました"); return; }
    toast.success("記事を削除しました");
    queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
    setDeleteId(null);
  };

  const toggleStatus = async (id: string, current: string) => {
    const next = current === "published" ? "draft" : "published";
    const updates: any = { status: next };
    if (next === "published") updates.published_at = new Date().toISOString();
    const { error } = await supabase.from("articles").update(updates).eq("id", id);
    if (error) { toast.error("更新に失敗しました"); return; }
    toast.success(next === "published" ? "公開しました" : "下書きに戻しました");
    queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">記事管理</h1>
        <div className="flex gap-2">
          <Link to="/admin/articles/generate"><Button variant="outline"><Plus className="mr-2 h-4 w-4" />記事生成</Button></Link>
          <Link to="/admin/articles/new"><Button><Plus className="mr-2 h-4 w-4" />新規作成</Button></Link>
        </div>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">読み込み中...</p>
      ) : !articles?.length ? (
        <p className="text-muted-foreground">記事がありません。「記事生成」から代替ページの記事を自動生成できます。</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                <th className="text-left p-3">タイトル</th>
                <th className="text-left p-3 w-24">ステータス</th>
                <th className="text-left p-3 w-28">更新日</th>
                <th className="p-3 w-32"></th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a: any) => (
                <tr key={a.id} className="border-t">
                  <td className="p-3">
                    <div className="font-medium line-clamp-1">{a.title}</div>
                    <div className="text-xs text-muted-foreground">/articles/{a.slug}</div>
                  </td>
                  <td className="p-3">
                    <Badge
                      variant={a.status === "published" ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => toggleStatus(a.id, a.status)}
                    >
                      {a.status === "published" ? "公開" : "下書き"}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">{new Date(a.updated_at).toLocaleDateString("ja-JP")}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      {a.status === "published" && (
                        <Link to={`/articles/${a.slug}`}><Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button></Link>
                      )}
                      <Link to={`/admin/articles/${a.id}`}><Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button></Link>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} onOpenChange={(o) => !o && setDeleteId(null)} onConfirm={handleDelete} title="記事を削除しますか？" description="この操作は取り消せません。" />
    </div>
  );
}
