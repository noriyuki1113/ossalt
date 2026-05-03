import { Link } from "react-router-dom";
import { ArrowRight, Server, Cpu, Box, Globe2, TrendingUp, ExternalLink, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/hooks/use-seo";
import { AFFILIATE_REL, AFFILIATE_VPS, getAffiliateHref, type AffiliateVps } from "@/config/affiliateLinks";
import { VpsRecommendationCards } from "@/components/affiliate/VpsRecommendationCards";
import { AffiliateDisclosure } from "@/components/affiliate/AffiliateDisclosure";
import { AffiliateTrackingPixel } from "@/components/affiliate/AffiliateTrackingPixel";

const TITLE = "OSSセルフホストにおすすめのVPS比較｜n8n・AppFlowy・Baserowを動かすなら？";
const DESC = "OSSツールをセルフホストするならどのVPSを選ぶべきか。n8n、AppFlowy、Baserow、Plausibleなどを動かすためのVPS選びを初心者にもわかりやすく比較します。";
const URL = "https://ossalt.jp/selfhost-vps";

interface Vps {
  id: AffiliateVps["id"];
  name: string;
  audience: string;
  features: string;
  bestFor: string;
  href: string;
  cta: string;
  trackingImageUrl?: string;
}

const VPS_META: Record<string, { features: string; bestFor: string }> = {
  digitalocean: { features: "ドキュメント豊富、API充実、Dockerワンクリック", bestFor: "n8n / AppFlowy / Baserow" },
  vultr: { features: "キャンペーンが強く時間課金、リージョン多数", bestFor: "n8n / 軽量OSS" },
  xserver: { features: "国内サポート、Docker / WordPressテンプレ", bestFor: "AppFlowy / Baserow / WordPress系" },
  conoha: { features: "管理画面がわかりやすい、時間課金、国内データセンター", bestFor: "n8n / Metabase / 小規模OSS" },
};

const VPS_LIST: Vps[] = AFFILIATE_VPS.map((v) => ({
  id: v.id,
  name: v.name,
  audience: v.recommendedFor,
  features: VPS_META[v.id].features,
  bestFor: VPS_META[v.id].bestFor,
  href: getAffiliateHref(v),
  cta: v.ctaLabel,
  trackingImageUrl: v.trackingImageUrl,
}));

const POINTS = [
  { icon: TrendingUp, title: "料金", desc: "月額1,000円前後から。時間課金もチェック。" },
  { icon: Cpu, title: "メモリ", desc: "実運用は2GB以上が安心。複数OSS同居なら4GB〜。" },
  { icon: Box, title: "Docker対応", desc: "Docker Composeで動かせるVPSが運用ラク。" },
  { icon: Globe2, title: "日本語サポート", desc: "初心者は国内VPSの管理画面・サポートが安心。" },
  { icon: Server, title: "拡張性", desc: "後からCPU・メモリ・ストレージを増やせるか。" },
];

const RECOMMEND: { tag: string; id: AffiliateVps["id"]; name: string; href: string; trackingImageUrl?: string }[] =
  (["xserver", "digitalocean", "vultr", "conoha"] as const).map((id, i) => {
    const v = AFFILIATE_VPS.find((x) => x.id === id)!;
    const tags = ["初心者", "開発者", "安く海外VPSを試したい", "国内サービスで安心したい"];
    return { tag: tags[i], id: v.id, name: v.name, href: getAffiliateHref(v), trackingImageUrl: v.trackingImageUrl };
  });

const RELATED_TOOLS = [
  { name: "AppFlowy", desc: "Notion代替のオールインワンワークスペース", href: "/tools/185" },
  { name: "n8n", desc: "Zapier代替のワークフロー自動化", href: "/tools/415" },
  { name: "Baserow", desc: "Airtable代替のノーコードDB", href: "/tools/217" },
  { name: "Plausible Analytics", desc: "Google Analytics代替の軽量解析", href: "/tools/340" },
  { name: "Metabase", desc: "Tableau代替のBIダッシュボード", href: "/tools/358" },
  { name: "Supabase代替を探す", desc: "Firebase代替のBaaS群を比較", href: "/alternatives/firebase" },
];

const FAQ = [
  { q: "OSSセルフホストにVPSは必要ですか？", a: "必須ではありませんが、n8nやAppFlowyなどを常時稼働させたい場合はVPSが便利です。" },
  { q: "初心者におすすめのVPSは？", a: "日本語サポートを重視するならXserver VPSやConoHa VPS、開発者向けならDigitalOceanが候補です。" },
  { q: "メモリはどれくらい必要ですか？", a: "軽量なOSSなら1GBでも試せますが、実運用では2GB以上を推奨します。" },
  { q: "Dockerは必要ですか？", a: "多くのOSSツールはDocker Composeでの導入が簡単なため、Docker対応のVPSを選ぶと運用しやすくなります。" },
];

export default function SelfHostVps() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: TITLE,
        description: DESC,
        mainEntityOfPage: URL,
        author: { "@type": "Organization", name: "OSSアルタナティブ" },
        publisher: { "@type": "Organization", name: "OSSアルタナティブ" },
        datePublished: "2026-05-03",
        dateModified: "2026-05-03",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "ホーム", item: "https://ossalt.jp/" },
          { "@type": "ListItem", position: 2, name: "OSSセルフホストVPS比較", item: URL },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQ.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  useSeo({ title: TITLE, description: DESC, canonical: URL, ogType: "article", jsonLd });

  return (
    <SiteLayout>
      {/* Breadcrumb */}
      <div className="container pt-4">
        <nav className="text-xs text-muted-foreground flex items-center gap-1">
          <Link to="/" className="hover:text-foreground">ホーム</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">OSSセルフホストVPS比較</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="container py-10 md:py-14">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
            <Server className="h-3.5 w-3.5" /> セルフホストガイド
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            OSSセルフホストにおすすめのVPS比較
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            Notion代替、Zapier代替、Airtable代替などのOSSツールを自分のサーバーで動かすためのVPS選びを解説します。
          </p>
          <div className="mt-6">
            <Button asChild size="lg">
              <a href="#vps-list">
                おすすめVPSを見る <ArrowRight className="ml-1 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="container pb-10">
        <div className="card-unified p-6 md:p-8 max-w-3xl">
          <h2 className="text-xl font-semibold text-foreground mb-3">なぜVPSが必要なのか</h2>
          <ul className="space-y-2 text-sm text-muted-foreground leading-relaxed list-disc pl-5">
            <li>OSSツールは無料で使えますが、セルフホストする場合は動かすサーバーが必要です。</li>
            <li>VPSを使えば、月額コストを抑えつつ、複数のOSSツールを1台にまとめて運用できます。</li>
            <li>SaaSのユーザー数課金から解放され、データを自分の管理下に置けるのも大きなメリットです。</li>
          </ul>
        </div>
      </section>

      {/* Points */}
      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-5">VPSを選ぶポイント</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {POINTS.map((p) => (
            <div key={p.title} className="card-unified p-5">
              <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <p.icon className="h-4 w-4 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground">{p.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section id="vps-list" className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-5">VPS比較</h2>

        {/* Mobile: card list */}
        <div className="md:hidden space-y-4">
          {VPS_LIST.map((v) => (
            <div key={v.name} className="card-unified p-5">
              <h3 className="text-lg font-semibold text-foreground">{v.name}</h3>
              <p className="text-xs text-primary mt-0.5">{v.audience}</p>
              <dl className="mt-3 space-y-2 text-sm">
                <div>
                  <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">特徴</dt>
                  <dd className="text-foreground">{v.features}</dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wider text-muted-foreground">向いているOSS</dt>
                  <dd className="text-foreground">{v.bestFor}</dd>
                </div>
              </dl>
              <Button asChild className="mt-4 w-full min-h-[44px]">
                <a href={v.href} target="_blank" rel={AFFILIATE_REL}>
                  {v.cta} <ExternalLink className="ml-1 h-3.5 w-3.5" />
                </a>
              </Button>
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden md:block card-unified overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">VPS名</th>
                <th className="px-4 py-3">おすすめユーザー</th>
                <th className="px-4 py-3">特徴</th>
                <th className="px-4 py-3">向いているOSS</th>
                <th className="px-4 py-3 text-right">CTA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {VPS_LIST.map((v) => (
                <tr key={v.name} className="hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-4 font-semibold text-foreground">{v.name}</td>
                  <td className="px-4 py-4 text-muted-foreground">{v.audience}</td>
                  <td className="px-4 py-4 text-muted-foreground">{v.features}</td>
                  <td className="px-4 py-4 text-muted-foreground">{v.bestFor}</td>
                  <td className="px-4 py-4 text-right">
                    <Button asChild size="sm">
                      <a href={v.href} target="_blank" rel={AFFILIATE_REL}>
                        {v.cta} <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* VPS recommendation cards (affiliate) */}
      <VpsRecommendationCards
        heading="用途別おすすめVPS"
        description="ここまで紹介したVPSを、用途別にカード形式でまとめました。気になるVPSの公式サイトから詳細を確認できます。"
      />
      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-5">ossalt.jp的おすすめ結論</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {RECOMMEND.map((r) => (
            <a
              key={r.tag}
              href={r.href}
              target="_blank"
              rel={AFFILIATE_REL}
              className="card-unified p-5 flex items-center justify-between gap-3 hover:border-primary/40 transition-colors group"
            >
              <div>
                <p className="text-xs text-muted-foreground">{r.tag}なら</p>
                <p className="text-lg font-semibold text-foreground mt-0.5">{r.name}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          ))}
        </div>
      </section>

      {/* Related OSS */}
      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-5">関連OSSツール</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RELATED_TOOLS.map((t) => (
            <Link
              key={t.href}
              to={t.href}
              className="card-unified p-4 hover:border-primary/40 transition-colors group"
            >
              <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{t.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">{t.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-5">よくある質問</h2>
        <div className="space-y-3 max-w-3xl">
          {FAQ.map((f) => (
            <details key={f.q} className="card-unified p-5 group">
              <summary className="cursor-pointer font-semibold text-foreground list-none flex items-center justify-between gap-2">
                {f.q}
                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-90" />
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Related guides */}
      <section className="container pb-10">
        <h2 className="text-2xl font-bold text-foreground mb-5">関連ガイド</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
          <Link
            to="/guides/n8n-selfhost-vps"
            className="card-unified p-5 hover:border-primary/40 transition-colors group"
          >
            <p className="text-xs text-primary mb-1">セルフホストガイド</p>
            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
              n8nをVPSでセルフホストする方法
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Zapier代替のn8nを自分のサーバーで動かす基本構成と注意点
            </p>
          </Link>
          <Link
            to="/guides/appflowy-selfhost-vps"
            className="card-unified p-5 hover:border-primary/40 transition-colors group"
          >
            <p className="text-xs text-primary mb-1">セルフホストガイド</p>
            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
              AppFlowyをVPSでセルフホストする方法
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Notion代替のAppFlowyを自分のサーバーで動かす構成と運用ポイント
            </p>
          </Link>
          <Link
            to="/guides/baserow-selfhost-vps"
            className="card-unified p-5 hover:border-primary/40 transition-colors group"
          >
            <p className="text-xs text-primary mb-1">セルフホストガイド</p>
            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
              BaserowをVPSでセルフホストする方法
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Airtable代替のBaserowを自分のサーバーで動かす構成と運用ポイント
            </p>
          </Link>
          <Link
            to="/guides/plausible-selfhost-vps"
            className="card-unified p-5 hover:border-primary/40 transition-colors group"
          >
            <p className="text-xs text-primary mb-1">セルフホストガイド</p>
            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
              PlausibleをVPSでセルフホストする方法
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Google Analytics代替のPlausibleを自分のサーバーで動かす構成と注意点
            </p>
          </Link>
        </div>
      </section>

      {/* Affiliate disclosure */}
      <section className="container pb-12">
        <AffiliateDisclosure />
      </section>
    </SiteLayout>
  );
}
