import { Globe, Code2, Server } from "lucide-react";

const PROPS = [
  { icon: Globe, text: "日本語で探せる" },
  { icon: Code2, text: "OSS限定" },
  { icon: Server, text: "セルフホスト対応" },
];

export function ValueProps() {
  return (
    <div className="flex items-center justify-center gap-6 md:gap-10 flex-wrap">
      {PROPS.map(({ icon: Icon, text }) => (
        <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
          <Icon className="h-4 w-4 text-primary shrink-0" />
          <span>{text}</span>
        </div>
      ))}
    </div>
  );
}
