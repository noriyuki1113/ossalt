import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Package, Layers, Tag, RefreshCw, Inbox } from "lucide-react";

export default function AdminDashboard() {
  const { data: counts } = useQuery({
    queryKey: ["admin-counts"],
    queryFn: async () => {
      const [products, categories, tags, alternatives, submissions] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("categories").select("*", { count: "exact", head: true }),
        supabase.from("tags").select("*", { count: "exact", head: true }),
        supabase.from("alternatives").select("*", { count: "exact", head: true }),
        supabase.from("submissions").select("*", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      return {
        products: products.count || 0,
        categories: categories.count || 0,
        tags: tags.count || 0,
        alternatives: alternatives.count || 0,
        pendingSubmissions: submissions.count || 0,
      };
    },
  });

  const stats = [
    { label: "プロダクト", value: counts?.products || 0, icon: Package },
    { label: "カテゴリ", value: counts?.categories || 0, icon: Layers },
    { label: "タグ", value: counts?.tags || 0, icon: Tag },
    { label: "代替ページ", value: counts?.alternatives || 0, icon: RefreshCw },
    { label: "未対応申請", value: counts?.pendingSubmissions || 0, icon: Inbox },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">ダッシュボード</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="surface-elevated rounded-lg p-5">
            <div className="flex items-center gap-3">
              <s.icon className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
