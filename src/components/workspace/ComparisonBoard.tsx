import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Star, ExternalLink, Github, X, MessageSquare,
  GitCompareArrows as GitCompareArrowsPlaceholder,
  Clock, Scale, Code2, CheckCircle2,
} from "lucide-react";
import { ToolIcon } from "@/components/ToolIcon";
import { formatCount, formatRelativeDate } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";
import type { ComparisonListItem } from "@/hooks/use-workspace";
import type { Tool } from "@/hooks/use-tools";
import { cn } from "@/lib/utils";
import { track } from "@/lib/track";

interface ComparisonBoardProps {
  items: ComparisonListItem[];
  tools: Map<number, Tool>;
  onRemoveItem?: (itemId: string) => void;
  onUpdateItem?: (itemId: string, updates: Partial<ComparisonListItem>) => void;
  readOnly?: boolean;
}

const SCORE_LABELS = ["", "低い", "やや低い", "普通", "高い", "非常に高い"];

function ScoreCell({ value, label }: { value: number | null; label: string }) {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground/40 text-xs">未評価</span>;
  }
  const color = value >= 4 ? "text-emerald-600" : value >= 3 ? "text-primary" : value >= 2 ? "text-amber-600" : "text-destructive";
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={cn("font-bold tabular-nums text-sm", color)}>{value}/5</span>
      <span className="text-[10px] text-muted-foreground">{SCORE_LABELS[value]}</span>
    </div>
  );
}

function ScoreSelect({ value, onChange }: { value: number | null; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-0.5">
      {[1, 2, 3, 4, 5].map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={cn(
            "h-7 w-7 rounded-md text-xs font-medium transition-colors",
            value === v
              ? v >= 4 ? "bg-emerald-100 text-emerald-700" : v >= 3 ? "bg-primary/10 text-primary" : "bg-amber-100 text-amber-700"
              : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
          )}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

export function ComparisonBoard({ items, tools, onRemoveItem, onUpdateItem, readOnly = false }: ComparisonBoardProps) {
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteValue, setNoteValue] = useState("");

  if (items.length === 0) {
    return (
      <div className="card-unified p-8 text-center">
        <GitCompareArrowsPlaceholder className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground mb-1">比較するツールがまだありません</p>
        <p className="text-xs text-muted-foreground/60">ツール詳細ページから「比較に追加」で候補を追加できます</p>
      </div>
    );
  }

  const startEditNote = (itemId: string, currentNote: string | null) => {
    setEditingNote(itemId);
    setNoteValue(currentNote || "");
  };

  const saveNote = (itemId: string) => {
    onUpdateItem?.(itemId, { decision_note: noteValue });
    setEditingNote(null);
    track("comparison_note_saved", { item_id: itemId });
  };

  // Calculate total scores for ranking indicator
  const itemScores = items.map((item) => {
    const total = (item.self_hosting_score || 0) + (item.learning_curve_score || 0) + (item.team_fit_score || 0);
    const count = [item.self_hosting_score, item.learning_curve_score, item.team_fit_score].filter(Boolean).length;
    return { id: item.id, avg: count > 0 ? total / count : 0, hasScores: count > 0 };
  });

  const topScorer = itemScores.filter(s => s.hasScores).sort((a, b) => b.avg - a.avg)[0];

  return (
    <div className="space-y-0">
      {/* Tool header cards */}
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((item) => {
          const tool = tools.get(item.tool_id);
          const isTop = topScorer?.id === item.id && topScorer.hasScores;
          return (
            <div key={item.id} className={cn("card-unified p-4 relative", isTop && "ring-1 ring-primary/30")}>
              {!readOnly && onRemoveItem && (
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="absolute top-2 right-2 h-5 w-5 rounded-full bg-secondary hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
              {isTop && (
                <span className="absolute -top-2 left-3 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> 最高評価
                </span>
              )}
              <div className="flex items-center gap-2.5 mb-2">
                <ToolIcon url={tool?.url} githubUrl={tool?.github_url} name={tool?.name} size={32} />
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/tools/${item.tool_id}`}
                    className="text-sm font-bold text-foreground hover:text-primary transition-colors block truncate"
                  >
                    {tool?.name || `Tool #${item.tool_id}`}
                  </Link>
                  <span className="text-[10px] text-muted-foreground">{tool?.parent_category_ja || ""}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed mb-3">
                {tool?.description_ja || tool?.description_en || "—"}
              </p>
              {/* Key metadata */}
              <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
                {tool?.stars_num && (
                  <span className="inline-flex items-center gap-0.5">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                    <span className="font-medium text-foreground tabular-nums">{formatCount(tool.stars_num)}</span>
                  </span>
                )}
                {tool?.language && (
                  <span className="inline-flex items-center gap-0.5">
                    <Code2 className="h-3 w-3" />
                    {tool.language}
                  </span>
                )}
                {tool?.license && tool.license !== "NOASSERTION" && (
                  <span className="inline-flex items-center gap-0.5">
                    <Scale className="h-3 w-3" />
                    {tool.license}
                  </span>
                )}
                {tool?.last_commit && formatRelativeDate(tool.last_commit) && (
                  <span className="inline-flex items-center gap-0.5">
                    <Clock className="h-3 w-3" />
                    {formatRelativeDate(tool.last_commit)}
                  </span>
                )}
              </div>
              {/* External links */}
              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-border/40">
                {tool?.url && (
                  <a href={tool.url} target="_blank" rel="noopener noreferrer"
                    className="text-[10px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors">
                    <ExternalLink className="h-3 w-3" /> 公式
                  </a>
                )}
                {tool?.github_url && (
                  <a href={tool.github_url} target="_blank" rel="noopener noreferrer"
                    className="text-[10px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors">
                    <Github className="h-3 w-3" /> GitHub
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Evaluation section */}
      <div className="mt-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">評価</h3>
        <div className="card-unified overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {[
                { label: "セルフホスト適性", key: "self_hosting_score" as const, desc: "導入・運用のしやすさ" },
                { label: "学習コスト", key: "learning_curve_score" as const, desc: "習得までの難易度" },
                { label: "チーム適合度", key: "team_fit_score" as const, desc: "チームの要件との一致度" },
              ].map((row) => (
                <tr key={row.key} className="border-b border-border/30 last:border-0">
                  <td className="p-3 w-32">
                    <p className="text-xs font-medium text-foreground">{row.label}</p>
                    <p className="text-[10px] text-muted-foreground">{row.desc}</p>
                  </td>
                  {items.map((item) => (
                    <td key={item.id} className="p-3 text-center">
                      {readOnly ? (
                        <ScoreCell value={item[row.key]} label={row.label} />
                      ) : (
                        <ScoreSelect
                          value={item[row.key]}
                          onChange={(v) => {
                            onUpdateItem?.(item.id, { [row.key]: v });
                            track("comparison_score_changed", { item_id: item.id, metric: row.key, value: v });
                          }}
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes section */}
      <div className="mt-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">検討メモ</h3>
        <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
          {items.map((item) => {
            const tool = tools.get(item.tool_id);
            return (
              <div key={item.id} className="card-unified p-3">
                <p className="text-[10px] font-medium text-muted-foreground mb-2">{tool?.name || `Tool #${item.tool_id}`}</p>
                {readOnly ? (
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {item.decision_note || "メモなし"}
                  </p>
                ) : editingNote === item.id ? (
                  <div className="space-y-1.5">
                    <textarea
                      value={noteValue}
                      onChange={(e) => setNoteValue(e.target.value)}
                      className="w-full text-xs p-2 border border-border rounded-lg bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary/40"
                      rows={3}
                      placeholder="このツールの良い点、懸念点、確認事項…"
                      autoFocus
                    />
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => setEditingNote(null)} className="text-[10px] text-muted-foreground hover:text-foreground px-2 py-0.5 rounded">キャンセル</button>
                      <button onClick={() => saveNote(item.id)} className="text-[10px] text-primary font-medium hover:underline px-2 py-0.5 rounded">保存</button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => startEditNote(item.id, item.decision_note)}
                    className="text-xs text-left text-muted-foreground hover:text-foreground transition-colors w-full min-h-[2rem]"
                  >
                    {item.decision_note || (
                      <span className="inline-flex items-center gap-1 text-muted-foreground/50">
                        <MessageSquare className="h-3 w-3" /> クリックしてメモを追加
                      </span>
                    )}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
