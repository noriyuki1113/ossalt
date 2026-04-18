import { useState, useEffect } from "react";

export interface CompareEntry {
  slug: string;
  ossName: string;
  ossUrl: string;
  ossGithub?: string;
  saasName: string;
  saasUrl: string;
  alternativeSlug: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  verdict: string;
  comparison: {
    category: string;
    oss: string;
    saas: string;
    winner: "oss" | "saas" | "draw";
  }[];
  ossFor: string[];
  saasFor: string[];
  faq: { question: string; answer: string }[];
  relatedSlugs: string[];
}

const contentModules = import.meta.glob<{ default: CompareEntry }>(
  "/src/content/publish/compare/*.json",
  { eager: false }
);

export function useCompareContent(slug: string | undefined) {
  const [content, setContent] = useState<CompareEntry | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slug) { setContent(null); return; }
    const key = `/src/content/publish/compare/${slug}.json`;
    const loader = contentModules[key];
    if (!loader) { setContent(null); return; }
    setLoading(true);
    loader()
      .then((mod) => setContent(mod.default))
      .catch(() => setContent(null))
      .finally(() => setLoading(false));
  }, [slug]);

  return { content, loading };
}
