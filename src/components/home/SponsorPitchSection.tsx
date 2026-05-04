import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export function SponsorPitchSection() {
  return (
    <section className="container py-12">
      <div className="card-unified p-6 md:p-8 max-w-3xl mx-auto text-center">
        <h2 className="text-xl md:text-2xl font-bold mb-3">
          このカテゴリのOSSベンダーの方へ
        </h2>
        <p className="text-sm md:text-base text-muted-foreground mb-5 leading-relaxed">
          ossalt.jp では、スポンサー掲載・タイアップ記事のご相談を受け付けています。
        </p>
        <Button asChild size="lg" className="gap-2 rounded-xl">
          <Link to="/sponsor">
            <Mail className="h-4 w-4" />
            掲載について見る
          </Link>
        </Button>
      </div>
    </section>
  );
}
