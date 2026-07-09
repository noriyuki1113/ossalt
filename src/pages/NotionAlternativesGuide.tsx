import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { useSeo } from "@/hooks/use-seo";
import { CheckCircle, Star, Zap, Table2 } from "lucide-react";
import { TopPickCard } from "@/components/guides/TopPickCard";
import { PurposePicks } from "@/components/guides/PurposePicks";
import { ComparisonCard } from "@/components/guides/ComparisonCard";
import { DetailTable } from "@/components/guides/DetailTable";
import type { GuideTool, PurposePick, TopBadge } from "@/components/guides/types";

/* ───── data ───── */

const ALL_TOOLS: GuideTool[] = [
  {
    name: "Obsidian",
    slug: "obsidian",
    description: "ローカルファーストのマークダウン知識管理ツール。プラグインで無限に拡張可能。",
    shortLabel: "Markdown中心の個人PKM最強",
    tags: ["無料"],
    price: "無料（Sync有料）",
    features: ["Markdown中心", "1000+プラグイン", "ローカル保存で安心"],
    recommendedFor: "個人のナレッジ管理を極めたいエンジニア",
    rating: 5,
    difficulty: "中級",
    audience: "個人",
    website: "https://obsidian.md",
  },
  {
    name: "AppFlowy",
    slug: "appflowy",
    description: "Notionに最も近いUI/UXを持つオープンソースのワークスペース。",
    shortLabel: "Notion風OSSワークスペース",
    tags: ["OSS", "無料"],
    price: "無料（クラウド有料）",
    features: ["Notion風UI", "セルフホスト対応", "カンバン・カレンダー"],
    recommendedFor: "Notion的な体験をOSSで求めるチーム",
    rating: 5,
    difficulty: "初心者OK",
    audience: "個人・チーム",
    website: "https://appflowy.com",
    github: "https://github.com/AppFlowy-IO/AppFlowy",
  },
  {
    name: "Anytype",
    slug: "anytype",
    description: "プライバシー重視・ローカルファーストの知識管理。端末上で暗号化。",
    shortLabel: "ローカルファースト暗号化ノート",
    tags: ["OSS", "無料"],
    price: "無料",
    features: ["E2E暗号化", "ローカルファースト", "オブジェクト指向設計"],
    recommendedFor: "データ所有権とプライバシーを最優先する個人",
    rating: 4,
    difficulty: "中級",
    audience: "個人",
    website: "https://anytype.io",
    github: "https://github.com/anyproto/anytype-ts",
  },
  {
    name: "AFFiNE",
    slug: "affine",
    description: "ドキュメント・ホワイトボード・データベースを統合したOSSワークスペース。",
    shortLabel: "Docs + ホワイトボード統合",
    tags: ["OSS", "無料"],
    price: "無料（Pro有料）",
    features: ["ホワイトボード", "ブロックエディタ", "DB統合"],
    recommendedFor: "視覚的な情報整理も重視するクリエイティブワーカー",
    rating: 4,
    difficulty: "初心者OK",
    audience: "個人・チーム",
    website: "https://affine.pro",
    github: "https://github.com/toeverything/AFFiNE",
  },
  {
    name: "Outline",
    slug: "outline",
    description: "チームWiki・ナレッジベースに特化したOSS。共同編集と権限管理が強い。",
    shortLabel: "チームWiki特化OSS",
    tags: ["OSS", "無料"],
    price: "無料（クラウド有料）",
    features: ["チームWiki", "権限管理", "公開共有"],
    recommendedFor: "社内ドキュメント基盤を整備したいチーム",
    rating: 4,
    difficulty: "中級",
    audience: "チーム",
    website: "https://www.getoutline.com",
    github: "https://github.com/outline/outline",
  },
  {
    name: "Logseq",
    slug: "logseq",
    description: "アウトライナー型のローカルファーストナレッジ管理ツール。",
    shortLabel: "アウトライナー型PKM",
    tags: ["OSS", "無料"],
    price: "無料",
    features: ["アウトライナー", "グラフビュー", "ローカル保存"],
    recommendedFor: "Roam Research代替を探すリサーチャー",
    rating: 4,
    difficulty: "上級",
    audience: "個人",
    website: "https://logseq.com",
    github: "https://github.com/logseq/logseq",
  },
  {
    name: "Coda",
    slug: "coda",
    description: "ドキュメントとスプレッドシートを融合したオールインワンSaaS。",
    shortLabel: "ドキュメント×表×自動化",
    tags: ["SaaS", "無料"],
    price: "フリーミアム",
    features: ["ドキュメント＋表", "自動化ワークフロー", "豊富なテンプレ"],
    recommendedFor: "Notion的な万能ツールをSaaSで使いたい人",
    rating: 3,
    difficulty: "初心者OK",
    audience: "個人・チーム",
    website: "https://coda.io",
  },
  {
    name: "Slite",
    slug: "slite",
    description: "チーム向けのシンプルなナレッジベース。AI検索機能付き。",
    shortLabel: "AI搭載チームナレッジ",
    tags: ["SaaS"],
    price: "フリーミアム",
    features: ["AI検索", "シンプルUI", "チーム向け"],
    recommendedFor: "手軽に社内Wikiを立ち上げたい小規模チーム",
    rating: 3,
    difficulty: "初心者OK",
    audience: "チーム",
    website: "https://slite.com",
  },
  {
    name: "Craft",
    slug: "craft",
    description: "美しいデザインが特徴のドキュメントツール。Apple製品との親和性が高い。",
    shortLabel: "Apple向け美麗ドキュメント",
    tags: ["SaaS", "無料"],
    price: "フリーミアム",
    features: ["美しいUI", "Apple連携", "オフライン対応"],
    recommendedFor: "Macユーザーでデザイン重視の個人",
    rating: 3,
    difficulty: "初心者OK",
    audience: "個人",
    website: "https://www.craft.do",
  },
  {
    name: "Capacities",
    slug: "capacities",
    description: "オブジェクト指向のナレッジ管理。構造化された情報整理が得意。",
    shortLabel: "オブジェクト指向ノート",
    tags: ["SaaS", "無料"],
    price: "フリーミアム",
    features: ["オブジェクト指向", "構造化ナレッジ", "デイリーノート"],
    recommendedFor: "情報を体系的に整理したいリサーチャー",
    rating: 3,
    difficulty: "中級",
    audience: "個人",
    website: "https://capacities.io",
  },
];

const TOP_BADGES: TopBadge[] = ["BEST", "人気", "個人向け"];

const PURPOSE_PICKS: PurposePick[] = [
  { label: "とにかく無料で始めたい", toolName: "AppFlowy", slug: "appflowy", emoji: "💸" },
  { label: "個人PKM最強", toolName: "Obsidian", slug: "obsidian", emoji: "🧠" },
  { label: "Notionに最も近い", toolName: "Anytype", slug: "anytype", emoji: "🔄" },
];

/* ───── page ───── */

export default function NotionAlternativesGuide() {
  useSeo({
    title: "Notionの代替おすすめ10選【無料・OSSあり】| ossalt",
    description:
      "Notionの代替ツールを探している方向けに、無料・オープンソース・高機能なSaaSまで厳選して紹介。比較表付き。",
    canonical: "https://ossalt.jp/guides/notion-alternatives",
  });

  const top3 = ALL_TOOLS.slice(0, 3);

  return (
    <SiteLayout>
      <div className="min-h-screen bg-[hsl(220,23%,5%)] text-[hsl(220,20%,90%)]">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden border-b border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,hsl(173,58%,39%,0.15),transparent)]" />
          <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:py-28">
            <p className="mb-3 text-sm font-medium tracking-widest uppercase text-[hsl(173,58%,55%)]">
              2026年最新版
            </p>
            <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">
              Notionの代替おすすめ10選
            </h1>
            <p className="mt-3 text-lg font-medium text-[hsl(220,20%,65%)] sm:text-xl">
              無料・オープンソース・SaaSまで徹底比較
            </p>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[hsl(220,15%,50%)]">
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
          <div className="grid gap-6 sm:grid-cols-3">
            {top3.map((tool, i) => (
              <TopPickCard key={tool.slug} tool={tool} badge={TOP_BADGES[i]} rank={i + 1} />
            ))}
          </div>
        </section>

        {/* ── 目的別おすすめ ── */}
        <section className="mx-auto max-w-5xl px-4 pb-16">
          <div className="mb-6 flex items-center gap-2">
            <Zap className="h-5 w-5 text-[hsl(173,58%,50%)]" />
            <h2 className="text-xl font-bold">目的別おすすめ</h2>
          </div>
          <PurposePicks picks={PURPOSE_PICKS} />
        </section>

        {/* ── 比較カード一覧 ── */}
        <section className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="mb-8 text-2xl font-bold">全10ツール一覧</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {ALL_TOOLS.map((tool) => (
              <ComparisonCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>

        {/* ── こんな人におすすめ ── */}
        <section className="mx-auto max-w-4xl px-4 py-16">
          <h2 className="mb-8 text-center text-2xl font-bold">こんな人におすすめ</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { emoji: "✨", title: "無料で使いたい人", desc: "Obsidian・AppFlowy・Anytypeなど、無料で始められるツールが多数。まずはコストゼロで試せます。" },
              { emoji: "🖥️", title: "セルフホストしたい人", desc: "AppFlowy・Outline・AFFiNEはセルフホスト対応。データを自社管理したい組織に最適です。" },
              { emoji: "👥", title: "チームで使いたい人", desc: "Outline・AppFlowy・Sliteはチームコラボレーションに強い。権限管理や共同編集が充実しています。" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center">
                <span className="text-3xl">{item.emoji}</span>
                <h3 className="mt-3 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[hsl(220,15%,55%)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 詳細比較表 ── */}
        <section className="mx-auto max-w-5xl px-4 py-16">
          <div className="mb-6 flex items-center gap-2">
            <Table2 className="h-5 w-5 text-[hsl(220,15%,50%)]" />
            <h2 className="text-xl font-bold text-[hsl(220,15%,65%)]">詳細比較表</h2>
          </div>
          <DetailTable tools={ALL_TOOLS} />
        </section>

        {/* ── CTA ── */}
        <section className="border-t border-white/5">
          <div className="mx-auto max-w-3xl px-4 py-20 text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
              今すぐ、あなたに合ったツールを見つけよう
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[hsl(220,15%,55%)]">
              ossalt では 680+ のOSSツールを日本語で比較できます。Notion以外の代替も探してみませんか？
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[hsl(173,58%,39%)] px-6 py-3 font-semibold text-white transition hover:bg-[hsl(173,58%,34%)] active:scale-[0.98]"
              >
                <CheckCircle className="h-4 w-4" />
                無料で使えるツールを見る
              </Link>
              <Link
                to="/alternatives/notion"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/15 px-6 py-3 font-medium text-[hsl(220,20%,80%)] transition hover:bg-white/5 active:scale-[0.98]"
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
              description: "Notionの代替ツールを無料・OSS・SaaSまで厳選紹介",
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
