import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SiteLayout } from "@/components/SiteLayout";
import { useSeo } from "@/hooks/use-seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CATEGORY_JA_TO_SLUG } from "@/lib/category-slugs";
import { supabase } from "@/integrations/supabase/client";
import {
  Bot, Loader2, CheckCircle, AlertCircle, Save,
  ExternalLink, Trash2, FileText, Send, RefreshCw,
} from "lucide-react";

// ── 型定義 ──────────────────────────────────────────────────────────────────

interface DraftData {
  id?: string;
  source_url: string;
  github_url: string;
  name: string;
  summary_ja: string;
  category: string;
  alternative_to: string[];
  use_cases: string[];
  pros: string[];
  cons: string[];
  vps_supported: boolean;
  docker_supported: boolean;
  difficulty: string;
  license_note: string;
  commercial_use_note: string;
  recommended_for: string[];
  not_recommended_for: string[];
  setup_notes: string;
  seo_title: string;
  seo_description: string;
  status?: string;
  created_at?: string;
}

// ── ユーティリティ（テスト用にエクスポート） ──────────────────────────────
export function arrToText(arr: string[] | null | undefined): string {
  return (arr || []).join("\n");
}

export function textToArr(text: string): string[] {
  return text.split("\n").map(s => s.trim()).filter(Boolean);
}

export function isGitHubUrl(url: string): boolean {
  try { return new URL(url).hostname.includes("github.com"); }
  catch { return false; }
}

// ── DraftFormの1フィールド ──────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </Label>
      {children}
    </div>
  );
}

// ── 下書き編集フォーム ────────────────────────────────────────────────────

interface DraftFormProps {
  draft: DraftData;
  onChange: (d: DraftData) => void;
  onSave: () => void;
  onPublish: () => void;
  saving: boolean;
  publishing: boolean;
}

function DraftForm({ draft, onChange, onSave, onPublish, saving, publishing }: DraftFormProps) {
  const set = (key: keyof DraftData, value: unknown) =>
    onChange({ ...draft, [key]: value });

  // Must exactly match parent_category_ja values in the DB — this is written
  // directly to tools.parent_category_ja on publish, with no conversion step.
  const CATEGORIES = Object.keys(CATEGORY_JA_TO_SLUG);
  const DIFFICULTIES = ["簡単", "中程度", "難しい"];

  return (
    <div className="space-y-5">
      {/* 基本情報 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="ツール名">
          <Input value={draft.name} onChange={e => set("name", e.target.value)} />
        </Field>
        <Field label="カテゴリ">
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={draft.category}
            onChange={e => set("category", e.target.value)}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </Field>
      </div>

      <Field label="日本語サマリー">
        <Textarea value={draft.summary_ja} onChange={e => set("summary_ja", e.target.value)} rows={2} />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="GitHubリポジトリ URL">
          <Input value={draft.github_url} onChange={e => set("github_url", e.target.value)} />
        </Field>
        <Field label="公式サイト URL">
          <Input value={draft.source_url} onChange={e => set("source_url", e.target.value)} />
        </Field>
      </div>

      {/* 代替・ユースケース */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="代替するSaaS（1行1件）">
          <Textarea
            value={arrToText(draft.alternative_to)}
            onChange={e => set("alternative_to", textToArr(e.target.value))}
            rows={3}
            placeholder={"Notion\nSlack"}
          />
        </Field>
        <Field label="ユースケース（1行1件）">
          <Textarea
            value={arrToText(draft.use_cases)}
            onChange={e => set("use_cases", textToArr(e.target.value))}
            rows={3}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="メリット（1行1件）">
          <Textarea
            value={arrToText(draft.pros)}
            onChange={e => set("pros", textToArr(e.target.value))}
            rows={3}
          />
        </Field>
        <Field label="デメリット（1行1件）">
          <Textarea
            value={arrToText(draft.cons)}
            onChange={e => set("cons", textToArr(e.target.value))}
            rows={3}
          />
        </Field>
      </div>

      {/* セルフホスト情報 */}
      <div className="grid grid-cols-3 gap-4">
        <Field label="VPS対応">
          <div className="flex items-center gap-2 h-9">
            <input
              type="checkbox"
              checked={draft.vps_supported}
              onChange={e => set("vps_supported", e.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-sm">{draft.vps_supported ? "対応" : "不明"}</span>
          </div>
        </Field>
        <Field label="Docker対応">
          <div className="flex items-center gap-2 h-9">
            <input
              type="checkbox"
              checked={draft.docker_supported}
              onChange={e => set("docker_supported", e.target.checked)}
              className="h-4 w-4"
            />
            <span className="text-sm">{draft.docker_supported ? "対応" : "不明"}</span>
          </div>
        </Field>
        <Field label="難易度">
          <select
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={draft.difficulty}
            onChange={e => set("difficulty", e.target.value)}
          >
            {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="ライセンスの要点">
          <Textarea value={draft.license_note} onChange={e => set("license_note", e.target.value)} rows={2} />
        </Field>
        <Field label="商用利用についての注意点">
          <Textarea value={draft.commercial_use_note} onChange={e => set("commercial_use_note", e.target.value)} rows={2} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="おすすめの人（1行1件）">
          <Textarea
            value={arrToText(draft.recommended_for)}
            onChange={e => set("recommended_for", textToArr(e.target.value))}
            rows={3}
          />
        </Field>
        <Field label="向かない人（1行1件）">
          <Textarea
            value={arrToText(draft.not_recommended_for)}
            onChange={e => set("not_recommended_for", textToArr(e.target.value))}
            rows={3}
          />
        </Field>
      </div>

      <Field label="セットアップの概要">
        <Textarea value={draft.setup_notes} onChange={e => set("setup_notes", e.target.value)} rows={3} />
      </Field>

      {/* SEO */}
      <div className="border-t pt-4 space-y-3">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">SEO</p>
        <Field label="SEOタイトル">
          <Input value={draft.seo_title} onChange={e => set("seo_title", e.target.value)} />
        </Field>
        <Field label="メタディスクリプション（120文字以内）">
          <Textarea value={draft.seo_description} onChange={e => set("seo_description", e.target.value)} rows={2} />
          <p className="text-[11px] text-muted-foreground">{draft.seo_description?.length ?? 0} / 120文字</p>
        </Field>
      </div>

      {/* アクション */}
      <div className="flex gap-3 pt-2">
        <Button onClick={onSave} disabled={saving} variant="secondary" className="flex-1">
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
          下書き保存
        </Button>
        <Button onClick={onPublish} disabled={publishing} className="flex-1">
          {publishing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
          toolsテーブルへ公開
        </Button>
      </div>
    </div>
  );
}

// ── 下書き一覧 ────────────────────────────────────────────────────────────

interface DraftListProps {
  onLoad: (draft: DraftData) => void;
}

function DraftList({ onLoad }: DraftListProps) {
  const qc = useQueryClient();
  const { data: drafts, isLoading } = useQuery({
    queryKey: ["agent-drafts"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("oss_tool_drafts")
        .select("id, name, category, status, source_url, github_url, created_at")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data as Array<{
        id: string; name: string; category: string; status: string;
        source_url: string; github_url: string; created_at: string;
      }>;
    },
    staleTime: 30_000,
  });

  const deleteDraft = async (id: string) => {
    if (!confirm("この下書きを削除しますか？")) return;
    await (supabase as any).from("oss_tool_drafts").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["agent-drafts"] });
  };

  const loadDraft = async (id: string) => {
    const { data } = await (supabase as any)
      .from("oss_tool_drafts")
      .select("*")
      .eq("id", id)
      .single();
    if (data) onLoad(data as DraftData);
  };

  if (isLoading) return <div className="text-sm text-muted-foreground py-4 text-center">読み込み中...</div>;
  if (!drafts?.length) return <div className="text-sm text-muted-foreground py-4 text-center">下書きはまだありません</div>;

  return (
    <div className="divide-y divide-border">
      {drafts.map(d => (
        <div key={d.id} className="flex items-center gap-3 py-3">
          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-medium text-sm truncate">{d.name || "（名前なし）"}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0 ${
                d.status === "published"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              }`}>
                {d.status === "published" ? "公開済" : "下書き"}
              </span>
            </div>
            <div className="text-xs text-muted-foreground truncate">{d.category} · {new Date(d.created_at).toLocaleDateString("ja-JP")}</div>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {d.github_url && (
              <a href={d.github_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded hover:bg-muted">
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
              </a>
            )}
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => loadDraft(d.id)}>
              編集
            </Button>
            <button onClick={() => deleteDraft(d.id)} className="p-1.5 rounded hover:bg-muted">
              <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── メインページ ────────────────────────────────────────────────────────

const EMPTY_DRAFT: DraftData = {
  source_url: "", github_url: "", name: "", summary_ja: "", category: "その他",
  alternative_to: [], use_cases: [], pros: [], cons: [],
  vps_supported: false, docker_supported: false, difficulty: "中程度",
  license_note: "", commercial_use_note: "", recommended_for: [],
  not_recommended_for: [], setup_notes: "", seo_title: "", seo_description: "",
};

export default function AdminAgentPage() {
  useSeo({ title: "AIエージェント | 管理画面", noindex: true });
  const qc = useQueryClient();

  const [url, setUrl] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftData | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const generate = async () => {
    if (!url.trim()) return;
    setGenerating(true);
    setGenError(null);
    setDraft(null);
    setSaveMsg(null);
    try {
      const { data, error } = await supabase.functions.invoke("generate-tool-draft", {
        body: { url: url.trim() },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setDraft(data.draft as DraftData);
      qc.invalidateQueries({ queryKey: ["agent-drafts"] });
    } catch (err: unknown) {
      setGenError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setGenerating(false);
    }
  };

  const saveDraft = async () => {
    if (!draft) return;
    setSaving(true);
    setSaveMsg(null);
    try {
      if (draft.id) {
        const { error } = await (supabase as any)
          .from("oss_tool_drafts")
          .update({ ...draft, updated_at: new Date().toISOString() })
          .eq("id", draft.id);
        if (error) throw error;
      } else {
        const { data, error } = await (supabase as any)
          .from("oss_tool_drafts")
          .insert({ ...draft, status: "draft" })
          .select()
          .single();
        if (error) throw error;
        setDraft(data as DraftData);
      }
      setSaveMsg({ ok: true, text: "下書きを保存しました" });
      qc.invalidateQueries({ queryKey: ["agent-drafts"] });
    } catch (err: unknown) {
      setSaveMsg({ ok: false, text: err instanceof Error ? err.message : "保存に失敗しました" });
    } finally {
      setSaving(false);
    }
  };

  const publishToTools = async () => {
    if (!draft) return;
    if (!confirm(`「${draft.name}」をtoolsテーブルに追加しますか？`)) return;
    setPublishing(true);
    setSaveMsg(null);
    try {
      // alternative_to[0] はLLM抽出の自由文字列なので、そのまま
      // primary_competitor に書き込まず competitors テーブルに照合する。
      // 一致すれば competitor_slug をセット（DBトリガーが表示用テキスト列を
      // 自動で埋める）。一致しなければ null のまま公開し、その旨を通知する
      // — 存在しない競合SaaS名でFKエラーになり公開自体が失敗するのを防ぐ。
      const rawCompetitor = draft.alternative_to?.[0]?.trim();
      let competitorSlug: string | null = null;
      let competitorNotFound = false;
      if (rawCompetitor) {
        const { data: match } = await (supabase as any)
          .from("competitors")
          .select("slug")
          .ilike("name_en", rawCompetitor)
          .maybeSingle();
        if (match?.slug) {
          competitorSlug = match.slug;
        } else {
          competitorNotFound = true;
        }
      }

      const { data: inserted, error: insertErr } = await (supabase as any)
        .from("tools")
        .insert({
          name: draft.name,
          description_ja: draft.summary_ja,
          url: draft.source_url,
          github_url: draft.github_url,
          category_slug: CATEGORY_JA_TO_SLUG[draft.category] ?? "other",
          docker_available: draft.docker_supported,
          competitor_slug: competitorSlug,
          self_hostable: draft.vps_supported || draft.docker_supported,
          verified_at: new Date().toISOString(),
          verification_source_url: draft.github_url || draft.source_url || null,
        })
        .select("id")
        .single();
      if (insertErr) throw insertErr;

      // 下書きのステータスを published に更新
      if (draft.id) {
        await (supabase as any)
          .from("oss_tool_drafts")
          .update({ status: "published" })
          .eq("id", draft.id);
      }
      setDraft(prev => prev ? { ...prev, status: "published" } : null);
      setSaveMsg({
        ok: true,
        text: competitorNotFound
          ? `toolsテーブルに追加しました（ID: ${inserted?.id}）。競合SaaS「${rawCompetitor}」はcompetitorsテーブルに未登録のため未設定です`
          : `toolsテーブルに追加しました（ID: ${inserted?.id}）`,
      });
      qc.invalidateQueries({ queryKey: ["agent-drafts"] });
    } catch (err: unknown) {
      setSaveMsg({ ok: false, text: err instanceof Error ? err.message : "公開に失敗しました" });
    } finally {
      setPublishing(false);
    }
  };

  return (
    <SiteLayout>
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Bot className="h-8 w-8 text-primary" />
          AIツールカード生成
        </h1>
        <p className="text-muted-foreground text-sm">
          GitHub URLを入力すると、READMEとリポジトリ情報をもとにossalt用のツールカード下書きをAIが自動生成します。
        </p>

        {/* URL入力 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bot className="h-4 w-4" />
              GitHubリポジトリURLを入力
            </CardTitle>
            <CardDescription>例: https://github.com/appflowy/appflowy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://github.com/owner/repo"
                onKeyDown={e => e.key === "Enter" && !generating && generate()}
                className="flex-1"
              />
              <Button onClick={generate} disabled={generating || !url.trim()} className="shrink-0">
                {generating ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />調査中...</>
                ) : (
                  <><Bot className="mr-2 h-4 w-4" />AIで調査する</>
                )}
              </Button>
            </div>

            {generating && (
              <div className="rounded-lg bg-muted/50 p-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>GitHubからREADMEとリポジトリ情報を取得中...</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Claudeでツールカードを生成中（10〜20秒ほどかかります）</span>
                </div>
              </div>
            )}

            {genError && (
              <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 p-3">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {genError}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 生成結果・編集フォーム */}
        {draft && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <CheckCircle className="h-4 w-4 text-emerald-500" />
                生成完了 — 内容を確認・編集してください
              </CardTitle>
              <CardDescription>
                各フィールドを編集して「下書き保存」または「公開」できます。
                配列フィールドは1行に1件ずつ入力してください。
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DraftForm
                draft={draft}
                onChange={setDraft}
                onSave={saveDraft}
                onPublish={publishToTools}
                saving={saving}
                publishing={publishing}
              />

              {saveMsg && (
                <div className={`mt-4 rounded-lg p-3 flex items-center gap-2 text-sm ${
                  saveMsg.ok
                    ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400"
                }`}>
                  {saveMsg.ok
                    ? <CheckCircle className="h-4 w-4 shrink-0" />
                    : <AlertCircle className="h-4 w-4 shrink-0" />}
                  {saveMsg.text}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 下書き一覧 */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <FileText className="h-4 w-4" />
                  保存済み下書き
                </CardTitle>
                <CardDescription>過去に生成・保存したツールカード（最新20件）</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => qc.invalidateQueries({ queryKey: ["agent-drafts"] })}
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DraftList onLoad={d => { setDraft(d); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
          </CardContent>
        </Card>
      </div>
    </SiteLayout>
  );
}
