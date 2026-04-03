import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BottomCTA() {
  return (
    <section className="container py-14">
      <div className="rounded-2xl border border-border bg-card p-8 md:p-12 text-center">
        <h2 className="text-lg md:text-xl font-bold tracking-tight text-foreground mb-2">
          探しているOSSが見つかりませんか？
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          ツール掲載リクエストを受け付けています
        </p>
        <Button asChild size="lg" className="rounded-xl px-8">
          <Link to="/contact">
            掲載をリクエストする
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>
    </section>
  );
}
