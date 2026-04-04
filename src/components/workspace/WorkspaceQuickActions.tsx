import { Link, useNavigate } from "react-router-dom";
import { Bookmark, GitCompareArrows, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useComparisonLists } from "@/hooks/use-workspace";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { track } from "@/lib/track";

interface StarterTemplate {
  title: string;
  competitor: string;
  description: string;
}

const STARTER_TEMPLATES: StarterTemplate[] = [
  { title: "Notion代替比較", competitor: "Notion", description: "ナレッジ共有・社内ドキュメント用途で候補を比べる" },
  { title: "Slack代替比較", competitor: "Slack", description: "チャット・チームコミュニケーション用途で比べる" },
  { title: "セルフホスト候補比較", competitor: "", description: "運用負荷や導入しやすさを重視して比べる" },
];

export function StarterTemplates() {
  const navigate = useNavigate();
  const { createList } = useComparisonLists();

  const handleTemplate = async (template: StarterTemplate) => {
    try {
      const result = await createList.mutateAsync(template.title);

      let query = supabase.from("tools").select("id").order("stars_num", { ascending: false, nullsFirst: false }).limit(3);
      if (template.competitor) {
        query = query.eq("primary_competitor", template.competitor);
      }
      const { data: tools } = await query;

      if (tools && tools.length > 0) {
        const inserts = tools.map((t, i) => ({
          comparison_list_id: result.id,
          tool_id: t.id,
          position: i,
        }));
        await supabase.from("comparison_list_items").insert(inserts);
      }

      track("template_comparison_created", { template: template.title });
      toast.success(`「${template.title}」を作成しました`);
      navigate(`/workspace/compare/${result.id}`);
    } catch {
      toast.error("作成に失敗しました");
    }
  };

  return (
    <div>
      <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-1.5">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        すぐに始められる比較テンプレート
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {STARTER_TEMPLATES.map((t) => (
          <button
            key={t.title}
            onClick={() => handleTemplate(t)}
            className="card-unified-hover p-4 text-left group"
          >
            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">{t.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
            <p className="text-[10px] text-primary mt-2 opacity-0 group-hover:opacity-100 transition-opacity">このテンプレで始める</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export function WorkspaceOnboarding() {
  return (
    <div className="card-unified p-5 mb-6 bg-primary/[0.02]">
      <h2 className="text-sm font-semibold text-foreground mb-3">候補を並べて、比較しながら決めましょう</h2>
      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
        気になるOSSを保存すると、このワークスペースでまとめて比較できます。
        評価メモを残したり、チームに共有したりしながら、導入候補を整理できます。
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {[
          { step: "1", label: "候補を保存する", icon: Bookmark },
          { step: "2", label: "並べて比較する", icon: GitCompareArrows },
          { step: "3", label: "メモして共有する", icon: Sparkles },
        ].map((item) => (
          <div key={item.step} className="text-center">
            <div className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
              {item.step}
            </div>
            <p className="text-xs font-medium text-foreground">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
