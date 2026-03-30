import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Check, Copy, ExternalLink, Star, Twitter } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CountUp } from "@/components/CountUp";
import { useSeo } from "@/hooks/use-seo";
import { toast } from "sonner";

interface SaasItem {
  name: string;
  monthlyPerUser: number;
  ossName: string;
  ossStars: string;
  ossSlug: string;
}

const SAAS_LIST: SaasItem[] = [
  { name: "Notion", monthlyPerUser: 16, ossName: "AppFlowy", ossStars: "69K", ossSlug: "appflowy" },
  { name: "Slack", monthlyPerUser: 15, ossName: "Mattermost", ossStars: "36K", ossSlug: "mattermost" },
  { name: "Figma", monthlyPerUser: 15, ossName: "Penpot", ossStars: "45K", ossSlug: "penpot" },
  { name: "Jira", monthlyPerUser: 10, ossName: "Plane", ossStars: "54K", ossSlug: "plane" },
  { name: "GitHub Copilot", monthlyPerUser: 19, ossName: "Continue", ossStars: "32K", ossSlug: "continue" },
  { name: "Salesforce", monthlyPerUser: 75, ossName: "Twenty", ossStars: "24K", ossSlug: "twenty" },
  { name: "HubSpot", monthlyPerUser: 50, ossName: "Erxes", ossStars: "8K", ossSlug: "erxes" },
  { name: "Zendesk", monthlyPerUser: 55, ossName: "Chatwoot", ossStars: "22K", ossSlug: "chatwoot" },
  { name: "Airtable", monthlyPerUser: 20, ossName: "NocoDB", ossStars: "63K", ossSlug: "nocodb" },
  { name: "Typeform", monthlyPerUser: 25, ossName: "Formbricks", ossStars: "11K", ossSlug: "formbricks" },
  { name: "DocuSign", monthlyPerUser: 30, ossName: "Documenso", ossStars: "9K", ossSlug: "documenso" },
  { name: "Zoom", monthlyPerUser: 15, ossName: "Jitsi", ossStars: "23K", ossSlug: "jitsi" },
  { name: "Dropbox", monthlyPerUser: 15, ossName: "Nextcloud", ossStars: "34K", ossSlug: "nextcloud" },
  { name: "1Password", monthlyPerUser: 8, ossName: "Bitwarden", ossStars: "18K", ossSlug: "bitwarden" },
  { name: "Webflow", monthlyPerUser: 39, ossName: "WebStudio", ossStars: "8K", ossSlug: "webstudio" },
  { name: "Retool", monthlyPerUser: 10, ossName: "ToolJet", ossStars: "38K", ossSlug: "tooljet" },
  { name: "Datadog", monthlyPerUser: 34, ossName: "Grafana", ossStars: "73K", ossSlug: "grafana" },
  { name: "Mailchimp", monthlyPerUser: 20, ossName: "Listmonk", ossStars: "15K", ossSlug: "listmonk" },
  { name: "Calendly", monthlyPerUser: 12, ossName: "Cal.com", ossStars: "33K", ossSlug: "cal-com" },
  { name: "Loom", monthlyPerUser: 12, ossName: "Cap", ossStars: "18K", ossSlug: "cap" },
];

const JPY_RATE = 150;

function getServerMonthly(teamSize: number): number {
  if (teamSize <= 10) return 5000;
  if (teamSize <= 50) return 10000;
  if (teamSize <= 100) return 20000;
  return 30000;
}

function formatJPY(n: number): string {
  return "¥" + n.toLocaleString("ja-JP");
}

export default function SavingsPage() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [teamSize, setTeamSize] = useState(10);
  const [copied, setCopied] = useState(false);

  useSeo({
    title: "SaaS→OSS コスト削減シミュレーター",
    description:
      "NotionやSlackなど有料SaaSをOSSに切り替えた場合の年間節約額を無料で計算。チーム規模に合わせた最適なOSSスタックをご提案。",
    canonical: "https://ossalt.jp/savings",
  });

  const toggle = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const results = useMemo(() => {
    const selectedItems = SAAS_LIST.filter((s) => selected.has(s.name));
    const monthlyUSD = selectedItems.reduce((sum, s) => sum + s.monthlyPerUser, 0);
    const monthlyJPY = monthlyUSD * JPY_RATE * teamSize;
    const yearlyJPY = monthlyJPY * 12;
    const serverMonthly = getServerMonthly(teamSize);
    const serverYearly = serverMonthly * 12;
    const savings = yearlyJPY - serverYearly;
    return { selectedItems, monthlyJPY, yearlyJPY, serverMonthly, serverYearly, savings };
  }, [selected, teamSize]);

  const hasSelection = selected.size > 0;

  const currentStep = !hasSelection ? 1 : teamSize > 0 ? 3 : 2;
  const progressValue = !hasSelection ? 25 : 100;

  const shareText = () => {
    const lines = [
      "有料SaaSをOSSに切り替えたら",
      `年間${formatJPY(Math.max(results.savings, 0))}円節約できることがわかった💰`,
      "",
      ...results.selectedItems.map((s) => `${s.name}→${s.ossName}`),
      "",
      "#OSS #コスト削減 #おすすめツール",
      "ossalt.jp/savings",
    ];
    return lines.join("\n");
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(shareText());
    setCopied(true);
    toast.success("コピーしました");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTweet = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText())}`;
    window.open(url, "_blank");
  };

  return (
    <SiteLayout>
      <div className="container max-w-3xl py-10 md:py-16 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-gradient">
            有料SaaSをOSSに切り替えたら
            <br />
            年間いくら節約できる？
          </h1>
          <p className="text-muted-foreground">
            現在使っているツールを選んで、節約額を計算しよう
          </p>
        </div>

        {/* Progress */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className={currentStep >= 1 ? "text-primary font-medium" : ""}>① SaaS選択</span>
            <span className={currentStep >= 2 ? "text-primary font-medium" : ""}>② 人数入力</span>
            <span className={currentStep >= 3 ? "text-primary font-medium" : ""}>③ 結果</span>
          </div>
          <Progress value={progressValue} className="h-2" />
        </div>

        {/* Step 1 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Step 1: 使っている有料SaaSを選択</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAAS_LIST.map((saas) => (
                <label
                  key={saas.name}
                  className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition-colors ${
                    selected.has(saas.name)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <Checkbox
                    checked={selected.has(saas.name)}
                    onCheckedChange={() => toggle(saas.name)}
                  />
                  <span className="flex-1 text-sm font-medium">{saas.name}</span>
                  <span className="text-xs text-muted-foreground">${saas.monthlyPerUser}/月</span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Step 2: チーム人数を入力</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Slider
                value={[teamSize]}
                onValueChange={([v]) => setTeamSize(v)}
                min={1}
                max={500}
                step={1}
                className="flex-1"
              />
              <Input
                type="number"
                min={1}
                max={500}
                value={teamSize}
                onChange={(e) => setTeamSize(Math.max(1, Math.min(500, Number(e.target.value) || 1)))}
                className="w-20 text-center"
              />
              <span className="text-sm text-muted-foreground">人</span>
            </div>
          </CardContent>
        </Card>

        {/* Step 3: Results */}
        {hasSelection && (
          <div className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Step 3: 計算結果</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current cost */}
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">現在のコスト</p>
                  <p className="text-lg font-bold">
                    {formatJPY(results.monthlyJPY)} <span className="text-sm font-normal text-muted-foreground">/ 月</span>
                  </p>
                  <p className="text-lg font-bold">
                    {formatJPY(results.yearlyJPY)} <span className="text-sm font-normal text-muted-foreground">/ 年</span>
                  </p>
                  <p className="text-xs text-muted-foreground">（1ドル＝150円換算）</p>
                </div>

                <p className="text-sm text-muted-foreground">
                  OSSに切り替えれば、このコストを
                  <br />
                  大幅に削減できる可能性があります💡
                </p>
              </CardContent>
            </Card>

            {/* Step 4: OSS Stack */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">おすすめOSSスタック</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.selectedItems.map((item) => (
                    <div
                      key={item.name}
                      className="rounded-lg border border-border p-4 space-y-2"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-sm">{item.name}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-bold text-sm text-primary">{item.ossName}</span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                          {item.ossStars}
                        </span>
                      </div>
                      <div className="text-right">
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" asChild>
                          <Link to={`/tools/${item.ossSlug}`}>
                            詳細を見る <ExternalLink className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Step 5: Share */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">結果をシェア</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                <Button onClick={handleTweet} className="gap-2">
                  <Twitter className="h-4 w-4" />
                  Xでシェア
                </Button>
                <Button variant="outline" onClick={handleCopy} className="gap-2">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? "コピーしました" : "結果をコピー"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </SiteLayout>
  );
}
