import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function AdminArticleEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === "new";
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "", slug: "", content: "", excerpt: "",
    status: "draft", meta_title: "", meta_description: "",
    source_type: "", source_id: "",
  });

  const { data: existing } = useQuery({
    queryKey: ["admin-article", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("articles").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !isNew,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        title: existing.title || "",
        slug: existing.slug || "",
        content: existing.content || "",
        excerpt: existing.excerpt || "",
        status: existing.status || "draft",
        meta_title: existing.meta_title || "",
        meta_description: existing.meta_description || "",
        source_type: existing.source_type || "",
        source_id: existing.source_id || "",
      });
    }
  }, [existing]);

  const handleSave = async () => {
    if (!form.title || !form.slug) { toast.error("タイトルとスラッグは必須です"); return; }
    setSaving(true);
    try {
      const payload: any = {
        title: form.title,
        slug: form.slug,
        content: form.content,
        excerpt: form.excerpt,
        status: form.status,
        meta_title: form.meta_title || form.title,
        meta_description: form.meta_description || form.excerpt,
        source_type: form.source_type || null,
        source_id: form.source_id || null,
      };
      if (form.status === "published" && !existing?.published_at) {
        payload.published_at = new Date().toISOString();
      }

      if (isNew) {
        const { error } = await supabase.from("articles").insert(payload);
        if (error) throw error;
        toast.success("記事を作成しました");
      } else {
        const { error } = await supabase.from("articles").update(payload).eq("id", id!);
        if (error) throw error;
        toast.success("記事を更新しました");
      }
      navigate("/admin/articles");
    } catch (e: any) {
      toast.error(e.message || "保存に失敗しました");
    } finally {
      setSaving(false);
    }
  };

  const set = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">{isNew ? "記事作成" : "記事編集"}</h1>

      <div className="space-y-4">
        <div>
          <Label>タイトル *</Label>
          <Input value={form.title} onChange={e => set("title", e.target.value)} />
        </div>
        <div>
          <Label>スラッグ *</Label>
          <Input value={form.slug} onChange={e => set("slug", e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>ステータス</Label>
            <Select value={form.status} onValueChange={v => set("status", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">下書き</SelectItem>
                <SelectItem value="published">公開</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>ソースタイプ</Label>
            <Input value={form.source_type} onChange={e => set("source_type", e.target.value)} placeholder="alternative / product / manual" />
          </div>
        </div>
        <div>
          <Label>抜粋</Label>
          <Textarea value={form.excerpt} onChange={e => set("excerpt", e.target.value)} rows={2} />
        </div>
        <div>
          <Label>本文 (Markdown)</Label>
          <Textarea value={form.content} onChange={e => set("content", e.target.value)} rows={20} className="font-mono text-sm" />
        </div>
        <div>
          <Label>メタタイトル</Label>
          <Input value={form.meta_title} onChange={e => set("meta_title", e.target.value)} />
          <p className="text-xs text-muted-foreground mt-1">{form.meta_title.length}/60文字</p>
        </div>
        <div>
          <Label>メタディスクリプション</Label>
          <Textarea value={form.meta_description} onChange={e => set("meta_description", e.target.value)} rows={2} />
          <p className="text-xs text-muted-foreground mt-1">{form.meta_description.length}/160文字</p>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="mr-2 h-4 w-4" />{saving ? "保存中..." : "保存"}
        </Button>
        <Button variant="outline" onClick={() => navigate("/admin/articles")}>キャンセル</Button>
      </div>
    </div>
  );
}
