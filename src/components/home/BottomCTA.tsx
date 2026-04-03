import { CTASection } from "@/components/CTASection";

export function BottomCTA() {
  return (
    <CTASection
      title="探しているOSSが見つかりませんか？"
      subtitle="ツール掲載リクエストを受け付けています。"
      note="ユーザーの提案でデータベースは日々成長しています"
      buttonText="掲載をリクエストする"
      buttonTo="/contact"
    />
  );
}
