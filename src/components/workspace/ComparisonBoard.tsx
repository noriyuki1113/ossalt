import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Star, ExternalLink, Github, X, MessageSquare,
  GitCompareArrows as GitCompareArrowsPlaceholder,
  Clock, Scale, Code2, CheckCircle2, ChevronDown,
} from "lucide-react";
import { ToolIcon } from "@/components/ToolIcon";
import { formatCount, formatRelativeDate } from "@/lib/format";
import { normalizeText } from "@/lib/normalize-text";
import type { ComparisonListItem } from "@/hooks/use-workspace";
import type { Tool } from "@/hooks/use-tools";
import { cn } from "@/lib/utils";
import { track } from "@/lib/track";
import { useIsMobile } from "@/hooks/use-mobile";

interface ComparisonBoardProps {
  items: ComparisonListItem[];
  tools: Map<number, Tool>;
  onRemoveItem?: (itemId: string) => void;
  onUpdateItem?: (itemId: string, updates: Partial<ComparisonListItem>) => void;
  readOnly?: boolean;
}

const SCORE_LABELS = ["", "低い", "やや低い", "普通", "高い", "非常に高い"];

const PRIMARY_CRITERIA = [
  { label: "セルフホスト適性", key: "self_hosting_score" as const, desc: "導入・運用のしやすさ" },
  { label: "学習コスト", key: "learning_curve_score" as const, desc: "習得までの難易度" },
  { label: "チーム適合度", key: "team_fit_score" as const, desc: "チームの要件との一致度" },
];

function ScoreCell({ value }: { value: number | null }) {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground/40 text-xs">—</span>;
  }
  const color = value >= 4 ? "text-emerald-600" : value >= 3 ? "text-primary" : value >= 2 ? "text-amber-600" : "text-destructive";
  return (
    <div className="flex flex-col items-center gap-0">
      <span className={cn("font-bold tabular-nums text-sm", color)}>{value}/5</span>
      <span className="text-[10px] text-muted-foreground leading-none">{SCORE_LABELS[value]}</span>
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

function StickyToolLabels({ items, tools, topScorerId }: { items: ComparisonListItem[]; tools: Map<number, Tool>; topScorerId: string | null }) {
  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/40 -mx-1 px-1 py-2 mb-1">
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((item) => {
          const tool = tools.get(item.tool_id);
          const isTop = topScorerId === item.id;
          return (
            <div key={item.id} className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-lg",
              isTop && "bg-primary/5"
            )}>
              <ToolIcon url={tool?.url} githubUrl={tool?.github_url} name={tool?.name} size={20} />
              <span className="text-xs font-semibold text-foreground truncate">{tool?.name || `#${item.tool_id}`}</span>
              {isTop && <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ComparisonBoard({ items, tools, onRemoveItem, onUpdateItem, readOnly = false }: ComparisonBoardProps) {
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteValue, setNoteValue] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const isMobile = useIsMobile();

  if (items.length === 0) {
    return (
      <div className="card-unified p-8 text-center">
        <GitCompareArrowsPlaceholder className="h-8 w-8 text-muted-foreground/40 mx-auto mb-3" />
        <p className="text-sm text-muted-foreground mb-1">比較する候補を追加しましょう</p>
        <p className="text-xs text-muted-foreground/60">保存した候補を2〜3件選ぶと、違いを見比べやすくなります。</p>
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

  const itemScores = items.map((item) => {
    const total = (item.self_hosting_score || 0) + (item.learning_curve_score || 0) + (item.team_fit_score || 0);
    const count = [item.self_hosting_score, item.learning_curve_score, item.team_fit_score].filter(Boolean).length;
    return { id: item.id, avg: count > 0 ? total / count : 0, hasScores: count > 0 };
  });

  const topScorer = itemScores.filter(s => s.hasScores).sort((a, b) => b.avg - a.avg)[0];
  const topScorerId = topScorer?.hasScores ? topScorer.id : null;

  return (
    <div className="space-y-0">
      {/* Tool header cards */}
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((item) => {
          const tool = tools.get(item.tool_id);
          const isTop = topScorerId === item.id;
          return (
            <div key={item.id} className={cn("card-unified p-3 sm:p-4 relative", isTop && "ring-1 ring-primary/30")}>
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
              <div className="flex items-center gap-2 mb-2">
                <ToolIcon url={tool?.url} githubUrl={tool?.github_url} name={tool?.name} size={isMobile ? 28 : 32} />
                <div className="min-w-0 flex-1">
                  <Link
                    to={`/tools/${item.tool_id}`}
                    className="text-sm font-bold text-foreground hover:text-primary transition-colors block truncate"
                  >
                    {tool?.name || `Tool #${item.tool_id}`}
                  </Link>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1 sm:line-clamp-2 leading-relaxed mb-2">
                {normalizeText(tool?.description_ja || tool?.description_en) || "—"}
              </p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-muted-foreground">
                {tool?.stars_num && (
                  <span className="inline-flex items-center gap-0.5">
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                    <span className="font-medium text-foreground tabular-nums">{formatCount(tool.stars_num)}</span>
                  </span>
                )}
                {tool?.license && tool.license !== "NOASSERTION" && (
                  <span className="inline-flex items-center gap-0.5">
                    <Scale className="h-3 w-3" />
                    {tool.license}
                  </span>
                )}
                {!isMobile && tool?.language && (
                  <span className="inline-flex items-center gap-0.5">
                    <Code2 className="h-3 w-3" />
                    {tool.language}
                  </span>
                )}
                {!isMobile && tool?.last_commit && formatRelativeDate(tool.last_commit) && (
                  <span className="inline-flex items-center gap-0.5">
                    <Clock className="h-3 w-3" />
                    {formatRelativeDate(tool.last_commit)}
                  </span>
                )}
              </div>
              {!isMobile && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/40">
                  {tool?.url && (
                    <a href={tool.url} target="_blank" rel="noopener noreferrer"
                      className="text-[10px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors">
                      <ExternalLink className="h-3 w-3" /> 公式サイト
                    </a>
                  )}
                  {tool?.github_url && (
                    <a href={tool.github_url} target="_blank" rel="noopener noreferrer"
                      className="text-[10px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors">
                      <Github className="h-3 w-3" /> GitHub
                    </a>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sticky tool labels */}
      <StickyToolLabels items={items} tools={tools} topScorerId={topScorerId} />

      {/* Evaluation section */}
      <div className="mt-2">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">評価 — 重要項目</h3>
        <p className="text-[10px] text-muted-foreground/60 mb-2">まずは重要な項目だけ確認して、必要に応じて詳細を開いてください。</p>
        <div className="card-unified overflow-hidden">
          <table className="w-full text-sm">
            <tbody>
              {PRIMARY_CRITERIA.map((row) => (
                <tr key={row.key} className="border-b border-border/30 last:border-0">
                  <td className="p-2 sm:p-3 w-24 sm:w-32">
                    <p className="text-xs font-medium text-foreground leading-tight">{row.label}</p>
                    {!isMobile && <p className="text-[10px] text-muted-foreground">{row.desc}</p>}
                  </td>
                  {items.map((item) => (
                    <td key={item.id} className="p-2 sm:p-3 text-center">
                      {readOnly ? (
                        <ScoreCell value={item[row.key]} />
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

        {/* Expandable detailed evaluation */}
        {isMobile && (
          <button
            onClick={() => {
              setShowDetails(!showDetails);
              if (!showDetails) track("evaluation_details_expanded");
            }}
            className="w-full mt-2 py-2 text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1 transition-colors"
          >
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showDetails && "rotate-180")} />
            {showDetails ? "詳細評価を閉じる" : "詳細評価を見る"}
          </button>
        )}

        {(showDetails || !isMobile) && isMobile && (
          <div className="card-unified overflow-hidden mt-1">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-border/30">
                  <td className="p-2 w-24"><p className="text-xs font-medium text-foreground">言語</p></td>
                  {items.map((item) => {
                    const tool = tools.get(item.tool_id);
                    return <td key={item.id} className="p-2 text-center text-xs text-muted-foreground">{tool?.language || "—"}</td>;
                  })}
                </tr>
                <tr className="border-b border-border/30">
                  <td className="p-2 w-24"><p className="text-xs font-medium text-foreground">最終更新</p></td>
                  {items.map((item) => {
                    const tool = tools.get(item.tool_id);
                    return <td key={item.id} className="p-2 text-center text-xs text-muted-foreground">{tool?.last_commit ? formatRelativeDate(tool.last_commit) : "—"}</td>;
                  })}
                </tr>
                <tr>
                  <td className="p-2 w-24"><p className="text-xs font-medium text-foreground">リンク</p></td>
                  {items.map((item) => {
                    const tool = tools.get(item.tool_id);
                    return (
                      <td key={item.id} className="p-2 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {tool?.url && (
                            <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary">公式サイト</a>
                          )}
                          {tool?.github_url && (
                            <a href={tool.github_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary">GitHub</a>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Notes section */}
      <div className="mt-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">メモ</h3>
        <p className="text-[10px] text-muted-foreground/60 mb-2">短くても残しておくと、あとで見返しやすくなります。</p>
        <div className="grid gap-2 sm:gap-3" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
          {items.map((item) => {
            const tool = tools.get(item.tool_id);
            return (
              <div key={item.id} className="card-unified p-2.5 sm:p-3">
                <p className="text-[10px] font-medium text-muted-foreground mb-1.5">{tool?.name || `Tool #${item.tool_id}`}</p>
                {readOnly ? (
                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {normalizeText(item.decision_note) || "メモはまだありません"}
                  </p>
                ) : editingNote === item.id ? (
                  <div className="space-y-1.5">
                    <textarea
                      value={noteValue}
                      onChange={(e) => setNoteValue(e.target.value)}
                      className="w-full text-xs p-2 border border-border rounded-lg bg-background resize-none focus:outline-none focus:ring-1 focus:ring-primary/40"
                      rows={3}
                      placeholder="気になった点、向いている用途、懸念点などを残しておきましょう"
                      autoFocus
                    />
                    <div className="flex gap-1 justify-end">
                      <button onClick={() => setEditingNote(null)} className="text-[10px] text-muted-foreground px-2 py-0.5">キャンセル</button>
                      <button onClick={() => saveNote(item.id)} className="text-[10px] text-primary font-medium px-2 py-0.5">保存</button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => startEditNote(item.id, item.decision_note)}
                    className="text-xs text-left text-muted-foreground hover:text-foreground transition-colors w-full min-h-[1.5rem]"
                  >
                    {item.decision_note || (
                      <span className="inline-flex items-center gap-1 text-muted-foreground/50 text-[10px]">
                        <MessageSquare className="h-3 w-3" /> メモを追加
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
