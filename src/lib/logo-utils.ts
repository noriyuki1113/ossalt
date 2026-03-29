/**
 * Product logo URL resolution utilities.
 * Priority: manual logo_url → github-readme → github-avatar → favicon → null (fallback to initials)
 */

export function getFaviconUrl(websiteUrl: string | null | undefined): string | null {
  if (!websiteUrl) return null;
  try {
    const hostname = new URL(websiteUrl).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
  } catch {
    return null;
  }
}

export function getGitHubAvatarUrl(githubUrl: string | null | undefined): string | null {
  if (!githubUrl) return null;
  try {
    const parts = new URL(githubUrl).pathname.split("/").filter(Boolean);
    if (parts.length >= 1) {
      return `https://github.com/${parts[0]}.png?size=128`;
    }
  } catch {
    // ignore
  }
  return null;
}

export function getInitials(name: string): string {
  return name.charAt(0).toUpperCase();
}

export interface ProductLogoInput {
  name: string;
  logo_url?: string | null;
  logo_github_readme_url?: string | null;
  logo_github_avatar_url?: string | null;
  logo_favicon_url?: string | null;
  website_url?: string | null;
  github_url?: string | null;
}

/**
 * Returns an ordered list of candidate image URLs for the product logo.
 * The consumer should try each in order; if all fail, show initials.
 */
export function getLogoUrlCandidates(product: ProductLogoInput): string[] {
  const candidates: string[] = [];

  // 1. Manual / best logo
  if (product.logo_url) candidates.push(product.logo_url);

  // 2. GitHub README logo
  if (product.logo_github_readme_url && product.logo_github_readme_url !== product.logo_url) {
    candidates.push(product.logo_github_readme_url);
  }

  // 3. GitHub avatar (stored or generated)
  if (product.logo_github_avatar_url) {
    candidates.push(product.logo_github_avatar_url);
  } else {
    const ghAvatar = getGitHubAvatarUrl(product.github_url);
    if (ghAvatar) candidates.push(ghAvatar);
  }

  // 4. Favicon (stored or generated)
  if (product.logo_favicon_url) {
    candidates.push(product.logo_favicon_url);
  } else {
    const favicon = getFaviconUrl(product.website_url);
    if (favicon) candidates.push(favicon);
  }

  // Deduplicate
  return [...new Set(candidates)];
}

/**
 * Returns the best single logo URL (first candidate), or null.
 */
export function getProductLogoUrl(product: ProductLogoInput): string | null {
  const candidates = getLogoUrlCandidates(product);
  return candidates[0] || null;
}
