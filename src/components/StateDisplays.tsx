import { Loader2, SearchX, AlertCircle } from "lucide-react";

export function LoadingState({ message = "読み込み中..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin mb-3" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

export function EmptyState({ title, description, icon }: { title: string; description?: string; icon?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {icon || <SearchX className="h-10 w-10 text-muted-foreground/40 mb-3" />}
      <p className="text-lg font-semibold text-foreground">{title}</p>
      {description && <p className="mt-1 text-sm text-muted-foreground max-w-md">{description}</p>}
    </div>
  );
}

export function ErrorState({ message = "データの取得に失敗しました" }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <AlertCircle className="h-10 w-10 text-destructive/60 mb-3" />
      <p className="text-lg font-semibold text-destructive">エラー</p>
      <p className="mt-1 text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
