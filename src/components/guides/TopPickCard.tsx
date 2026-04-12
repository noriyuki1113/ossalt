import { ExternalLink, Github } from "lucide-react";
import type { GuideTool, TopBadge } from "./types";

const BADGE_STYLES: Record<TopBadge, { bg: string; text: string; icon: string }> = {
  BEST: { bg: "from-amber-500/30 to-amber-600/10", text: "text-amber-300", icon: "⭐" },
  "人気": { bg: "from-rose-500/30 to-rose-600/10", text: "text-rose-300", icon: "🔥" },
  "個人向け": { bg: "from-sky-500/30 to-sky-600/10", text: "text-sky-300", icon: "👤" },
  "チーム向け": { bg: "from-violet-500/30 to-violet-600/10", text: "text-violet-300", icon: "🏢" },
};

interface Props {
  tool: GuideTool;
  badge: TopBadge;
  rank: number;
}

export function TopPickCard({ tool, badge, rank }: Props) {
  const b = BADGE_STYLES[badge];

  return (
    <div className="group relative flex flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-6 shadow-lg shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl hover:shadow-black/30">
      {/* Badge */}
      <div className={`absolute -top-3 left-4 flex items-center gap-1.5 rounded-full bg-gradient-to-r ${b.bg} border border-white/10 px-3 py-1`}>
        <span className="text-sm">{b.icon}</span>
        <span className={`text-xs font-bold ${b.text}`}>{badge}</span>
      </div>

      {/* Rank */}
      <div className="absolute -top-3 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-[hsl(173,58%,39%)] text-xs font-bold text-white shadow">
        {rank}
      </div>

      <div className="mt-3">
        <h3 className="text-xl font-bold text-white">{tool.name}</h3>
        <p className="mt-1 text-sm text-[hsl(220,15%,55%)]">{tool.shortLabel}</p>
      </div>

      {/* Features */}
      <ul className="mt-4 flex flex-col gap-1.5">
        {tool.features.slice(0, 3).map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-[hsl(220,15%,70%)]">
            <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(173,58%,50%)]" />
            {f}
          </li>
        ))}
      </ul>

      {/* Tags */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {tool.tags.map((t) => (
          <span
            key={t}
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
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
      </div>

      {/* CTA */}
      <div className="mt-auto flex flex-wrap gap-2 pt-5">
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
            <Github className="h-4 w-4" /> GitHub
          </a>
        )}
      </div>
    </div>
  );
}
