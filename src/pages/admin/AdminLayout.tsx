import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/StateDisplays";
import { LayoutDashboard, Package, Layers, Tag, RefreshCw, Inbox, LogOut, Download, History } from "lucide-react";

const adminLinks = [
  { href: "/admin", label: "ダッシュボード", icon: LayoutDashboard },
  { href: "/admin/products", label: "プロダクト", icon: Package },
  { href: "/admin/categories", label: "カテゴリ", icon: Layers },
  { href: "/admin/tags", label: "タグ", icon: Tag },
  { href: "/admin/alternatives", label: "代替ページ", icon: RefreshCw },
  { href: "/admin/submissions", label: "掲載申請", icon: Inbox },
  { href: "/admin/imports", label: "データ取り込み", icon: Download },
  { href: "/admin/scrape-runs", label: "実行ログ", icon: History },
];

export default function AdminLayout() {
  const { isAdmin, loading, signOut, user } = useAuth();
  const navigate = useNavigate();

  if (loading) return <LoadingState />;
  if (!user) {
    navigate("/admin/login");
    return null;
  }
  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">アクセス権限がありません</h1>
          <p className="mt-2 text-muted-foreground">管理者アカウントでログインしてください</p>
          <Button variant="outline" className="mt-4" onClick={() => { signOut(); navigate("/admin/login"); }}>ログアウト</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 border-r bg-card p-4 flex flex-col">
        <Link to="/" className="font-display text-lg font-bold text-gradient mb-6">AltFinder.jp</Link>
        <nav className="flex-1 space-y-1">
          {adminLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
        <Button variant="ghost" size="sm" onClick={signOut} className="justify-start">
          <LogOut className="mr-2 h-4 w-4" />ログアウト
        </Button>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
