import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, RotateCcw, Star, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteLayout } from "@/components/SiteLayout";
import { useSeo } from "@/hooks/use-seo";
import type { Tool } from "@/hooks/use-tools";

/* ── Step definitions ── */

interface StepDef {
  title: string;
  multi?: boolean;
  options: { icon: string; label: string; value: string }[];
}

const STEPS: StepDef[] = [
  {
    title: "職種を教えてください",
    options: [
      { icon: "👨‍💻", label: "エンジニア・開発者", value: "engineer" },
      { icon: "🎨", label: "デザイナー", value: "designer" },
      { icon: "📊", label: "マーケター・営業", value: "marketer" },
      { icon: "🏢", label: "経営者・スタートアップ", value: "business" },
      { icon: "📝", label: "コンテンツクリエイター", value: "creator" },
      { icon: "🔧", label: "ITインフラ担当", value: "infra" },
    ],
  },
  {
    title: "何を解決したいですか？",
    options: [
      { icon: "💬", label: "チームのコミュニケーション", value: "communication" },
      { icon: "📋", label: "プロジェクト・タスク管理", value: "project" },
      { icon: "📈", label: "データ分析・可視化", value: "analytics" },
      { icon: "🤖", label: "AI・自動化", value: "ai" },
      { icon: "💾", label: "ファイル・データ管理", value: "storage" },
      { icon: "🔒", label: "セキュリティ・認証", value: "security" },
      { icon: "💰", label: "請求・決済", value: "billing" },
      { icon: "🛒", label: "ECサイト構築", value: "ecommerce" },
    ],
  },
  {
    title: "重視することは？",
    multi: true,
    options: [
      { icon: "🆓", label: "完全無料で使いたい", value: "free" },
      { icon: "🏠", label: "自社サーバーで運用したい", value: "selfhost" },
      { icon: "⚡", label: "すぐ使い始めたい", value: "quick" },
      { icon: "🔧", label: "カスタマイズしたい", value: "custom" },
      { icon: "👥", label: "チームで使いたい", value: "team" },
    ],
  },
  {
    title: "今使っている有料ツールは？",
    multi: true,
    options: [
      { icon: "📝", label: "Notion / Slack / Figma / Jira", value: "productivity" },
      { icon: "📊", label: "Salesforce / HubSpot", value: "crm" },
      { icon: "☁️", label: "AWS / GCP / Azure", value: "cloud" },
      { icon: "🎨", label: "Adobe / Canva", value: "design" },
      { icon: "🛒", label: "Shopify / Stripe", value: "commerce" },
      { icon: "❌", label: "特になし", value: "none" },
    ],
  },
];

/* ── Mapping logic ── */

const ROLE_TO_CATEGORY: Record<string, string[]> = {
  engineer: ["開発者ツール", "AI・機械学習", "インフラ・運用"],
  designer: ["コンテンツ・パブリッシング", "生産性・ユーティリティ"],
  marketer: ["ビジネスソフトウェア", "データ・分析"],
  business: ["ビジネスソフトウェア", "生産性・ユーティリティ"],
  creator: ["コンテンツ・パブリッシング", "AI・機械学習"],
  infra: ["インフラ・運用", "セキュリティ・プライバシー"],
};

const PROBLEM_TO_CATEGORY: Record<string, string[]> = {
  communication: ["コミュニティ・ソーシャル", "ビジネスソフトウェア"],
  project: ["ビジネスソフトウェア", "生産性・ユーティリティ"],
  analytics: ["データ・分析", "ビジネスソフトウェア"],
  ai: ["AI・機械学習"],
  storage: ["インフラ・運用", "生産性・ユーティリティ"],
  security: ["セキュリティ・プライバシー"],
  billing: ["ビジネスソフトウェア"],
  ecommerce: ["ビジネスソフトウェア", "コンテンツ・パブリッシング"],
};

const TOOL_TO_COMPETITOR: Record<string, string[]> = {
  productivity: ["Notion", "Slack", "Figma", "Jira"],
  crm: ["Salesforce", "HubSpot"],
  cloud: ["Firebase", "Auth0"],
  design: ["Figma", "Canva"],
  commerce: ["Shopify", "Stripe Billing"],
};

function getFaviconUrl(url: string | null): string | null {
  if (!url) return null;
  try {
    return `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`;
  } catch {
    return null;
  }
}

function formatStars(num: number | null): string {
  if (!num) return "0";
  if (num >= 1000) return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(num);
}

/* ── Component ── */

export default function QuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [showResults, setShowResults] = useState(false);

  useSeo({
    title: "私に合うOSSを診断 | OSSアルタナティブ",
    description: "質問に答えるだけであなたに最適なオープンソースツールが見つかる診断ツール。",
    canonical: "https://find-my-alt.lovable.app/quiz",
  });

  const currentStep = STEPS[step];
  const isMulti = currentStep?.multi;

  const handleSelect = (value: string) => {
    if (isMulti) {
      setAnswers((prev) => {
        const current = prev[step] || [];
        const next = current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value];
        return { ...prev, [step]: next };
      });
    } else {
      setAnswers((prev) => ({ ...prev, [step]: [value] }));
      // Auto-advance for single-select
      if (step < STEPS.length - 1) {
        setTimeout(() => setStep((s) => s + 1), 200);
      } else {
        setTimeout(() => setShowResults(true), 200);
      }
    }
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setShowResults(false);
  };

  // Build query filters from answers
  const roleAnswer = answers[0]?.[0];
  const problemAnswer = answers[1]?.[0];
  const toolAnswers = answers[3] || [];

  const targetCategories = [
    ...(roleAnswer ? ROLE_TO_CATEGORY[roleAnswer] || [] : []),
    ...(problemAnswer ? PROBLEM_TO_CATEGORY[problemAnswer] || [] : []),
  ];
  const uniqueCategories = [...new Set(targetCategories)];

  const targetCompetitors = toolAnswers.flatMap(
    (t) => TOOL_TO_COMPETITOR[t] || []
  );

  const { data: results, isLoading } = useQuery({
    queryKey: ["quiz-results", uniqueCategories, targetCompetitors],
    queryFn: async () => {
      // Strategy: try competitor match first, then category match
      let tools: Tool[] = [];

      if (targetCompetitors.length > 0) {
        const { data } = await supabase
          .from("tools")
          .select("*")
          .in("primary_competitor", targetCompetitors)
          .order("stars_num", { ascending: false, nullsFirst: false })
          .limit(5);
        if (data) tools = data as Tool[];
      }

      if (tools.length < 5 && uniqueCategories.length > 0) {
        const existingIds = tools.map((t) => t.id);
        const { data } = await supabase
          .from("tools")
          .select("*")
          .in("parent_category_ja", uniqueCategories)
          .not("id", "in", `(${existingIds.length > 0 ? existingIds.join(",") : "0"})`)
          .order("stars_num", { ascending: false, nullsFirst: false })
          .limit(5 - tools.length);
        if (data) tools = [...tools, ...(data as Tool[])];
      }

      // Fallback: top starred
      if (tools.length < 3) {
        const existingIds = tools.map((t) => t.id);
        const { data } = await supabase
          .from("tools")
          .select("*")
          .not("id", "in", `(${existingIds.length > 0 ? existingIds.join(",") : "0"})`)
          .order("stars_num", { ascending: false, nullsFirst: false })
          .limit(5 - tools.length);
        if (data) tools = [...tools, ...(data as Tool[])];
      }

      return tools;
    },
    enabled: showResults,
  });

  const matchLabels = ["⭐⭐⭐ 最適", "⭐⭐ おすすめ", "⭐ 候補"];

  if (showResults) {
    return (
      <SiteLayout>
        <div className="container max-w-3xl mx-auto px-4 pt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            ツール一覧に戻る
          </Link>
        </div>

        <div className="container max-w-3xl mx-auto px-4 py-8 animate-fade-in">
          <div className="text-center mb-8">
            <Sparkles className="h-10 w-10 text-badge-amber mx-auto mb-3" />
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              あなたにおすすめのOSSはこちら！
            </h1>
            <p className="mt-2 text-muted-foreground">
              回答に基づいて最適なツールを選びました
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border bg-card p-6 animate-pulse">
                  <div className="h-6 w-48 bg-muted rounded mb-3" />
                  <div className="h-4 w-full bg-muted rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {results?.map((tool, i) => {
                const favicon = getFaviconUrl(tool.url);
                const matchIndex = Math.min(i, 2);
                return (
                  <Link
                    key={tool.id}
                    to={`/tools/${tool.id}`}
                    className={`block rounded-xl border p-5 transition-all hover:-translate-y-0.5 animate-fade-in ${
                      i === 0
                        ? "bg-card border-primary/30 shadow-lg shadow-primary/5"
                        : "bg-card card-glow"
                    }`}
                    style={{
                      animationDelay: `${i * 100}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {favicon ? (
                          <img
                            src={favicon}
                            alt=""
                            width={24}
                            height={24}
                            className="rounded shrink-0"
                            loading="lazy"
                          />
                        ) : (
                          <span className="h-6 w-6 rounded bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center shrink-0 uppercase">
                            {tool.name?.charAt(0) || "?"}
                          </span>
                        )}
                        <h3 className="font-semibold text-lg truncate">
                          {tool.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          className={`text-xs ${
                            i === 0
                              ? "bg-badge-amber/15 text-badge-amber border-badge-amber/30"
                              : i === 1
                              ? "bg-primary/15 text-primary border-primary/30"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {matchLabels[matchIndex]}
                        </Badge>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {tool.description_ja || tool.description_en || "説明なし"}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      {tool.parent_category_ja && (
                        <Badge variant="secondary" className="text-xs">
                          {tool.parent_category_ja}
                        </Badge>
                      )}
                      {tool.stars_num != null && tool.stars_num > 0 && (
                        <Badge className="gap-1 text-xs bg-badge-amber/15 text-badge-amber border-badge-amber/30">
                          <Star className="h-3 w-3 fill-current" />
                          {formatStars(tool.stars_num)}
                        </Badge>
                      )}
                      {tool.primary_competitor_ja && (
                        <span className="text-xs text-muted-foreground">
                          {tool.primary_competitor_ja}の代替
                        </span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
            <Button
              variant="outline"
              className="gap-2 rounded-xl"
              onClick={handleReset}
            >
              <RotateCcw className="h-4 w-4" />
              もう一度診断する
            </Button>
            <Button className="gap-2 rounded-xl" asChild>
              <Link to="/">全ツールを見る</Link>
            </Button>
          </div>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="container max-w-3xl mx-auto px-4 pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          ツール一覧に戻る
        </Link>
      </div>

      <div className="container max-w-2xl mx-auto px-4 py-8 animate-fade-in">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <p className="text-sm text-muted-foreground mb-2">
          ステップ {step + 1} / {STEPS.length}
        </p>
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight mb-6">
          {currentStep.title}
        </h1>

        {/* Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentStep.options.map((opt) => {
            const selected = answers[step]?.includes(opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value)}
                className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all hover:-translate-y-0.5 ${
                  selected
                    ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                    : "bg-card card-glow"
                }`}
              >
                <span className="text-2xl shrink-0">{opt.icon}</span>
                <span className="font-medium text-sm">{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="ghost"
            className="gap-1.5"
            onClick={handleBack}
            disabled={step === 0}
          >
            <ArrowLeft className="h-4 w-4" />
            戻る
          </Button>

          {isMulti && (
            <Button
              className="gap-1.5 rounded-xl"
              onClick={handleNext}
              disabled={!answers[step]?.length}
            >
              {step === STEPS.length - 1 ? "結果を見る" : "次へ"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
