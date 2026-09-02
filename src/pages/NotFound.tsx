import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSeo } from "@/hooks/use-seo";

const NotFound = () => {
  const location = useLocation();

  useSeo({
    title: "ページが見つかりません（404）",
    description: "お探しのページは存在しないか、移動した可能性があります。",
    noindex: true,
  });

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">ページが見つかりません</p>
        <Link to="/" className="text-primary underline hover:text-primary/90">
          トップページに戻る
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
