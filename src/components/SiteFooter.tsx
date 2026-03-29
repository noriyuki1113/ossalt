export function SiteFooter() {
  return (
    <footer className="border-t bg-card/50 mt-auto">
      <div className="container py-8 text-center text-sm text-muted-foreground">
        <p className="font-medium text-foreground">OSSアルタナティブ</p>
        <p className="mt-1">オープンソースで自由を</p>
        <p className="mt-3 text-xs">© {new Date().getFullYear()} OSSアルタナティブ</p>
      </div>
    </footer>
  );
}
