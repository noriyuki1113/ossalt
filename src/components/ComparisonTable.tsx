import { Link } from "react-router-dom";
import { Check, X, Star } from "lucide-react";
import { DifficultyBadge } from "@/components/ProductCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ComparisonProduct {
  id: string;
  slug: string;
  name: string;
  is_open_source?: boolean | null;
  is_self_hostable?: boolean | null;
  has_cloud?: boolean | null;
  supports_japanese?: boolean | null;
  github_stars?: number | null;
  license?: string | null;
  self_host_difficulty?: string | null;
}

export function ComparisonTable({ products }: { products: ComparisonProduct[] }) {
  if (!products.length) return null;

  const formatStars = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
  const BoolCell = ({ value }: { value: boolean | null | undefined }) => (
    value ? <Check className="h-4 w-4 text-accent mx-auto" /> : <X className="h-4 w-4 text-muted-foreground/40 mx-auto" />
  );

  return (
    <div className="overflow-x-auto surface-elevated rounded-xl">
      <Table>
        <TableHeader>
          <TableRow className="bg-secondary/50">
            <TableHead className="min-w-[160px] font-semibold">ツール名</TableHead>
            <TableHead className="text-center font-semibold">OSS</TableHead>
            <TableHead className="text-center font-semibold">セルフホスト</TableHead>
            <TableHead className="text-center font-semibold">Cloud</TableHead>
            <TableHead className="text-center font-semibold">日本語</TableHead>
            <TableHead className="text-center font-semibold">難易度</TableHead>
            <TableHead className="font-semibold">ライセンス</TableHead>
            <TableHead className="text-right font-semibold">Stars</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p) => (
            <TableRow key={p.id} className="hover:bg-secondary/30">
              <TableCell>
                <Link to={`/products/${p.slug}`} className="font-medium text-primary hover:underline">
                  {p.name}
                </Link>
              </TableCell>
              <TableCell className="text-center"><BoolCell value={p.is_open_source} /></TableCell>
              <TableCell className="text-center"><BoolCell value={p.is_self_hostable} /></TableCell>
              <TableCell className="text-center"><BoolCell value={p.has_cloud} /></TableCell>
              <TableCell className="text-center"><BoolCell value={p.supports_japanese} /></TableCell>
              <TableCell className="text-center"><DifficultyBadge difficulty={p.self_host_difficulty} /></TableCell>
              <TableCell className="text-xs text-muted-foreground">{p.license || "—"}</TableCell>
              <TableCell className="text-right">
                {(p.github_stars ?? 0) > 0 ? (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-current" />
                    {formatStars(p.github_stars!)}
                  </span>
                ) : "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
