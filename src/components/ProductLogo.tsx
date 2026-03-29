import { useState, useCallback } from "react";
import { getLogoUrlCandidates, getInitials, type ProductLogoInput } from "@/lib/logo-utils";
import { cn } from "@/lib/utils";

type LogoSize = "sm" | "md" | "lg" | "xl";

interface ProductLogoProps {
  name: string;
  logoUrl?: string | null;
  logoGithubReadmeUrl?: string | null;
  logoGithubAvatarUrl?: string | null;
  logoFaviconUrl?: string | null;
  websiteUrl?: string | null;
  githubUrl?: string | null;
  size?: LogoSize;
  className?: string;
}

const sizeMap: Record<LogoSize, { container: string; img: string; text: string }> = {
  sm: { container: "h-8 w-8 rounded-lg", img: "h-5 w-5", text: "text-xs" },
  md: { container: "h-10 w-10 rounded-xl", img: "h-7 w-7", text: "text-sm" },
  lg: { container: "h-14 w-14 rounded-xl", img: "h-10 w-10", text: "text-xl" },
  xl: { container: "h-20 w-20 rounded-2xl", img: "h-14 w-14", text: "text-3xl" },
};

export function ProductLogo({
  name,
  logoUrl,
  logoGithubReadmeUrl,
  logoGithubAvatarUrl,
  logoFaviconUrl,
  websiteUrl,
  githubUrl,
  size = "md",
  className,
}: ProductLogoProps) {
  const input: ProductLogoInput = {
    name,
    logo_url: logoUrl,
    logo_github_readme_url: logoGithubReadmeUrl,
    logo_github_avatar_url: logoGithubAvatarUrl,
    logo_favicon_url: logoFaviconUrl,
    website_url: websiteUrl,
    github_url: githubUrl,
  };
  const candidates = getLogoUrlCandidates(input);

  const [candidateIndex, setCandidateIndex] = useState(0);
  const [allFailed, setAllFailed] = useState(candidates.length === 0);

  const currentUrl = candidates[candidateIndex];
  const s = sizeMap[size];

  const handleError = useCallback(() => {
    if (candidateIndex + 1 < candidates.length) {
      setCandidateIndex((prev) => prev + 1);
    } else {
      setAllFailed(true);
    }
  }, [candidateIndex, candidates.length]);

  return (
    <div
      className={cn(
        s.container,
        "bg-secondary border border-border flex items-center justify-center shrink-0 overflow-hidden",
        className
      )}
    >
      {!allFailed && currentUrl ? (
        <img
          src={currentUrl}
          alt={`${name}のロゴ`}
          className={cn(s.img, "object-contain")}
          loading="lazy"
          onError={handleError}
        />
      ) : (
        <span className={cn(s.text, "font-bold text-muted-foreground select-none")}>
          {getInitials(name)}
        </span>
      )}
    </div>
  );
}
