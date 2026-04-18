export interface GuideTool {
  name: string;
  slug: string;
  description: string;
  shortLabel: string; // 20文字以内
  tags: ("OSS" | "無料" | "SaaS")[];
  price: string;
  features: string[]; // 3つまで
  recommendedFor: string;
  rating: 1 | 2 | 3 | 4 | 5;
  difficulty: "初心者OK" | "中級" | "上級";
  audience: "個人" | "チーム" | "個人・チーム";
  website: string;
  github?: string;
}

export interface PurposePick {
  label: string;
  toolName: string;
  slug: string;
  emoji: string;
}

export type TopBadge = "BEST" | "人気" | "個人向け" | "チーム向け";
