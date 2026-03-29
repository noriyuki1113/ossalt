import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminTextField, AdminTextareaField, AdminNumberField } from "@/components/admin/AdminFormFields";
import { LoadingState } from "@/components/StateDisplays";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

const defaults = { name: "", slug: "", description: "", icon: "", japanese_name: "", japanese_description: "", sort_order: 0 };

export default function AdminCategoryEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isNew = !id;

  const [form, setForm] = useState(defaults);

  const { data: existing, isLoading } = useQuery({
    queryKey: ["admin-category", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase.from("categories").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.name || "",
        slug: existing.slug || "",
        description: existing.description || "",
        icon: existing.icon || "",
        japanese_name: (existing as any).japanese_name || "",
        japanese_description: (existing as any).japanese_description || "",
        sort_order: existing.sort_order || 0,
      });
    }
  }, [existing]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!form.name || !form.slug) throw new Error("名前とスラッグは必須です");
      if (id) {
        const { error } = await supabase.from("categories").update(form).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      toast.success("保存しました");
      navigate("/admin/categories");
    },
    onError: (e) => toast.error(e.message || "保存に失敗しました"),
  });

  const set = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  if (isLoading) return <LoadingState />;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/categories")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{isNew ? "カテゴリ新規作成" : "カテゴリ編集"}</h1>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-6">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminTextField label="名前" value={form.name} onChange={(v) => set("name", v)} required />
              <AdminTextField label="スラッグ" value={form.slug} onChange={(v) => set("slug", v)} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminTextField label="日本語名" value={form.japanese_name} onChange={(v) => set("japanese_name", v)} />
              <AdminTextField label="アイコン" value={form.icon} onChange={(v) => set("icon", v)} placeholder="lucide icon名" />
            </div>
            <AdminTextareaField label="説明" value={form.description} onChange={(v) => set("description", v)} />
            <AdminTextareaField label="日本語説明" value={form.japanese_description} onChange={(v) => set("japanese_description", v)} />
            <AdminNumberField label="並び順" value={form.sort_order} onChange={(v) => set("sort_order", v)} />
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saveMutation.isPending}>
            <Save className="mr-2 h-4 w-4" />{saveMutation.isPending ? "保存中..." : "保存"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/categories")}>キャンセル</Button>
        </div>
      </form>
    </div>
  );
}
