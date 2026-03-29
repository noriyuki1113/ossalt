import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AdminTextField, AdminTextareaField, AdminSwitchField } from "@/components/admin/AdminFormFields";
import { LoadingState } from "@/components/StateDisplays";
import { toast } from "sonner";
import { ArrowLeft, Save, Search, X, GripVertical } from "lucide-react";

const defaults = {
  source_name: "", source_slug: "", description: "", source_description: "",
  japanese_source_name: "", japanese_source_description: "",
  category_hint: "", source_url: "", featured: false,
};

interface LinkedProduct {
  id: string;
  product_id: string;
  product_name: string;
  rank_order: number;
  reason_summary: string;
}

export default function AdminAlternativeEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isNew = !id;

  const [form, setForm] = useState(defaults);
  const [linked, setLinked] = useState<LinkedProduct[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: existing, isLoading } = useQuery({
    queryKey: ["admin-alternative", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase.from("alternatives").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { data: linkedProducts } = useQuery({
    queryKey: ["admin-alternative-products", id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from("alternative_products")
        .select("id, product_id, rank_order, reason_summary")
        .eq("alternative_id", id)
        .order("rank_order");
      if (error) throw error;
      if (!data || data.length === 0) return [];
      const productIds = data.map((d) => d.product_id);
      const { data: products } = await supabase.from("products").select("id, name").in("id", productIds);
      const nameMap = new Map((products || []).map((p) => [p.id, p.name]));
      return data.map((d) => ({
        id: d.id,
        product_id: d.product_id,
        product_name: nameMap.get(d.product_id) || "Unknown",
        rank_order: d.rank_order || 0,
        reason_summary: d.reason_summary || "",
      }));
    },
    enabled: !!id,
  });

  const { data: allProducts } = useQuery({
    queryKey: ["admin-all-products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("id, name, slug").order("name");
      if (error) throw error;
      return data || [];
    },
  });

  useEffect(() => {
    if (existing) {
      setForm({
        source_name: existing.source_name || "",
        source_slug: existing.source_slug || "",
        description: existing.description || "",
        source_description: (existing as any).source_description || "",
        japanese_source_name: (existing as any).japanese_source_name || "",
        japanese_source_description: (existing as any).japanese_source_description || "",
        category_hint: (existing as any).category_hint || "",
        source_url: (existing as any).source_url || "",
        featured: existing.featured ?? false,
      });
    }
  }, [existing]);

  useEffect(() => {
    if (linkedProducts) setLinked(linkedProducts);
  }, [linkedProducts]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!form.source_name || !form.source_slug) throw new Error("サービス名とスラッグは必須です");
      let alternativeId = id;
      if (id) {
        const { error } = await supabase.from("alternatives").update(form).eq("id", id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("alternatives").insert(form).select("id").single();
        if (error) throw error;
        alternativeId = data.id;
      }
      // Save linked products
      if (alternativeId) {
        await supabase.from("alternative_products").delete().eq("alternative_id", alternativeId);
        if (linked.length > 0) {
          const rows = linked.map((l, i) => ({
            alternative_id: alternativeId!,
            product_id: l.product_id,
            rank_order: i + 1,
            reason_summary: l.reason_summary || null,
          }));
          const { error } = await supabase.from("alternative_products").insert(rows);
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-alternatives"] });
      toast.success("保存しました");
      navigate("/admin/alternatives");
    },
    onError: (e) => toast.error(e.message || "保存に失敗しました"),
  });

  const set = (key: string, value: any) => setForm((prev) => ({ ...prev, [key]: value }));

  const addProduct = (productId: string, productName: string) => {
    if (linked.some((l) => l.product_id === productId)) return;
    setLinked([...linked, { id: "", product_id: productId, product_name: productName, rank_order: linked.length + 1, reason_summary: "" }]);
    setSearchTerm("");
  };

  const removeProduct = (productId: string) => setLinked(linked.filter((l) => l.product_id !== productId));

  const moveProduct = (index: number, direction: -1 | 1) => {
    const next = [...linked];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setLinked(next);
  };

  const filteredProducts = (allProducts || []).filter(
    (p) => !linked.some((l) => l.product_id === p.id) && (p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.slug.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) return <LoadingState />;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/alternatives")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{isNew ? "代替ページ新規作成" : "代替ページ編集"}</h1>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">基本情報</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminTextField label="元サービス名" value={form.source_name} onChange={(v) => set("source_name", v)} required placeholder="Notion" />
              <AdminTextField label="スラッグ" value={form.source_slug} onChange={(v) => set("source_slug", v)} required placeholder="notion" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminTextField label="日本語サービス名" value={form.japanese_source_name} onChange={(v) => set("japanese_source_name", v)} />
              <AdminTextField label="カテゴリヒント" value={form.category_hint} onChange={(v) => set("category_hint", v)} placeholder="ノート, Wiki" />
            </div>
            <AdminTextareaField label="説明" value={form.description} onChange={(v) => set("description", v)} />
            <AdminTextareaField label="元サービスの説明" value={form.source_description} onChange={(v) => set("source_description", v)} />
            <AdminTextareaField label="日本語の説明" value={form.japanese_source_description} onChange={(v) => set("japanese_source_description", v)} />
            <AdminTextField label="元サービスURL" value={form.source_url} onChange={(v) => set("source_url", v)} placeholder="https://notion.so" />
            <AdminSwitchField label="注目" checked={form.featured} onChange={(v) => set("featured", v)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">紐付けプロダクト</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="プロダクトを検索して追加..."
                className="pl-9"
              />
              {searchTerm && filteredProducts.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-popover border rounded-md shadow-md max-h-48 overflow-auto">
                  {filteredProducts.slice(0, 10).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => addProduct(p.id, p.name)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors"
                    >
                      {p.name} <span className="text-muted-foreground">({p.slug})</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {linked.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">プロダクトが紐付けられていません</p>
            ) : (
              <div className="space-y-2">
                {linked.map((l, i) => (
                  <div key={l.product_id} className="flex items-center gap-2 p-3 border rounded-lg bg-card">
                    <div className="flex flex-col gap-0.5">
                      <button type="button" onClick={() => moveProduct(i, -1)} disabled={i === 0}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs">▲</button>
                      <button type="button" onClick={() => moveProduct(i, 1)} disabled={i === linked.length - 1}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-30 text-xs">▼</button>
                    </div>
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground w-6">{i + 1}.</span>
                    <span className="font-medium text-sm flex-1">{l.product_name}</span>
                    <Input
                      value={l.reason_summary}
                      onChange={(e) => {
                        const next = [...linked];
                        next[i] = { ...next[i], reason_summary: e.target.value };
                        setLinked(next);
                      }}
                      placeholder="おすすめ理由（任意）"
                      className="max-w-xs text-sm"
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeProduct(l.product_id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saveMutation.isPending}>
            <Save className="mr-2 h-4 w-4" />{saveMutation.isPending ? "保存中..." : "保存"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/alternatives")}>キャンセル</Button>
        </div>
      </form>
    </div>
  );
}
