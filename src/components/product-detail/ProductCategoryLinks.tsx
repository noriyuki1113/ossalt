import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface Props {
  categories: any[];
  tags?: any[];
}

export function ProductCategoryLinks({ categories, tags }: Props) {
  if (!categories.length && !(tags?.length)) return null;

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">関連カテゴリ</h2>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat: any) => (
          <Link key={cat.id} to={`/categories/${cat.slug}`}>
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 text-sm py-1.5 px-4 transition-colors">
              {cat.japanese_name || cat.name}
            </Badge>
          </Link>
        ))}
        {tags?.map((tag: any) => (
          <Badge key={tag.id} variant="secondary" className="text-sm py-1.5 px-4">
            {tag.name}
          </Badge>
        ))}
      </div>
    </section>
  );
}
