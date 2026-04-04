import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ExternalLink, Github, X, MessageSquare, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolIcon } from "@/components/ToolIcon";
import { formatCount } from "@/lib/format";
import { StatusBadge } from "./StatusBadge";
import type { ComparisonListItem } from "@/hooks/use-workspace";
import type { Tool } from "@/hooks/use-tools";
import { cn } from "@/lib/utils";

interface ComparisonBoardProps {
  items: ComparisonListItem[];
  tools: Map<number, Tool>;
  onRemoveItem?: (itemId: string) => void;
  onUpdateItem?: (itemId: string, updates: Partial<ComparisonListItem>) => void;
  readOnly?: boolean;
}

function ScoreCell({ value, label }: { value: number | null; label: string }) {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground/40">—</span>;
  }
  const color = value >= 4 ? "text-emerald-600" : value >= 3 ? "text-primary" : value >= 2 ? "text-amber-600" : "text-destructive";
  return (
    <span className={cn("font-semibold tabular-nums", color)} title={label}>
      {value}/5
    </span>
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
  };

  const rows: { label: string; key: string }[] = [
    { label: "カテゴリ", key: "category" },
    { label: "GitHubスター", key: "stars" },
    { label: "ライセンス", key: "license" },
    { label: "主要言語", key: "language" },
    { label: "セルフホスト適性", key: "self_hosting_score" },
    { label: "学習コスト", key: "learning_curve_score" },
    { label: "チーム適合度", key: "team_fit_score" },
    { label: "メモ", key: "note" },
  ];

  return (
    <div className="card-unified overflow-hidden overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/60">
            <th className="text-left p-3 text-xs font-medium text-muted-foreground w-28 sticky left-0 bg-card z-10"></th>
            {items.map((item) => {
              const tool = tools.get(item.tool_id);
              return (
                <th key={item.id} className="p-3 min-w-[180px] max-w-[220px]">
                  <div className="flex flex-col items-center gap-2 relative">
                    {!readOnly && onRemoveItem && (
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-secondary hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                    <ToolIcon url={tool?.url} githubUrl={tool?.github_url} name={tool?.name} size={32} />
                    <Link
                      to={`/tools/${item.tool_id}`}
                      className="text-xs font-bold text-foreground hover:text-primary transition-colors text-center"
                    >
                      {tool?.name || `Tool #${item.tool_id}`}
                    </Link>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {/* Description row */}
          <tr className="border-b border-border/30">
            <td className="p-3 text-xs font-medium text-muted-foreground sticky left-0 bg-card">説明</td>
            {items.map((item) => {
              const tool = tools.get(item.tool_id);
              return (
                <td key={item.id} className="p-3 text-xs text-muted-foreground leading-relaxed">
                  {tool?.description_ja || tool?.description_en || "—"}
                </td>
              );
            })}
          </tr>

          {rows.map((row) => (
            <tr key={row.key} className="border-b border-border/30 last:border-0">
              <td className="p-3 text-xs font-medium text-muted-foreground sticky left-0 bg-card">
                {row.label}
              </td>
              {items.map((item) => {
                const tool = tools.get(item.tool_id);
                return (
                  <td key={item.id} className="p-3 text-xs text-center">
                    {row.key === "category" && (
                      <span className="text-muted-foreground">{tool?.parent_category_ja || "—"}</span>
                    )}
                    {row.key === "stars" && (
                      <span className="inline-flex items-center gap-1 text-foreground font-medium">
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                        {tool?.stars_num ? formatCount(tool.stars_num) : "—"}
                      </span>
                    )}
                    {row.key === "license" && (
                      <span className="text-muted-foreground">
                        {tool?.license && tool.license !== "NOASSERTION" ? tool.license : "—"}
                      </span>
                    )}
                    {row.key === "language" && (
                      <span className="text-muted-foreground">{tool?.language || "—"}</span>
                    )}
                    {row.key === "self_hosting_score" && (
                      readOnly ? (
                        <ScoreCell value={item.self_hosting_score} label="セルフホスト適性" />
                      ) : (
                        <ScoreSelect
                          value={item.self_hosting_score}
                          onChange={(v) => onUpdateItem?.(item.id, { self_hosting_score: v })}
                        />
                      )
                    )}
                    {row.key === "learning_curve_score" && (
                      readOnly ? (
                        <ScoreCell value={item.learning_curve_score} label="学習コスト" />
                      ) : (
                        <ScoreSelect
                          value={item.learning_curve_score}
                          onChange={(v) => onUpdateItem?.(item.id, { learning_curve_score: v })}
                        />
                      )
                    )}
                    {row.key === "team_fit_score" && (
                      readOnly ? (
                        <ScoreCell value={item.team_fit_score} label="チーム適合度" />
                      ) : (
                        <ScoreSelect
                          value={item.team_fit_score}
                          onChange={(v) => onUpdateItem?.(item.id, { team_fit_score: v })}
                        />
                      )
                    )}
                    {row.key === "note" && (
                      readOnly ? (
                        <span className="text-muted-foreground text-left block">
                          {item.decision_note || "—"}
                        </span>
                      ) : editingNote === item.id ? (
                        <div className="flex flex-col gap-1">
                          <textarea
                            value={noteValue}
                            onChange={(e) => setNoteValue(e.target.value)}
                            className="w-full text-xs p-2 border border-border rounded-lg bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary/40"
                            rows={2}
                            autoFocus
                          />
                          <div className="flex gap-1 justify-end">
                            <button
                              onClick={() => setEditingNote(null)}
                              className="text-[10px] text-muted-foreground hover:text-foreground px-2 py-0.5 rounded"
                            >
                              キャンセル
                            </button>
                            <button
                              onClick={() => saveNote(item.id)}
                              className="text-[10px] text-primary font-medium hover:underline px-2 py-0.5 rounded"
                            >
                              保存
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditNote(item.id, item.decision_note)}
                          className="text-xs text-left text-muted-foreground hover:text-foreground transition-colors w-full"
                        >
                          {item.decision_note || (
                            <span className="inline-flex items-center gap-1 text-muted-foreground/50">
                              <MessageSquare className="h-3 w-3" /> メモを追加
                            </span>
                          )}
                        </button>
                      )
                    )}
                  </td>
                );
              })}
            </tr>
          ))}

          {/* Links row */}
          <tr>
            <td className="p-3 text-xs font-medium text-muted-foreground sticky left-0 bg-card">リンク</td>
            {items.map((item) => {
              const tool = tools.get(item.tool_id);
              return (
                <td key={item.id} className="p-3">
                  <div className="flex items-center justify-center gap-2">
                    {tool?.url && (
                      <a href={tool.url} target="_blank" rel="noopener noreferrer"
                        className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {tool?.github_url && (
                      <a href={tool.github_url} target="_blank" rel="noopener noreferrer"
                        className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                        <Github className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ── Score select ── */
function ScoreSelect({ value, onChange }: { value: number | null; onChange: (v: number) => void }) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(Number(e.target.value))}
      className="text-xs bg-transparent border border-border/60 rounded px-1.5 py-0.5 text-center focus:outline-none focus:ring-1 focus:ring-primary/40 cursor-pointer"
    >
      <option value="">—</option>
      {[1, 2, 3, 4, 5].map((v) => (
        <option key={v} value={v}>{v}/5</option>
      ))}
    </select>
  );
}

function GitCompareArrowsIcon(props: React.SVGProps<SVGSVGElement>) {
  return <GitCompareArrows {...props} />;
}
