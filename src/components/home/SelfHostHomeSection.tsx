import { Link } from "react-router-dom";
import { Server, ArrowRight } from "lucide-react";

export function SelfHostHomeSection() {
  return (
    <section className="container py-10 md:py-14">
      <div className="card-unified p-6 md:p-8 max-w-3xl mx-auto">
        <div className="flex items-center gap-2 text-xs text-primary mb-2">
          <Server className="h-3.5 w-3.5" />
          <span>セルフホスト</span>
        </div>
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
          セルフホストできるOSS
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          自分のサーバーで運用できるOSSもあります。n8n、AppFlowy、Baserowなどをセルフホストしたい場合は、基本的な運用環境も確認しておきましょう。
        </p>
        <Link
          to="/selfhost-vps"
          className="inline-flex items-center gap-1 mt-4 text-sm text-primary hover:underline font-medium"
        >
          セルフホストガイドを見る <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
