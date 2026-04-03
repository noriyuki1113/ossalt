import { Link } from "react-router-dom";
import { ArrowRight, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BottomCTA() {
  return (
    <section className="container py-16 md:py-20">
      <div className="rounded-2xl border border-primary/15 bg-primary/[0.03] p-8 md:p-14 text-center relative overflow-hidden">
        {/* Subtle bg accent */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/[0.04] rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-primary/[0.04] rounded-full blur-[80px]" />
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 text-primary bg-primary/10 rounded-full px-3 py-1 text-xs font-medium mb-5">
            <MessageSquarePlus className="h-3.5 w-3.5" />
            掲載リクエスト
          </div>

          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground mb-3">
            探しているOSSが見つかりませんか？
          </h2>
          <p className="text-sm text-muted-foreground mb-2 max-w-md mx-auto leading-relaxed">
            ツール掲載リクエストを受け付けています。
          </p>
          <p className="text-xs text-muted-foreground/70 mb-8 max-w-md mx-auto">
            ユーザーの提案でデータベースは日々成長しています
          </p>

          <Button asChild size="lg" className="rounded-xl px-8 shadow-sm">
            <Link to="/contact">
              掲載をリクエストする
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
