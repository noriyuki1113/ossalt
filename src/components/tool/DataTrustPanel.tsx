import { CalendarCheck, ExternalLink, Github, Info, ShieldCheck } from "lucide-react";

interface DataTrustPanelProps {
  officialUrl: string | null;
  githubUrl: string | null;
  githubUpdatedAt: string | null;
  lastCommit: string | null;
  scorecardUpdatedAt: string | null;
}

function formatDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toLocaleDateString("ja-JP");
}

export function DataTrustPanel({
  officialUrl,
  githubUrl,
  githubUpdatedAt,
  lastCommit,
  scorecardUpdatedAt,
}: DataTrustPanelProps) {
  const githubDate = formatDate(githubUpdatedAt);
  const commitDate = formatDate(lastCommit);
  const scorecardDate = formatDate(scorecardUpdatedAt);

  return (
    <section aria-label="掲載情報の根拠と確認状況" className="py-6">
      <div className="rounded-2xl border border-border bg-secondary/[0.28] p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-foreground">掲載情報の根拠と確認状況</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              OSSアルタナティブの掲載情報は、公開データと公式サイト・公式リポジトリをもとにしています。導入前には、必ず公式情報をご確認ください。
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <div className="rounded-xl border border-border/70 bg-background/70 p-3">
            <p className="text-[11px] font-medium text-foreground">公式情報</p>
            {officialUrl || githubUrl ? (
              <a
                href={officialUrl || githubUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                {officialUrl ? "公式サイトを確認" : "公式リポジトリを確認"}
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">確認中</p>
            )}
          </div>

          <div className="rounded-xl border border-border/70 bg-background/70 p-3">
            <p className="flex items-center gap-1 text-[11px] font-medium text-foreground">
              <Github className="h-3 w-3" /> GitHubデータ
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {githubDate ? <><time dateTime={githubUpdatedAt!}>{githubDate}</time> 時点で取得</> : "取得日時を準備中"}
            </p>
          </div>

          <div className="rounded-xl border border-border/70 bg-background/70 p-3">
            <p className="flex items-center gap-1 text-[11px] font-medium text-foreground">
              <CalendarCheck className="h-3 w-3" /> 更新情報
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {commitDate ? <>最終コミット: <time dateTime={lastCommit!}>{commitDate}</time></> : "最終更新情報を準備中"}
            </p>
          </div>
        </div>

        {scorecardDate && (
          <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
            <Info className="mt-0.5 h-3 w-3 shrink-0" />
            OpenSSF Scorecardの表示値は <time dateTime={scorecardUpdatedAt!}>{scorecardDate}</time> 時点の自動評価です。導入の安全性を保証するものではありません。
          </p>
        )}
      </div>
    </section>
  );
}
