import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { generateAlternativeArticle } from "@/lib/articles/generator";
import { Sparkles, Save, Eye } from "lucide-react";

export default function AdminArticleGeneratePage() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState<{
    title: string; slug: string; content: string; excerpt: string;
    meta_title: string; meta_description: string; source_type: string; source_id: string;
  } | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const { data: alternatives } = useQuery({
    queryKey: ["admin-alternatives-for-gen"],
    queryFn: async () => {
      const { data, error } = await supabase.from("alternatives").select("*").order("source_name");
      if (error) throw error;
      return data || [];
    },
  });

  // Check which already have articles
  const { data: existingArticles } = useQuery({
    queryKey: ["admin-existing-articles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("articles").select("source_id, slug").eq("source_type", "alternative");
      if (error) throw error;
      return data || [];
    },
  });

  const existingSourceIds = new Set(existingArticles?.map(a => a.source_id) || []);

  const handleGenerate = async (altId: string) => {
    setSelectedId(altId);
    setGenerating(true);
    setPreview(null);
    try {
      const result = await generateAlternativeArticle(altId);
      setPreview(result);
      setShowPreview(false);
    } catch (e: any) {
      toast.error(e.message || "生成に失敗しました");
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!preview) return;
    setSaving(true);
    try {
      const payload: any = {
        title: preview.title,
        slug: preview.slug,
        content: preview.content,
        excerpt: preview.excerpt,
        meta_title: preview.meta_title,
        meta_description: preview.meta_description,
        source_type: preview.source_type,
        source_id: preview.source_id,
        status,
      };
      if (status === "published") payload.published_at = new Date().toISOString();

      // Upsert by slug
      const { data: existing } = await supabase.from("articles").select("id").eq("slug", preview.slug).maybeSingle();
      if (existing) {
        const { error } = await supabase.from("articles").update(payload).eq("id", existing.id);
        if (error) throw error;
        toast.success("記事を更新しました");
      } else {
        const { error } = await supabase.from("articles").insert(payload);
        if (error) throw error;
        toast.success("記事を作成しました");
      }
      navigate("/admin/articles");
    } catch (e: any) {
      toast.error(e.message || "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">記事自動生成</h1>
      <p className="text-muted-foreground mb-6">代替ページのデータから記事を自動生成します。生成後にプレビューを確認し、保存してください。</p>

      {/* Alternatives list */}
      <div className="border rounded-lg overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead className="bg-secondary">
            <tr>
              <th className="text-left p-3">代替ページ</th>
              <th className="text-left p-3 w-24">状態</th>
              <th className="p-3 w-32"></th>
            </tr>
          </thead>
          <tbody>
            {alternatives?.map((alt: any) => {
              const hasArticle = existingSourceIds.has(alt.id);
              return (
                <tr key={alt.id} className="border-t">
                  <td className="p-3">
                    <span className="font-medium">{alt.source_name}の代替</span>
                    <span className="text-xs text-muted-foreground ml-2">({alt.source_slug})</span>
                  </td>
                  <td className="p-3">
                    {hasArticle ? (
                      <Badge variant="secondary">生成済</Badge>
                    ) : (
                      <Badge variant="outline">未生成</Badge>
                    )}
                  </td>
                  <td className="p-3">
                    <Button
                      size="sm"
                      variant={selectedId === alt.id && preview ? "secondary" : "default"}
                      onClick={() => handleGenerate(alt.id)}
                      disabled={generating && selectedId === alt.id}
                    >
                      <Sparkles className="mr-1 h-3.5 w-3.5" />
                      {generating && selectedId === alt.id ? "生成中..." : hasArticle ? "再生成" : "生成"}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Preview */}
      {preview && (
        <div className="border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">プレビュー</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)}>
                <Eye className="mr-1 h-3.5 w-3.5" />{showPreview ? "Markdownを表示" : "レンダリング"}
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleSave("draft")} disabled={saving}>
                <Save className="mr-1 h-3.5 w-3.5" />下書き保存
              </Button>
              <Button size="sm" onClick={() => handleSave("published")} disabled={saving}>
                <Save className="mr-1 h-3.5 w-3.5" />公開して保存
              </Button>
            </div>
          </div>

          <div className="mb-4 space-y-1 text-sm">
            <p><span className="text-muted-foreground">タイトル:</span> {preview.title}</p>
            <p><span className="text-muted-foreground">スラッグ:</span> /articles/{preview.slug}</p>
            <p><span className="text-muted-foreground">メタタイトル:</span> {preview.meta_title} <span className="text-xs text-muted-foreground">({preview.meta_title.length}文字)</span></p>
            <p><span className="text-muted-foreground">メタ説明:</span> {preview.meta_description} <span className="text-xs text-muted-foreground">({preview.meta_description.length}文字)</span></p>
          </div>

          <div className="border-t pt-4">
            {showPreview ? (
              <MarkdownRenderer content={preview.content} />
            ) : (
              <pre className="whitespace-pre-wrap text-sm font-mono bg-secondary rounded-lg p-4 max-h-[600px] overflow-auto">
                {preview.content}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
