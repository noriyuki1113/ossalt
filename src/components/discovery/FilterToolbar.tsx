import { X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { SortOption } from "@/hooks/use-tools";

const LICENSES = ["MIT", "Apache-2.0", "GPL-3.0", "AGPL-3.0", "BSL-1.1", "MPL-2.0"];

interface FilterToolbarProps {
  sort: SortOption;
  onSortChange: (v: SortOption) => void;
  license: string;
  onLicenseChange: (v: string) => void;
  hasGithub: boolean;
  onHasGithubChange: (v: boolean) => void;
  hasDocker: boolean;
  onHasDockerChange: (v: boolean) => void;
  totalCount: number;
}

export function FilterToolbar({
  sort,
  onSortChange,
  license,
  onLicenseChange,
  hasGithub,
  onHasGithubChange,
  hasDocker,
  onHasDockerChange,
  totalCount,
}: FilterToolbarProps) {
  const activeFilters: { key: string; label: string; onRemove: () => void }[] = [];
  if (license) activeFilters.push({ key: "license", label: `ライセンス: ${license}`, onRemove: () => onLicenseChange("") });
  if (hasGithub) activeFilters.push({ key: "github", label: "GitHub あり", onRemove: () => onHasGithubChange(false) });
  if (hasDocker) activeFilters.push({ key: "docker", label: "Docker 対応", onRemove: () => onHasDockerChange(false) });

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-sm text-muted-foreground shrink-0">
          <span className="font-semibold text-foreground">{totalCount}</span> 件
        </p>

        <div className="flex-1" />

        {/* License filter */}
        <Select value={license || "all"} onValueChange={(v) => onLicenseChange(v === "all" ? "" : v)}>
          <SelectTrigger className="h-8 w-auto min-w-[130px] text-xs rounded-lg border-border gap-1.5">
            <SelectValue placeholder="ライセンス" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべてのライセンス</SelectItem>
            {LICENSES.map((l) => (
              <SelectItem key={l} value={l}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* GitHub filter */}
        <button
          onClick={() => onHasGithubChange(!hasGithub)}
          className={`h-8 px-3 text-xs rounded-lg border transition-colors ${
            hasGithub
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border bg-background text-muted-foreground hover:text-foreground"
          }`}
        >
          GitHub あり
        </button>

        <button
          onClick={() => onHasDockerChange(!hasDocker)}
          className={`h-8 px-3 text-xs rounded-lg border transition-colors ${
            hasDocker
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border bg-background text-muted-foreground hover:text-foreground"
          }`}
        >
          Docker 対応
        </button>

        {/* Sort */}
        <Select value={sort} onValueChange={(v) => onSortChange(v as SortOption)}>
          <SelectTrigger className="h-8 w-auto min-w-[130px] text-xs rounded-lg border-border gap-1.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stars">⭐ スター数順</SelectItem>
            <SelectItem value="recent">🕐 最近更新順</SelectItem>
            <SelectItem value="newest">🆕 追加順</SelectItem>
            <SelectItem value="name">🔤 A-Z順</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active filter chips */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {activeFilters.map((f) => (
            <Badge
              key={f.key}
              variant="secondary"
              className="gap-1 pl-2.5 pr-1.5 py-0.5 text-xs font-normal cursor-pointer hover:bg-destructive/10 transition-colors"
              onClick={f.onRemove}
            >
              {f.label}
              <X className="h-3 w-3" />
            </Badge>
          ))}
          {activeFilters.length > 1 && (
            <button
              className="text-xs text-muted-foreground hover:text-foreground underline"
              onClick={() => { onLicenseChange(""); onHasGithubChange(false); onHasDockerChange(false); }}
            >
              すべてクリア
            </button>
          )}
        </div>
      )}
    </div>
  );
}
