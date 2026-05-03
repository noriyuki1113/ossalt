import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const GUIDES = [
  { to: "/guides/n8n-selfhost-vps", title: "n8nをVPSでセルフホストする方法", desc: "Zapier代替のn8nを自分のサーバーで動かす基本構成" },
  { to: "/guides/appflowy-selfhost-vps", title: "AppFlowyをVPSでセルフホストする方法", desc: "Notion代替のAppFlowyの構成と運用ポイント" },
  { to: "/guides/baserow-selfhost-vps", title: "BaserowをVPSでセルフホストする方法", desc: "Airtable代替のBaserowの構成と運用ポイント" },
  { to: "/guides/plausible-selfhost-vps", title: "PlausibleをVPSでセルフホストする方法", desc: "Google Analytics代替のPlausibleの構成と注意点" },
];

export function NewGuidesSection() {
  return (
    <section className="container py-10 md:py-14">
      <div className="flex items-center gap-2 mb-5">
        <BookOpen className="h-4 w-4 text-primary" />
        <h2 className="text-base md:text-lg font-bold text-foreground tracking-tight">
          新着ガイド
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {GUIDES.map((g) => (
          <Link
            key={g.to}
            to={g.to}
            className="card-unified p-4 hover:border-primary/40 transition-colors group"
          >
            <p className="text-xs text-primary mb-1">セルフホストガイド</p>
            <p className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">
              {g.title}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{g.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
