interface Props {
  className?: string;
}

export function AffiliateDisclosure({ className = "" }: Props) {
  return (
    <p
      className={`text-xs text-muted-foreground/80 max-w-3xl border-t border-border/60 pt-4 ${className}`}
    >
      この記事にはアフィリエイトリンクが含まれる場合があります。ただし、掲載内容はossalt.jpの編集方針に基づいて選定しています。
    </p>
  );
}
