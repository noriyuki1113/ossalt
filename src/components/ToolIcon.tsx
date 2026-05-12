import { useState, useCallback } from "react";

interface ToolIconProps {
  url?: string | null;
  githubUrl?: string | null;
  name?: string | null;
  size?: number;
}

/** Domains that are aggregator/directory sites — never use as a tool's own logo source */
const EXCLUDED_LOGO_DOMAINS = new Set([
  "openalternative.co",
  "www.openalternative.co",
]);

function isExcludedDomain(hostname: string): boolean {
  return EXCLUDED_LOGO_DOMAINS.has(hostname.toLowerCase());
}

function getClearbitUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const host = new URL(url).hostname;
    if (isExcludedDomain(host)) return null;
    return `https://logo.clearbit.com/${host}`;
  } catch { return null; }
}

function getFaviconUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const host = new URL(url).hostname;
    if (isExcludedDomain(host)) return null;
    return `https://www.google.com/s2/favicons?domain=${host}&sz=64`;
  } catch { return null; }
}

function getGithubAvatarUrl(githubUrl: string | null | undefined): string | null {
  if (!githubUrl) return null;
  try {
    const parts = new URL(githubUrl).pathname.split("/").filter(Boolean);
    if (parts.length > 0) return `https://github.com/${parts[0]}.png?size=64`;
  } catch {}
  return null;
}

/** Deterministic accent color from name for the initial fallback (dark-theme compatible) */
const FALLBACK_COLORS = [
  "bg-primary/15 text-primary",
  "bg-blue-500/15 text-blue-400",
  "bg-emerald-500/15 text-emerald-400",
  "bg-violet-500/15 text-violet-400",
  "bg-amber-500/15 text-amber-400",
  "bg-rose-500/15 text-rose-400",
  "bg-cyan-500/15 text-cyan-400",
  "bg-indigo-500/15 text-indigo-400",
];

function getColorClass(name: string | null | undefined): string {
  if (!name) return FALLBACK_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) | 0;
  return FALLBACK_COLORS[Math.abs(hash) % FALLBACK_COLORS.length];
}

export function ToolIcon({ url, githubUrl, name, size = 22 }: ToolIconProps) {
  const clearbit = getClearbitUrl(url);
  const favicon = getFaviconUrl(url);
  const ghAvatar = getGithubAvatarUrl(githubUrl);

  // Priority: Clearbit → Favicon → GitHub avatar
  const sources = [clearbit, favicon, ghAvatar].filter(Boolean) as string[];

  const [srcIndex, setSrcIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const s = `${size}px`;
  const colorClass = getColorClass(name);
  const src = sources[srcIndex] ?? null;

  const handleError = useCallback(() => {
    if (srcIndex < sources.length - 1) {
      setSrcIndex(srcIndex + 1);
      setLoaded(false);
    } else {
      setSrcIndex(sources.length); // triggers null fallback
    }
  }, [srcIndex, sources.length]);

  // Initial fallback (no src or all failed)
  if (!src) {
    return (
      <span
        className={`rounded-md font-bold flex items-center justify-center shrink-0 uppercase select-none ${colorClass}`}
        style={{ width: s, height: s, fontSize: `${Math.round(size * 0.42)}px` }}
        aria-hidden="true"
      >
        {name?.charAt(0) || "?"}
      </span>
    );
  }

  return (
    <span className="relative shrink-0" style={{ width: s, height: s }}>
      {/* Placeholder visible while loading */}
      {!loaded && (
        <span
          className={`absolute inset-0 rounded-md flex items-center justify-center uppercase select-none ${colorClass}`}
          style={{ fontSize: `${Math.round(size * 0.42)}px` }}
          aria-hidden="true"
        >
          {name?.charAt(0) || "?"}
        </span>
      )}
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        className={`rounded-md relative z-10 transition-opacity duration-150 ${loaded ? "opacity-100" : "opacity-0"}`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={handleError}
      />
    </span>
  );
}
