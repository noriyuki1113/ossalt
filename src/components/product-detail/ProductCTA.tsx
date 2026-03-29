import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, Github } from "lucide-react";

interface Props {
  product: any;
}

export function ProductCTA({ product }: Props) {
  return (
    <section className="surface-elevated rounded-xl p-6 md:p-8 text-center">
      <h2 className="text-lg font-bold mb-2">
        {product.name}を試してみませんか？
      </h2>
      <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
        他のオープンソースツールも比較して、最適なツールを見つけましょう。
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        {product.website_url && (
          <a href={product.website_url} target="_blank" rel="noopener noreferrer">
            <Button className="rounded-xl">
              <ExternalLink className="mr-2 h-4 w-4" />公式サイトを見る
            </Button>
          </a>
        )}
        {product.github_url && (
          <a href={product.github_url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="rounded-xl">
              <Github className="mr-2 h-4 w-4" />GitHubで確認
            </Button>
          </a>
        )}
        <Link to="/alternatives">
          <Button variant="ghost" className="rounded-xl">
            代替サービス一覧 <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
