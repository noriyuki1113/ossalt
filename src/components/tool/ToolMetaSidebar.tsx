import { Star, GitFork, Clock, Scale, Code2, ExternalLink, Github } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { formatCount, getLanguageBadgeClass } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { track } from "@/lib/track";
import type { Tool } from "@/hooks/use-tools";

interface ToolMetaSidebarProps {
  tool: Tool;
}

function MetaRow({ icon: Icon, label, value }: { icon: typeof Star; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5 border-b border-border/50 last:border-0">
      <span className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </span>
      <span className="text-xs font-medium text-foreground text-right">{value}</span>
    </div>
  );
}

export function ToolMetaSidebar({ tool }: ToolMetaSidebarProps) {
  const lastCommitText = tool.last_commit
    ? formatDistanceToNow(new Date(tool.last_commit), { addSuffix: true, locale: ja })
    : null;

  const langClass = tool.language ? getLanguageBadgeClass(tool.language) : null;

  const hasAnyMeta =
    tool.stars_num != null ||
    tool.forks_num != null ||
    lastCommitText ||
    tool.license ||
    tool.language;

  if (!hasAnyMeta && !tool.url && !tool.github_url) return null;

  return (
    <div className="card-unified p-5 space-y-1">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        プロジェクト情報
      </h3>

      <div>
        {tool.stars_num != null && (
          <MetaRow
            icon={Star}
            label="GitHubスター"
            value={
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                {formatCount(tool.stars_num)}
              </span>
            }
          />
        )}
        {tool.forks_num != null && tool.forks_num > 0 && (
          <MetaRow
            icon={GitFork}
            label="フォーク"
            value={formatCount(tool.forks_num)}
          />
        )}
        {lastCommitText && (
          <MetaRow
            icon={Clock}
            label="最終コミット"
            value={lastCommitText}
          />
        )}
        {tool.license && tool.license !== "NOASSERTION" && (
          <MetaRow
            icon={Scale}
            label="ライセンス"
            value={tool.license}
          />
        )}
        {tool.language && (
          <MetaRow
            icon={Code2}
            label="言語"
            value={
              langClass ? (
                <Badge className={`text-[10px] font-normal border px-2 py-0 h-5 ${langClass}`}>
                  {tool.language}
                </Badge>
              ) : (
                tool.language
              )
            }
          />
        )}
      </div>

      {(tool.url || tool.github_url) && (
        <div className="pt-3 border-t border-border/50 space-y-2">
          {tool.url && (
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-foreground hover:text-primary transition-colors"
              onClick={() => track("external_link_click", { tool: tool.name, target: "official_sidebar", url: tool.url })}
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">公式サイト</span>
            </a>
          )}
          {tool.github_url && (
            <a
              href={tool.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-foreground hover:text-primary transition-colors"
              onClick={() => track("external_link_click", { tool: tool.name, target: "github_sidebar", url: tool.github_url })}
            >
              <Github className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">GitHub</span>
            </a>
          )}
        </div>
      )}
    </div>
  );
}
