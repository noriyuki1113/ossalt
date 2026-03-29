import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FilterBarProps {
  japaneseOnly: boolean;
  setJapaneseOnly: (v: boolean) => void;
  ossOnly: boolean;
  setOssOnly: (v: boolean) => void;
  selfHostOnly: boolean;
  setSelfHostOnly: (v: boolean) => void;
  cloudOnly: boolean;
  setCloudOnly: (v: boolean) => void;
}

export function FilterBar({ japaneseOnly, setJapaneseOnly, ossOnly, setOssOnly, selfHostOnly, setSelfHostOnly, cloudOnly, setCloudOnly }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 surface-elevated rounded-lg">
      <div className="flex items-center gap-2">
        <Switch id="jp" checked={japaneseOnly} onCheckedChange={setJapaneseOnly} />
        <Label htmlFor="jp" className="text-sm cursor-pointer">🇯🇵 日本語対応のみ</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="oss" checked={ossOnly} onCheckedChange={setOssOnly} />
        <Label htmlFor="oss" className="text-sm cursor-pointer">OSSのみ</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="sh" checked={selfHostOnly} onCheckedChange={setSelfHostOnly} />
        <Label htmlFor="sh" className="text-sm cursor-pointer">セルフホスト可</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="cloud" checked={cloudOnly} onCheckedChange={setCloudOnly} />
        <Label htmlFor="cloud" className="text-sm cursor-pointer">Cloud利用可</Label>
      </div>
    </div>
  );
}
