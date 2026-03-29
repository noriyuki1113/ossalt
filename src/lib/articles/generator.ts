import { supabase } from "@/integrations/supabase/client";

interface GeneratedArticle {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  meta_title: string;
  meta_description: string;
  source_type: string;
  source_id: string;
}

export async function generateAlternativeArticle(alternativeId: string): Promise<GeneratedArticle> {
  const { data: alt, error } = await supabase
    .from("alternatives")
    .select("*")
    .eq("id", alternativeId)
    .single();
  if (error || !alt) throw new Error("代替ページが見つかりません");

  const { data: apData } = await supabase
    .from("alternative_products")
    .select("*, products(*)")
    .eq("alternative_id", alternativeId)
    .order("rank_order");

  const products = (apData || []).map((ap: any) => ap.products).filter(Boolean);
  const year = new Date().getFullYear();
  const count = products.length;
  const name = alt.source_name;
  const jpDesc = alt.japanese_source_description || alt.description || "";
  const productNames = products.slice(0, 3).map((p: any) => p.name).join("、");

  const title = `${name}の代替OSSおすすめ${count > 0 ? count + "選" : ""}【${year}年版】`;
  const slug = `${alt.source_slug}-alternatives`;
  const meta_title = title.length > 60 ? `${name}の代替OSSおすすめ${count}選` : title;
  const meta_description = `${name}の代替となるオープンソースツールを${count}件比較。${productNames}など、特徴・日本語対応・セルフホスト可否をわかりやすく解説します。`;
  const excerpt = `${name}の代わりに使えるオープンソース代替ツールを${count}件紹介。コスト削減やプライバシー保護に最適な選択肢を比較します。`;

  const sections: string[] = [];

  // 導入
  sections.push(`${name}は${jpDesc || "広く利用されている商用サービス"}です。\n\nこの記事では、${name}の代わりに使えるオープンソースの代替ツールを${count}件紹介します。コスト削減・プライバシー強化・セルフホスト運用を検討されている方は、ぜひ参考にしてください。`);

  // 代替とは
  sections.push(`## ${name}の代替とは？\n\n「${name}の代替」とは、${name}と同様の機能を持ちながら、オープンソースで提供されているツールのことです。ソースコードが公開されているため、透明性が高く、自社サーバーでの運用（セルフホスト）も可能です。ベンダーロックインを回避し、データの完全なコントロールを実現できます。`);

  // 選ぶポイント
  sections.push(`## ${name}の代替を選ぶポイント\n\n${name}の代替を選ぶ際は、以下のポイントを確認しましょう。\n\n- **機能の充実度**: ${name}で使っている機能が代替ツールでもカバーされているか\n- **日本語対応**: UIやドキュメントが日本語に対応しているか\n- **セルフホスト可否**: 自社サーバーで運用できるか、クラウド版があるか\n- **ライセンス**: 商用利用に問題のないライセンスか（MIT、Apache 2.0など）\n- **コミュニティの活発さ**: GitHub Starsや最終更新日を確認\n- **移行の容易さ**: データのインポート・エクスポート機能があるか`);

  // おすすめ一覧
  if (products.length > 0) {
    let listSection = `## ${name}の代替おすすめ一覧\n\n`;
    products.forEach((p: any, i: number) => {
      const features: string[] = [];
      if (p.is_open_source) features.push("オープンソース");
      if (p.is_self_hostable) features.push("セルフホスト可");
      if (p.has_cloud) features.push("クラウド版あり");
      if (p.supports_japanese) features.push("日本語対応");

      listSection += `### ${i + 1}. [${p.name}](/products/${p.slug})\n\n`;
      listSection += `${p.short_description || p.name + "はオープンソースの代替ツールです。"}\n\n`;
      if (features.length > 0) listSection += `**特徴**: ${features.join(" / ")}\n\n`;
      if (p.license) listSection += `**ライセンス**: ${p.license}`;
      if (p.github_stars > 0) listSection += ` | **GitHub Stars**: ${p.github_stars >= 1000 ? (p.github_stars / 1000).toFixed(1) + "k" : p.github_stars}`;
      listSection += "\n\n";
      if (p.best_for) listSection += `**向いている人**: ${p.best_for}\n\n`;
    });
    sections.push(listSection.trim());
  }

  // 比較表
  if (products.length > 0) {
    let table = `## 比較表\n\n| ツール名 | OSS | セルフホスト | クラウド | 日本語 | Stars | ライセンス |\n|---|---|---|---|---|---|---|\n`;
    products.forEach((p: any) => {
      const yn = (v: boolean | null) => v ? "✅" : "❌";
      const stars = p.github_stars >= 1000 ? (p.github_stars / 1000).toFixed(1) + "k" : (p.github_stars || "-");
      table += `| [${p.name}](/products/${p.slug}) | ${yn(p.is_open_source)} | ${yn(p.is_self_hostable)} | ${yn(p.has_cloud)} | ${yn(p.supports_japanese)} | ${stars} | ${p.license || "-"} |\n`;
    });
    sections.push(table.trim());
  }

  // 用途別おすすめ
  const selfHostable = products.filter((p: any) => p.is_self_hostable);
  const jpSupported = products.filter((p: any) => p.supports_japanese);
  const cloudAvail = products.filter((p: any) => p.has_cloud);

  let usageSection = `## 用途別おすすめ\n\n`;
  if (selfHostable.length > 0) usageSection += `- **セルフホストしたい方**: ${selfHostable.map((p: any) => `[${p.name}](/products/${p.slug})`).join("、")}\n`;
  if (jpSupported.length > 0) usageSection += `- **日本語で使いたい方**: ${jpSupported.map((p: any) => `[${p.name}](/products/${p.slug})`).join("、")}\n`;
  if (cloudAvail.length > 0) usageSection += `- **手軽に始めたい方**: ${cloudAvail.map((p: any) => `[${p.name}](/products/${p.slug})`).join("、")}\n`;
  sections.push(usageSection.trim());

  // FAQ
  sections.push(`## よくある質問\n\n**Q: ${name}のオープンソース代替はありますか？**\n\nはい、${count}件のオープンソース代替ツールがあります。${productNames}などが人気です。\n\n**Q: ${name}から乗り換える際の注意点は？**\n\nデータのエクスポート機能の有無、移行ツールの存在、日本語対応の状況を事前に確認してください。チームで利用する場合は無料版の制限や有料プランの価格も比較しましょう。\n\n**Q: セルフホストとクラウド版どちらがおすすめ？**\n\nデータ管理やセキュリティを重視する場合はセルフホスト、手軽に始めたい場合はクラウド版がおすすめです。`);

  // まとめ
  sections.push(`## まとめ\n\n${name}の代替として${count}件のオープンソースツールを紹介しました。${products.length >= 2 ? `${products[0].name}や${products[1].name}がとくに人気です。` : ""}\n\nセルフホストによるコスト削減やプライバシー強化を重視する方は、各ツールの詳細ページもご確認ください。最適なツールは用途やチーム規模によって異なりますので、比較表を参考に検討してみてください。\n\n---\n\n他の代替ツールも探す → [代替サービス一覧](/alternatives) | [OSSツール一覧](/products) | [カテゴリから探す](/categories)`);

  const content = sections.join("\n\n");

  return {
    title,
    slug,
    content,
    excerpt,
    meta_title,
    meta_description,
    source_type: "alternative",
    source_id: alternativeId,
  };
}
