import { useEffect } from "react";

interface SeoProps {
  title: string;
  description?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown>;
}

const SITE_NAME = "OSSアルタナティブ";
const BASE_URL = "https://ossalt.jp";
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;

export function useSeo({ title, description, canonical, ogType = "website", ogImage, noindex = false, jsonLd }: SeoProps) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    const setMeta = (name: string, content: string, attr = "name") => {
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    if (description) {
      setMeta("description", description);
      setMeta("og:description", description, "property");
    }
    setMeta("og:title", fullTitle, "property");
    setMeta("og:type", ogType, "property");
    setMeta("og:site_name", SITE_NAME, "property");
    setMeta("og:image", ogImage || DEFAULT_OG_IMAGE, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", fullTitle);
    if (description) setMeta("twitter:description", description);
    setMeta("twitter:image", ogImage || DEFAULT_OG_IMAGE);

    // robots noindex
    if (noindex) {
      setMeta("robots", "noindex, nofollow");
    } else {
      const existingRobots = document.querySelector('meta[name="robots"]');
      if (existingRobots) existingRobots.remove();
    }

    // canonical: always use clean pathname without query params
    const canonicalUrl = canonical || `${BASE_URL}${window.location.pathname}`;
    let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonicalUrl);
    setMeta("og:url", canonicalUrl, "property");

    // JSON-LD
    let scriptEl = document.querySelector('script[data-seo-jsonld]') as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptEl) {
        scriptEl = document.createElement("script");
        scriptEl.setAttribute("type", "application/ld+json");
        scriptEl.setAttribute("data-seo-jsonld", "true");
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(jsonLd);
    } else if (scriptEl) {
      scriptEl.remove();
    }

    return () => {
      // Don't reset title on unmount — let the next page set its own title
      // This prevents brief "default title" flashes during navigation
      if (scriptEl) scriptEl.remove();
    };
  }, [title, description, canonical, ogType, ogImage, noindex, jsonLd]);
}
