import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminTextField, AdminTextareaField, AdminSwitchField, AdminSelectField, AdminNumberField } from "@/components/admin/AdminFormFields";
import { LoadingState } from "@/components/StateDisplays";
import { ProductLogo } from "@/components/ProductLogo";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";

const defaults = {
  name: "", slug: "", short_description: "", description: "", japanese_name: "", japanese_description: "",
  website_url: "", github_url: "", logo_url: "", license: "", github_stars: 0, github_forks: 0,
  is_open_source: true, is_self_hostable: true, has_cloud: true, has_free_plan: true,
  supports_japanese: false, self_host_difficulty: "medium", best_for: "", not_good_for: "",
  source_origin: "", source_url: "", target_audience: "", pricing_summary: "",
  featured: false, status: "draft",
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

export default function AdminProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isNew = !id;

  const [form, setForm] = useState(defaults);
  const [slugManual, setSlugManual] = useState(false);

  const { data: existing, isLoading } = useQuery({
    queryKey: ["admin-product", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
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
        short_description: existing.short_description || "",
        description: existing.description || "",
        japanese_name: (existing as any).japanese_name || "",
        japanese_description: (existing as any).japanese_description || "",
        website_url: existing.website_url || "",
        github_url: existing.github_url || "",
        logo_url: existing.logo_url || "",
        license: (existing as any).license || "",
        github_stars: (existing as any).github_stars || 0,
        github_forks: (existing as any).github_forks || 0,
        is_open_source: existing.is_open_source ?? true,
        is_self_hostable: existing.is_self_hostable ?? true,
        has_cloud: existing.has_cloud ?? true,
        has_free_plan: existing.has_free_plan ?? true,
        supports_japanese: existing.supports_japanese ?? false,
        self_host_difficulty: (existing as any).self_host_difficulty || "medium",
        best_for: (existing as any).best_for || "",
        not_good_for: (existing as any).not_good_for || "",
        source_origin: (existing as any).source_origin || "",
        source_url: (existing as any).source_url || "",
        target_audience: existing.target_audience || "",
        pricing_summary: existing.pricing_summary || "",
        featured: existing.featured ?? false,
        status: existing.status || "draft",
      });
      setSlugManual(true);
    }
  }, [existing]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!form.name || !form.slug) throw new Error("名前とスラッグは必須です");
      const payload = { ...form };
      if (id) {
        const { error } = await supabase.from("products").update(payload).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-products"] });
      toast.success("保存しました");
      navigate("/admin/products");
    },
    onError: (e) => toast.error(e.message || "保存に失敗しました"),
  });

  const set = (key: string, value: any) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "name" && !slugManual) {
        next.slug = slugify(value);
      }
      return next;
    });
  };

  if (isLoading) return <LoadingState />;

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/admin/products")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{isNew ? "プロダクト新規作成" : "プロダクト編集"}</h1>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(); }} className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">基本情報</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminTextField label="名前" value={form.name} onChange={(v) => set("name", v)} required />
              <AdminTextField label="スラッグ" value={form.slug} onChange={(v) => { setSlugManual(true); set("slug", v); }} required placeholder="auto-generated" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminTextField label="日本語名" value={form.japanese_name} onChange={(v) => set("japanese_name", v)} />
              <AdminTextField label="ライセンス" value={form.license} onChange={(v) => set("license", v)} placeholder="AGPL-3.0" />
            </div>
            <AdminTextField label="短い説明" value={form.short_description} onChange={(v) => set("short_description", v)} />
            <AdminTextareaField label="詳細説明" value={form.description} onChange={(v) => set("description", v)} rows={4} />
            <AdminTextareaField label="日本語詳細説明" value={form.japanese_description} onChange={(v) => set("japanese_description", v)} rows={3} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">リンク & メタ</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminTextField label="公式サイトURL" value={form.website_url} onChange={(v) => set("website_url", v)} placeholder="https://..." />
              <AdminTextField label="GitHub URL" value={form.github_url} onChange={(v) => set("github_url", v)} placeholder="https://github.com/..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <AdminTextField label="ロゴURL" value={form.logo_url} onChange={(v) => set("logo_url", v)} placeholder="空の場合はfavicon/GitHubから自動取得" />
                <div className="mt-2 flex items-center gap-3">
                  <ProductLogo name={form.name || "P"} logoUrl={form.logo_url || undefined} websiteUrl={form.website_url || undefined} githubUrl={form.github_url || undefined} size="lg" />
                  <span className="text-xs text-muted-foreground">プレビュー</span>
                </div>
              </div>
              <AdminNumberField label="GitHub Stars" value={form.github_stars} onChange={(v) => set("github_stars", v)} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminTextField label="ソースオリジン" value={form.source_origin} onChange={(v) => set("source_origin", v)} placeholder="manual / scraped" />
              <AdminTextField label="ソースURL" value={form.source_url} onChange={(v) => set("source_url", v)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">ターゲット & 特徴</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <AdminTextField label="向いている人" value={form.best_for} onChange={(v) => set("best_for", v)} placeholder="例: Notionに近い操作感を求める個人・チーム" />
            <AdminTextField label="向いていない人" value={form.not_good_for} onChange={(v) => set("not_good_for", v)} placeholder="例: エンタープライズ向けの高度な権限管理が必要な場合" />
            <AdminTextField label="対象ユーザー" value={form.target_audience} onChange={(v) => set("target_audience", v)} />
            <AdminTextField label="料金概要" value={form.pricing_summary} onChange={(v) => set("pricing_summary", v)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">属性 & ステータス</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AdminSelectField label="セルフホスト難易度" value={form.self_host_difficulty} onChange={(v) => set("self_host_difficulty", v)}
                options={[{ value: "easy", label: "簡単" }, { value: "medium", label: "普通" }, { value: "hard", label: "難しい" }]} />
              <AdminSelectField label="ステータス" value={form.status} onChange={(v) => set("status", v)}
                options={[{ value: "draft", label: "下書き" }, { value: "published", label: "公開" }]} />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <AdminSwitchField label="OSS" checked={form.is_open_source} onChange={(v) => set("is_open_source", v)} />
              <AdminSwitchField label="セルフホスト可" checked={form.is_self_hostable} onChange={(v) => set("is_self_hostable", v)} />
              <AdminSwitchField label="クラウド版あり" checked={form.has_cloud} onChange={(v) => set("has_cloud", v)} />
              <AdminSwitchField label="無料プランあり" checked={form.has_free_plan} onChange={(v) => set("has_free_plan", v)} />
              <AdminSwitchField label="日本語対応" checked={form.supports_japanese} onChange={(v) => set("supports_japanese", v)} />
              <AdminSwitchField label="注目" checked={form.featured} onChange={(v) => set("featured", v)} />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={saveMutation.isPending}>
            <Save className="mr-2 h-4 w-4" />{saveMutation.isPending ? "保存中..." : "保存"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>キャンセル</Button>
        </div>
      </form>
    </div>
  );
}
