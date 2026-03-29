import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="border-t bg-secondary/30 mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="font-display text-lg font-bold text-gradient">AltFinder.jp</Link>
            <p className="mt-2 text-sm text-muted-foreground">日本語で探す、最適な代替サービス比較サイト</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">サービス</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/tools" className="hover:text-foreground transition-colors">ツール一覧</Link></li>
              <li><Link to="/categories" className="hover:text-foreground transition-colors">カテゴリ</Link></li>
              <li><Link to="/alternatives" className="hover:text-foreground transition-colors">代替サービス</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">サイト情報</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-colors">お問い合わせ</Link></li>
              <li><Link to="/submit" className="hover:text-foreground transition-colors">掲載申請</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">法的情報</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/privacy" className="hover:text-foreground transition-colors">プライバシーポリシー</Link></li>
              <li><Link to="/terms" className="hover:text-foreground transition-colors">利用規約</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} AltFinder.jp All rights reserved.
        </div>
      </div>
    </footer>
  );
}
