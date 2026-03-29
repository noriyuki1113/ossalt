import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    status: string;
    published_at?: string | null;
    created_at: string;
  };
}

export function ArticleCard({ article }: ArticleCardProps) {
  const date = article.published_at || article.created_at;
  return (
    <Link to={`/articles/${article.slug}`} className="block">
      <div className="surface-elevated rounded-xl p-5 hover:shadow-md transition-shadow h-full flex flex-col">
        <h3 className="font-bold text-lg leading-snug line-clamp-2">{article.title}</h3>
        {article.excerpt && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3 flex-1">{article.excerpt}</p>
        )}
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" />
          {new Date(date).toLocaleDateString("ja-JP")}
        </div>
      </div>
    </Link>
  );
}
