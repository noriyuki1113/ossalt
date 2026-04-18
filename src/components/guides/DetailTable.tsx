import { Star } from "lucide-react";
import type { GuideTool } from "./types";

interface Props {
  tools: GuideTool[];
}

export function DetailTable({ tools }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/[0.04] text-left text-[11px] uppercase tracking-wider text-[hsl(220,15%,50%)]">
            <th className="whitespace-nowrap px-4 py-3 font-semibold">ツール名</th>
            <th className="whitespace-nowrap px-4 py-3 font-semibold">おすすめ度</th>
            <th className="whitespace-nowrap px-4 py-3 font-semibold">タイプ</th>
            <th className="whitespace-nowrap px-4 py-3 font-semibold">価格</th>
            <th className="whitespace-nowrap px-4 py-3 font-semibold">難易度</th>
            <th className="whitespace-nowrap px-4 py-3 font-semibold">用途</th>
            <th className="whitespace-nowrap px-4 py-3 font-semibold">特徴</th>
          </tr>
        </thead>
        <tbody>
          {tools.map((tool, i) => (
            <tr
              key={tool.slug}
              className={`border-b border-white/5 transition hover:bg-white/[0.03] ${
                i < 3 ? "bg-[hsl(173,58%,39%,0.04)]" : ""
              }`}
            >
              <td className="whitespace-nowrap px-4 py-3 font-medium text-white">{tool.name}</td>
              <td className="px-4 py-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star
                      key={j}
                      className={`h-3 w-3 ${j < tool.rating ? "fill-amber-400 text-amber-400" : "text-white/15"}`}
                    />
                  ))}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-1">
                  {tool.tags.map((t) => (
                    <span
                      key={t}
                      className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${
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
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-[hsl(220,15%,60%)]">{tool.price}</td>
              <td className="whitespace-nowrap px-4 py-3 text-[hsl(220,15%,60%)]">{tool.difficulty}</td>
              <td className="whitespace-nowrap px-4 py-3 text-[hsl(220,15%,60%)]">{tool.audience}</td>
              <td className="px-4 py-3 text-[hsl(220,15%,60%)]">{tool.features[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
