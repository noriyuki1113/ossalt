import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Layers, RefreshCw, Inbox } from "lucide-react";

export default function AdminDashboard() {
  const { data: counts } = useQuery({
    queryKey: ["admin-counts"],
    queryFn: async () => {
      const [products, categories, alternatives, submissions] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("categories").select("*", { count: "exact", head: true }),
        supabase.from("alternatives").select("*", { count: "exact", head: true }),
        supabase.from("submissions").select("*", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      return {
        products: products.count || 0,
        categories: categories.count || 0,
        alternatives: alternatives.count || 0,
        pendingSubmissions: submissions.count || 0,
      };
    },
  });

  const { data: recentProducts } = useQuery({
    queryKey: ["admin-recent-products"],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("id, name, status, updated_at").order("updated_at", { ascending: false }).limit(5);
      return data || [];
    },
  });

  const stats = [
    { label: "プロダクト", value: counts?.products || 0, icon: Package, href: "/admin/products" },
    { label: "カテゴリ", value: counts?.categories || 0, icon: Layers, href: "/admin/categories" },
    { label: "代替ページ", value: counts?.alternatives || 0, icon: RefreshCw, href: "/admin/alternatives" },
    { label: "未対応申請", value: counts?.pendingSubmissions || 0, icon: Inbox, href: "/admin/submissions" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} to={s.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <s.icon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{s.value}</p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">最近更新されたプロダクト</CardTitle></CardHeader>
        <CardContent>
          {(recentProducts || []).length === 0 ? (
            <p className="text-sm text-muted-foreground">データがありません</p>
          ) : (
            <div className="space-y-2">
              {recentProducts?.map((p) => (
                <Link key={p.id} to={`/admin/products/${p.id}`} className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-accent/50 transition-colors">
                  <span className="font-medium text-sm">{p.name}</span>
                  <span className="text-xs text-muted-foreground">{new Date(p.updated_at).toLocaleDateString("ja-JP")}</span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
