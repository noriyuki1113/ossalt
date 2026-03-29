import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface Props {
  name: string;
  relatedAlts: any[];
}

export function ProductRelatedAlternatives({ name, relatedAlts }: Props) {
  if (!relatedAlts.length) return null;

  return (
    <section>
      <h2 className="text-xl font-bold mb-2">このツールは何の代替？</h2>
      <p className="text-sm text-muted-foreground mb-4">
        {name}が代替候補として紹介されているサービスの一覧です。
      </p>
      <div className="flex flex-wrap gap-2">
        {relatedAlts.map((alt: any) => (
          <Link key={alt.source_slug} to={`/alternatives/${alt.source_slug}`}>
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-primary/10 text-sm py-2 px-4 transition-colors"
            >
              {alt.source_name}の代替 <ArrowRight className="ml-1.5 h-3 w-3" />
            </Badge>
          </Link>
        ))}
      </div>
    </section>
  );
}
