import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FAQBottomLinks({ onCategorySelect }: { onCategorySelect: (cat: string) => void }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-10">
      <Button
        variant="outline"
        className="rounded-xl gap-2"
        onClick={() => onCategorySelect("すべて")}
      >
        👉 人気のツールを見る
        <ArrowRight className="h-3.5 w-3.5" />
      </Button>
      <Button
        variant="outline"
        className="rounded-xl gap-2"
        onClick={() => onCategorySelect("AI・ML")}
      >
        👉 AIツール一覧へ
        <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
