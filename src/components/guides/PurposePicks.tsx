import type { PurposePick } from "./types";

interface Props {
  picks: PurposePick[];
}

export function PurposePicks({ picks }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {picks.map((p) => (
        <a
          key={p.slug}
          href={`#tool-${p.slug}`}
          className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-[hsl(173,58%,39%,0.4)] hover:bg-white/[0.06] active:scale-[0.98]"
        >
          <span className="text-2xl">{p.emoji}</span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-[hsl(220,15%,55%)]">{p.label}</p>
            <p className="truncate text-base font-bold text-white">{p.toolName}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
