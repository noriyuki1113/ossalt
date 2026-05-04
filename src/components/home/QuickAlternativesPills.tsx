import { Link } from "react-router-dom";

const PILLS = [
  { slug: "notion", label: "Notion 代替" },
  { slug: "zapier", label: "Zapier 代替" },
  { slug: "airtable", label: "Airtable 代替" },
  { slug: "figma", label: "Figma 代替" },
  { slug: "slack", label: "Slack 代替" },
  { slug: "google-analytics", label: "Google Analytics 代替" },
];

export function QuickAlternativesPills() {
  return (
    <section className="container pt-6 pb-2">
      <h2 className="text-xs font-semibold text-muted-foreground tracking-wide mb-3">
        人気の代替を探す
      </h2>
      <div className="flex gap-2 overflow-x-auto sm:flex-wrap sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
        {PILLS.map((p) => (
          <Link
            key={p.slug}
            to={`/alternatives/${p.slug}`}
            className="shrink-0 inline-flex items-center rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:border-primary/40 hover:bg-primary/[0.04] hover:text-primary transition-colors"
          >
            {p.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
