import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PageBackTop() {
  return (
    <div className="container max-w-3xl mx-auto px-4 pt-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        ホームに戻る
      </Link>
    </div>
  );
}

export function PageBackBottom() {
  return (
    <div className="container max-w-3xl mx-auto px-4 pb-12 pt-6 flex justify-center">
      <Button variant="outline" className="gap-2 rounded-xl" asChild>
        <Link to="/">
          <ArrowLeft className="h-4 w-4" />
          ホームに戻る
        </Link>
      </Button>
    </div>
  );
}
