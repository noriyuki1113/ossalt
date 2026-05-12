/** Shared formatting and display utilities for tool data */

export function formatCount(num: number | null | undefined): string {
  if (!num) return "0";
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(num);
}

export function formatLargeNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M+`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0).replace(/\.0$/, "")}K+`;
  return String(n);
}

export function formatRelativeDate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  try {
    const diffDays = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
    if (diffDays < 1) return "今日";
    if (diffDays < 30) return `${diffDays}日前`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths}ヶ月前`;
    return `${Math.floor(diffMonths / 12)}年前`;
  } catch {
    return null;
  }
}

const EXCLUDED_LOGO_HOSTS = new Set(["openalternative.co", "www.openalternative.co"]);

export function getFaviconUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const host = new URL(url).hostname;
    if (EXCLUDED_LOGO_HOSTS.has(host.toLowerCase())) return null;
    return `https://www.google.com/s2/favicons?domain=${host}&sz=32`;
  } catch {
    return null;
  }
}

export function getGithubAvatarUrl(githubUrl: string | null | undefined): string | null {
  if (!githubUrl) return null;
  try {
    const parts = new URL(githubUrl).pathname.split("/").filter(Boolean);
    if (parts.length > 0) return `https://github.com/${parts[0]}.png?size=64`;
  } catch {}
  return null;
}

/** Language → Tailwind badge classes (dark-theme compatible) */
export const LANG_COLORS: Record<string, string> = {
  Python:     "bg-blue-500/10 text-blue-400 border-blue-500/20",
  TypeScript: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  JavaScript: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Go:         "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Rust:       "bg-orange-500/10 text-orange-400 border-orange-500/20",
  Ruby:       "bg-red-500/10 text-red-400 border-red-500/20",
  Java:       "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Kotlin:     "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Swift:      "bg-orange-500/10 text-orange-300 border-orange-500/20",
  "C++":      "bg-pink-500/10 text-pink-400 border-pink-500/20",
  C:          "bg-slate-500/10 text-slate-400 border-slate-500/20",
  PHP:        "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
};

export function getLanguageBadgeClass(lang: string): string {
  return LANG_COLORS[lang] || "bg-secondary text-muted-foreground border-border";
}
