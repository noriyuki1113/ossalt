import { Globe, Lock, Code2, Zap, GitFork, Users, HardDrive, Shield, Settings, BarChart2, MessageSquare, FileText } from "lucide-react";
import type { Tool } from "@/hooks/use-tools";

interface Feature {
  icon: typeof Globe;
  label: string;
}

function getFeatures(tool: Tool): Feature[] {
  const cat = (tool.parent_category_ja || "").toLowerCase();
  const stars = tool.stars_num || 0;
  const forks = tool.forks_num || 0;
  const features: Feature[] = [];

  // Universal OSS features
  features.push({ icon: Code2, label: "オープンソース・無料で利用可能" });
  features.push({ icon: HardDrive, label: "セルフホストでデータを完全管理" });

  // Category-specific
  if (cat.includes("ai")) {
    features.push({ icon: Lock, label: "プライベートデータを外部送信しない" });
    features.push({ icon: Settings, label: "モデル・パラメータを自由にカスタマイズ" });
    features.push({ icon: Zap, label: "APIエンドポイントとして統合可能" });
  } else if (cat.includes("開発")) {
    features.push({ icon: GitFork, label: "既存CI/CDパイプラインと連携" });
    features.push({ icon: Zap, label: "WebhookやAPIで拡張可能" });
    features.push({ icon: Shield, label: "セキュリティポリシーを自社で制御" });
  } else if (cat.includes("インフラ")) {
    features.push({ icon: BarChart2, label: "メトリクス・アラートを自由に設定" });
    features.push({ icon: Globe, label: "マルチクラウド・オンプレ対応" });
    features.push({ icon: Settings, label: "プラグインで機能を拡張" });
  } else if (cat.includes("データ")) {
    features.push({ icon: BarChart2, label: "カスタムダッシュボードを構築" });
    features.push({ icon: Globe, label: "複数データソースへの接続" });
    features.push({ icon: Shield, label: "データを外部に出さずに分析" });
  } else if (cat.includes("コンテンツ")) {
    features.push({ icon: FileText, label: "コンテンツ管理を完全にカスタマイズ" });
    features.push({ icon: Globe, label: "Headless CMSとして利用可能" });
    features.push({ icon: Settings, label: "プラグイン・テーマで拡張" });
  } else if (cat.includes("セキュリティ")) {
    features.push({ icon: Shield, label: "認証・認可ポリシーを自社で管理" });
    features.push({ icon: Lock, label: "監査ログを自社サーバーに保持" });
    features.push({ icon: Settings, label: "コンプライアンス要件に合わせてカスタマイズ" });
  } else if (cat.includes("コミュニティ")) {
    features.push({ icon: MessageSquare, label: "コミュニケーションデータを自社保有" });
    features.push({ icon: Users, label: "無制限のユーザー・チャンネル" });
    features.push({ icon: Settings, label: "봇・インテグレーションを自由に追加" });
  } else {
    features.push({ icon: Users, label: "チーム・組織規模に合わせてスケール" });
    features.push({ icon: Settings, label: "ワークフローを自由にカスタマイズ" });
    features.push({ icon: Globe, label: "REST API・Webhookで外部連携" });
  }

  // Add community signal if prominent
  if (stars > 10000) {
    features.push({ icon: GitFork, label: `GitHubで${forks > 0 ? forks.toLocaleString() + "以上のフォーク" : "活発なコントリビュータ"}` });
  }

  // Deduplicate and limit
  const seen = new Set<string>();
  const unique: Feature[] = [];
  for (const f of features) {
    if (!seen.has(f.label)) {
      seen.add(f.label);
      unique.push(f);
    }
    if (unique.length >= 6) break;
  }
  return unique;
}

export function KeyFeaturesList({ tool }: { tool: Tool }) {
  const features = getFeatures(tool);

  return (
    <section className="py-8">
      <h2 className="text-lg font-bold text-foreground mb-4">主な特徴</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3">
            <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <f.icon className="h-3.5 w-3.5 text-primary" />
            </div>
            <span className="text-sm text-foreground">{f.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
