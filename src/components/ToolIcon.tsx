import { useState } from "react";

interface ToolIconProps {
  url?: string | null;
  githubUrl?: string | null;
  name?: string | null;
  size?: number;
}

function getFaviconUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try { return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`; }
  catch { return null; }
}

function getGithubAvatarUrl(githubUrl: string | null | undefined): string | null {
  if (!githubUrl) return null;
  try {
    const parts = new URL(githubUrl).pathname.split("/").filter(Boolean);
    if (parts.length > 0) return `https://github.com/${parts[0]}.png?size=64`;
  } catch {}
  return null;
}

export function ToolIcon({ url, githubUrl, name, size = 22 }: ToolIconProps) {
  const favicon = getFaviconUrl(url);
  const ghAvatar = getGithubAvatarUrl(githubUrl);
  const [src, setSrc] = useState<string | null>(favicon || ghAvatar);
  const s = `${size}px`;

  if (!src) {
    return (
      <span
        className="rounded-md bg-secondary text-muted-foreground font-bold flex items-center justify-center shrink-0 uppercase"
        style={{ width: s, height: s, fontSize: `${Math.round(size * 0.45)}px` }}
      >
        {name?.charAt(0) || "?"}
      </span>
    );
  }

  return (
    <img
      src={src} alt="" width={size} height={size}
      className="rounded-md shrink-0 bg-secondary" loading="lazy"
      onError={() => {
        if (src === favicon && ghAvatar) setSrc(ghAvatar);
        else setSrc(null);
      }}
    />
  );
}
