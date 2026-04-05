import { useState, useEffect } from "react";
import type { AlternativePageContent } from "@/types/alternatives";

/**
 * Lazily loads editorial JSON for an alternatives page slug.
 * Returns null if no JSON exists for the slug (page falls back to DB-only).
 */

const contentModules = import.meta.glob<{ default: AlternativePageContent }>(
  "/src/content/publish/alternatives/*.json",
  { eager: false }
);

export function useAlternativeContent(slug: string | undefined) {
  const [content, setContent] = useState<AlternativePageContent | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slug) {
      setContent(null);
      return;
    }

    const key = `/src/content/publish/alternatives/${slug}.json`;
    const loader = contentModules[key];

    if (!loader) {
      setContent(null);
      return;
    }

    setLoading(true);
    loader()
      .then((mod) => setContent(mod.default))
      .catch(() => setContent(null))
      .finally(() => setLoading(false));
  }, [slug]);

  return { content, loading };
}
