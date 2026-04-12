import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { useSeo } from "@/hooks/use-seo";
import { ExternalLink, Github, Star, CheckCircle, Users, Server, Sparkles } from "lucide-react";

/* ───── data ───── */

interface Tool {
  name: string;
  slug: string;
  description: string;
  tags: ("OSS" | "無料" | "SaaS")[];
  price: string;
  feature: string;
  recommendedFor: string;
  website: string;
  github?: string;
}

const TOP_PICKS: Tool[] = [
  {
    name: "Obsidian",
    slug: "obsidian",
    description: "ローカルファーストのマークダウン知識管理ツール。プラグインで無限に拡張可能。",
    tags: ["無料"],
    price: "無料（Sync有料）",
    feature: "Markdown中心、プラグインエコシステム",
    recommendedFor: "個人のナレッジ管理を極めたいエンジニア",
    website: "https://obsidian.md",
  },
  {
    name: "AppFlowy",
    slug: "appflowy",
    description: "Notionに最も近いUI/UXを持つオープンソースのワークスペース。",
    tags: ["OSS", "無料"],
    price: "無料（クラウド有料）",
    feature: "Notion風UI、セルフホスト対応",
    recommendedFor: "Notion的な体験をOSSで求めるチーム",
    website: "https://appflowy.com",
    github: "https://github.com/AppFlowy-IO/AppFlowy",
  },
  {
    name: "Anytype",
    slug: "anytype",
    description: "プライバシー重視・ローカルファーストの知識管理。端末上で暗号化。",
    tags: ["OSS", "無料"],
    price: "無料",
    feature: "ローカルファースト、E2E暗号化",
    recommendedFor: "データ所有権とプライバシーを最優先する個人",
    website: "https://anytype.io",
    github: "https://github.com/anyproto/anytype-ts",
  },
];

const ALL_TOOLS: Tool[] = [
  ...TOP_PICKS,
  {
    name: "AFFiNE",
    slug: "affine",
    description: "ドキュメント・ホワイトボード・データベースを統合したOSSワークスペース。",
    tags: ["OSS", "無料"],
    price: "無料（Pro有料）",
    feature: "Docs + Whiteboard + DB",
    recommendedFor: "視覚的な情報整理も重視するクリエイティブワーカー",
    website: "https://affine.pro",
    github: "https://github.com/toeverything/AFFiNE",
  },
  {
    name: "Outline",
    slug: "outline",
    description: "チームWiki・ナレッジベースに特化したOSS。共同編集と権限管理が強い。",
    tags: ["OSS", "無料"],
    price: "無料（クラウド有料）",
    feature: "チームWiki、権限管理、公開共有",
    recommendedFor: "社内ドキュメント基盤を整備したいチーム",
    website: "https://www.getoutline.com",
    github: "https://github.com/outline/outline",
  },
  {
    name: "Logseq",
    slug: "logseq",
    description: "アウトライナー型のローカルファーストナレッジ管理ツール。",
    tags: ["OSS", "無料"],
    price: "無料",
    feature: "アウトライナー、グラフビュー、ローカル保存",
    recommendedFor: "Roam Research代替を探すリサーチャー",
    website: "https://logseq.com",
    github: "https://github.com/logseq/logseq",
  },
  {
    name: "Coda",
    slug: "coda",
    description: "ドキュメントとスプレッドシートを融合したオールインワンSaaS。",
    tags: ["SaaS", "無料"],
    price: "フリーミアム",
    feature: "ドキュメント＋表＋自動化",
    recommendedFor: "Notion的な万能ツールをSaaSで使いたい人",
    website: "https://coda.io",
  },
  {
    name: "Slite",
    slug: "slite",
    description: "チーム向けのシンプルなナレッジベース。AI検索機能付き。",
    tags: ["SaaS"],
    price: "フリーミアム",
    feature: "AI検索、シンプルなエディタ",
    recommendedFor: "手軽に社内Wikiを立ち上げたい小規模チーム",
    website: "https://slite.com",
  },
  {
    name: "Craft",
    slug: "craft",
    description: "美しいデザインが特徴のドキュメントツール。Apple製品との親和性が高い。",
    tags: ["SaaS", "無料"],
    price: "フリーミアム",
    feature: "美しいUI、Apple連携、オフライン対応",
    recommendedFor: "Macユーザーでデザイン重視の個人",
    website: "https://www.craft.do",
  },
  {
    name: "Capacities",
    slug: "capacities",
    description: "オブジェクト指向のナレッジ管理。構造化された情報整理が得意。",
    tags: ["SaaS", "無料"],
    price: "フリーミアム",
    feature: "オブジェクト指向、構造化ナレッジ",
    recommendedFor: "情報を体系的に整理したいリサーチャー",
    website: "https://capacities.io",
  },
];

const TAG_STYLES: Record<string, string> = {
  OSS: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  "無料": "bg-sky-500/20 text-sky-300 border-sky-500/30",
  SaaS: "bg-violet-500/20 text-violet-300 border-violet-500/30",
};

/* ───── component ───── */

export default function NotionAlternativesGuide() {
  useSeo({
    title: "Notionの代替おすすめ10選【無料・OSSあり】| ossalt",
    description:
      "Notionの代替ツールを探している方向けに、無料・オープンソース・高機能なSaaSまで厳選して紹介。比較表付き。",
  });

  return (
    <SiteLayout>
      <div className="min-h-screen bg-[hsl(220,20%,8%)] text-[hsl(220,20%,90%)]">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-gradient-to-br from-[hsl(173,58%,39%,0.12)] via-transparent to-[hsl(210,100%,52%,0.08)]" />
          <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:py-28">
            <p className="mb-3 text-sm font-medium tracking-widest uppercase text-[hsl(173,58%,55%)]">
              2026年最新版
            </p>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">
              Notionの代替おすすめ10選
            </h1>
            <p className="mt-3 text-lg font-medium text-[hsl(220,20%,70%)] sm:text-xl">
              無料・オープンソース・SaaSまで徹底比較
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[hsl(220,15%,60%)]">
              Notionの代替ツールを探している方向けに、無料・オープンソース・高機能なSaaSまで厳選して紹介します。用途別に比較できるので、あなたに最適なツールが見つかります。
            </p>
          </div>
        </section>

        {/* ── Top 3 ── */}
        <section className="mx-auto max-w-5xl px-4 py-16">
          <div className="mb-10 flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-400" />
            <h2 className="text-2xl font-bold">Top 3 おすすめ</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TOP_PICKS.map((tool, i) => (
              <div
                key={tool.slug}
                className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur transition hover:border-[hsl(173,58%,39%,0.4)] hover:bg-white/[0.06]"
              >
                <span className="absolute -top-3 left-4 rounded-full bg-[hsl(173,58%,39%)] px-3 py-0.5 text-xs font-bold text-white">
                  #{i + 1}
                </span>
                <h3 className="mt-2 text-xl font-bold">{tool.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[hsl(220,15%,60%)]">
                  {tool.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {tool.tags.map((t) => (
                    <span
                      key={t}
                      className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${TAG_STYLES[t]}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[hsl(173,58%,39%)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[hsl(173,58%,34%)]"
                  >
                    無料で試す <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  {tool.github && (
                    <a
                      href={tool.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-[hsl(220,20%,80%)] transition hover:bg-white/5"
                    >
                      <Github className="h-3.5 w-3.5" /> GitHub
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Comparison Table ── */}
        <section className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="mb-8 text-2xl font-bold">比較表</h2>
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.04] text-left text-xs uppercase tracking-wider text-[hsl(220,15%,55%)]">
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">ツール名</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">タイプ</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">価格</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">特徴</th>
                  <th className="whitespace-nowrap px-4 py-3 font-semibold">おすすめユーザー</th>
                </tr>
              </thead>
              <tbody>
                {ALL_TOOLS.map((tool, i) => (
                  <tr
                    key={tool.slug}
                    className={`border-b border-white/5 transition hover:bg-white/[0.03] ${
                      i < 3 ? "bg-[hsl(173,58%,39%,0.04)]" : ""
                    }`}
                  >
                    <td className="whitespace-nowrap px-4 py-3 font-medium">{tool.name}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {tool.tags.map((t) => (
                          <span
                            key={t}
                            className={`rounded border px-1.5 py-0.5 text-[10px] font-medium ${TAG_STYLES[t]}`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[hsl(220,15%,60%)]">{tool.price}</td>
                    <td className="px-4 py-3 text-[hsl(220,15%,60%)]">{tool.feature}</td>
                    <td className="px-4 py-3 text-[hsl(220,15%,60%)]">{tool.recommendedFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Full List ── */}
        <section className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="mb-8 text-2xl font-bold">全10ツール一覧</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {ALL_TOOLS.map((tool) => (
              <div
                key={tool.slug}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-bold">{tool.name}</h3>
                  <div className="flex gap-1">
                    {tool.tags.map((t) => (
                      <span
                        key={t}
                        className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${TAG_STYLES[t]}`}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="mt-2 text-sm text-[hsl(220,15%,60%)]">{tool.description}</p>
                <div className="mt-4 flex gap-2">
                  <a
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-medium transition hover:bg-white/15"
                  >
                    公式サイト <ExternalLink className="h-3 w-3" />
                  </a>
                  {tool.github && (
                    <a
                      href={tool.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium transition hover:bg-white/5"
                    >
                      <Github className="h-3 w-3" /> GitHub
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── こんな人におすすめ ── */}
        <section className="mx-auto max-w-4xl px-4 py-16">
          <h2 className="mb-8 text-center text-2xl font-bold">こんな人におすすめ</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                icon: <Sparkles className="h-6 w-6 text-amber-400" />,
                title: "無料で使いたい人",
                desc: "Obsidian・AppFlowy・Anytypeなど、無料で始められるツールが多数。まずはコストゼロで試せます。",
              },
              {
                icon: <Server className="h-6 w-6 text-emerald-400" />,
                title: "セルフホストしたい人",
                desc: "AppFlowy・Outline・AFFiNEはセルフホスト対応。データを自社管理したい組織に最適です。",
              },
              {
                icon: <Users className="h-6 w-6 text-sky-400" />,
                title: "チームで使いたい人",
                desc: "Outline・AppFlowy・Sliteはチームコラボレーションに強い。権限管理や共同編集が充実しています。",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center"
              >
                <div className="mb-3 flex justify-center">{item.icon}</div>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[hsl(220,15%,60%)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="border-t border-white/5">
          <div className="mx-auto max-w-3xl px-4 py-20 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
              今すぐ、あなたに合ったツールを見つけよう
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[hsl(220,15%,60%)]">
              ossalt では 680+ のOSSツールを日本語で比較できます。Notion以外の代替も探してみませんか？
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl bg-[hsl(173,58%,39%)] px-6 py-3 font-semibold text-white transition hover:bg-[hsl(173,58%,34%)]"
              >
                <CheckCircle className="h-4 w-4" />
                無料で使えるツールを見る
              </Link>
              <Link
                to="/alternatives/notion"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-6 py-3 font-medium text-[hsl(220,20%,80%)] transition hover:bg-white/5"
              >
                Notion代替一覧を見る
              </Link>
            </div>
          </div>
        </section>

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Notionの代替おすすめ10選",
              description:
                "Notionの代替ツールを無料・OSS・SaaSまで厳選紹介",
              numberOfItems: ALL_TOOLS.length,
              itemListElement: ALL_TOOLS.map((t, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: t.name,
                url: t.website,
              })),
            }),
          }}
        />
      </div>
    </SiteLayout>
  );
}
