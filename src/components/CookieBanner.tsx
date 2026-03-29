import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "cookie-consent-accepted";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 animate-fade-in">
      <div className="container max-w-2xl mx-auto rounded-xl border bg-card p-4 shadow-lg flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <p className="text-sm text-muted-foreground flex-1">
          このサイトはGoogle Analyticsを使用しています。
          詳細は
          <Link to="/privacy" className="text-primary hover:underline mx-1">
            プライバシーポリシー
          </Link>
          をご確認ください。
        </p>
        <div className="flex gap-2 shrink-0">
          <Button size="sm" onClick={accept}>
            同意する
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link to="/privacy">詳細を見る</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
