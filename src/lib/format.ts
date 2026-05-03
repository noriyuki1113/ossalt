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

/** Language → Tailwind badge classes */
export const LANG_COLORS: Record<string, string> = {
  Python: "bg-blue-50 text-blue-600 border-blue-200",
  TypeScript: "bg-teal-50 text-teal-600 border-teal-200",
  JavaScript: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Go: "bg-cyan-50 text-cyan-600 border-cyan-200",
  Rust: "bg-orange-50 text-orange-600 border-orange-200",
  Ruby: "bg-red-50 text-red-600 border-red-200",
  Java: "bg-amber-50 text-amber-700 border-amber-200",
  Kotlin: "bg-purple-50 text-purple-600 border-purple-200",
  Swift: "bg-orange-50 text-orange-500 border-orange-200",
  "C++": "bg-pink-50 text-pink-600 border-pink-200",
  C: "bg-gray-50 text-gray-600 border-gray-200",
  PHP: "bg-indigo-50 text-indigo-600 border-indigo-200",
};

export function getLanguageBadgeClass(lang: string): string {
  return LANG_COLORS[lang] || "bg-secondary text-muted-foreground border-border";
}
