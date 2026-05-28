import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";

const GUIDES = [
  { to: "/guides/mattermost-selfhost-vps", title: "MattermostをVPSでセルフホストする方法", desc: "Slack代替のチームチャットを内製化" },
  { to: "/guides/outline-selfhost-vps", title: "OutlineをVPSでセルフホストする方法", desc: "Confluence/Notion代替のナレッジベース" },
  { to: "/guides/vikunja-selfhost-vps", title: "VikunjaをVPSでセルフホストする方法", desc: "Asana/Todoist代替の軽量タスク管理" },
  { to: "/guides/plane-selfhost-vps", title: "PlaneをVPSでセルフホストする方法", desc: "Jira代替のプロジェクト管理" },
];

export function NewGuidesSection() {
  if (GUIDES.length < 3) return null;
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
