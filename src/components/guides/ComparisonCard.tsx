import { ExternalLink, Github, Star } from "lucide-react";
import type { GuideTool } from "./types";

interface Props {
  tool: GuideTool;
}

const DIFFICULTY_COLOR: Record<string, string> = {
  "初心者OK": "border-emerald-500/30 bg-emerald-500/15 text-emerald-300",
  "中級": "border-amber-500/30 bg-amber-500/15 text-amber-300",
  "上級": "border-rose-500/30 bg-rose-500/15 text-rose-300",
};

const AUDIENCE_ICON: Record<string, string> = {
  "個人": "👤",
  "チーム": "🏢",
  "個人・チーム": "👥",
};

export function ComparisonCard({ tool }: Props) {
  return (
    <div
      id={`tool-${tool.slug}`}
      className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.05]"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-white">{tool.name}</h3>
          <p className="mt-0.5 text-sm text-[hsl(220,15%,55%)]">{tool.shortLabel}</p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5 rounded-lg bg-amber-500/15 px-2 py-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${i < tool.rating ? "fill-amber-400 text-amber-400" : "text-white/20"}`}
            />
          ))}
        </div>
      </div>

      {/* Tags row */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tool.tags.map((t) => (
          <span
            key={t}
            className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
              t === "OSS"
                ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                : t === "無料"
                  ? "border-sky-500/30 bg-sky-500/15 text-sky-300"
                  : "border-violet-500/30 bg-violet-500/15 text-violet-300"
            }`}
          >
            {t}
          </span>
        ))}
        <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${DIFFICULTY_COLOR[tool.difficulty]}`}>
          {tool.difficulty}
        </span>
        <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[10px] font-semibold text-[hsl(220,15%,65%)]">
          {AUDIENCE_ICON[tool.audience]} {tool.audience}
        </span>
      </div>

      {/* Description */}
      <p className="mt-3 text-sm leading-relaxed text-[hsl(220,15%,60%)]">{tool.description}</p>

      {/* CTA */}
      <div className="mt-auto flex gap-2 pt-4">
        <a
          href={tool.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-xl bg-[hsl(173,58%,39%)] px-4 text-sm font-semibold text-white transition hover:bg-[hsl(173,58%,34%)] active:scale-[0.98]"
        >
          公式サイト <ExternalLink className="h-3.5 w-3.5" />
        </a>
        {tool.github && (
          <a
            href={tool.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border border-white/15 px-4 text-sm font-medium text-[hsl(220,20%,80%)] transition hover:bg-white/5 active:scale-[0.98]"
          >
            <Github className="h-4 w-4" />
          </a>
        )}
      </div>
    </div>
  );
}
