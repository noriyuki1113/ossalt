import { Link } from "react-router-dom";

const PILLS = [
  { slug: "notion",           label: "Notion 代替" },
  { slug: "zapier",           label: "Zapier 代替" },
  { slug: "airtable",         label: "Airtable 代替" },
  { slug: "figma",            label: "Figma 代替" },
  { slug: "slack",            label: "Slack 代替" },
  { slug: "google-analytics", label: "Google Analytics 代替" },
];

export function QuickAlternativesPills() {
  return (
    <section className="container pt-4 pb-2 min-h-[52px]">
      <div className="flex gap-2 overflow-x-auto sm:flex-wrap sm:overflow-visible -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide min-h-[34px]">
        {PILLS.map((p) => (
          <Link
            key={p.slug}
            to={`/alternatives/${p.slug}`}
            className="shrink-0 inline-flex items-center rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs font-medium text-muted-foreground hover:border-primary/50 hover:bg-primary/[0.06] hover:text-primary hover:-translate-y-0.5 transition-all duration-150"
          >
            {p.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
