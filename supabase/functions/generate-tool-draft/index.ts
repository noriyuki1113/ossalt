import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function extractOwnerRepo(url: string): string | null {
  try {
    const u = new URL(url);
    if (!u.hostname.includes("github.com")) return null;
    const parts = u.pathname.replace(/^\//, "").replace(/\/$/, "").split("/");
    if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
    return null;
  } catch { return null; }
}

async function fetchGitHubData(ownerRepo: string, token?: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "ossalt-agent/1.0",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const [repoRes, readmeRes] = await Promise.allSettled([
    fetch(`https://api.github.com/repos/${ownerRepo}`, { headers }),
    fetch(`https://api.github.com/repos/${ownerRepo}/readme`, { headers }),
  ]);

  const repo = repoRes.status === "fulfilled" && repoRes.value.ok
    ? await repoRes.value.json()
    : null;

  let readme = "";
  if (readmeRes.status === "fulfilled" && readmeRes.value.ok) {
    const readmeData = await readmeRes.value.json();
    // Base64デコード
    try {
      readme = atob(readmeData.content.replace(/\n/g, ""));
    } catch { readme = ""; }
  }

  return { repo, readme };
}

async function callClaude(apiKey: string, payload: {
  name: string;
  description: string;
  readme: string;
  stars: number;
  license: string;
  language: string;
  topics: string[];
  github_url: string;
  source_url: string;
}) {
  // READMEは4000文字に制限（トークン節約）
  const readmeTrunc = payload.readme.slice(0, 4000);

  const prompt = `あなたはOSSディレクトリ「ossalt.jp」の編集AIです。
以下のOSSツールの情報をもとに、日本語ユーザー向けのツールカードデータをJSONで生成してください。

## ツール情報
- 名前: ${payload.name}
- GitHubリポジトリ: ${payload.github_url}
- 公式サイト: ${payload.source_url}
- 説明: ${payload.description}
- スター数: ${payload.stars.toLocaleString()}
- 言語: ${payload.language}
- ライセンス: ${payload.license}
- トピックス: ${payload.topics.join(", ")}

## README（抜粋）
${readmeTrunc}

## 出力形式（このJSONのみ出力。前後に何も付けないこと）
{
  "name": "ツール名（英語のまま）",
  "summary_ja": "1〜2文の日本語説明。何ができるか・誰向けかを簡潔に",
  "category": "次のいずれか1つ: 生産性 | 開発ツール | インフラ | AI/ML | コミュニケーション | データ分析 | セキュリティ | ファイル管理 | CMS | ECサイト | その他",
  "alternative_to": ["代替するSaaS名1（英語）", "代替するSaaS名2"],
  "use_cases": ["ユースケース1（1文・日本語）", "ユースケース2", "ユースケース3"],
  "pros": ["メリット1（日本語）", "メリット2", "メリット3"],
  "cons": ["デメリット1（日本語）", "デメリット2"],
  "vps_supported": true,
  "docker_supported": true,
  "difficulty": "簡単 | 中程度 | 難しい",
  "license_note": "ライセンスの要点を1文（商用利用可否を含む）",
  "commercial_use_note": "商用利用についての注意点を1文",
  "recommended_for": ["おすすめの人・組織1（日本語）", "おすすめの人2"],
  "not_recommended_for": ["向かない人1（日本語）", "向かない人2"],
  "setup_notes": "セットアップ方法の概要を2〜3文（Dockerコマンド等あれば言及）",
  "seo_title": "【無料】${payload.name}の使い方・代替 | OSSアルタナティブ",
  "seo_description": "120文字以内の日本語メタディスクリプション"
}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "anthropic-version": "2023-06-01",
      "x-api-key": apiKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Claude API error: ${res.status} ${t}`);
  }

  const data = await res.json();
  const content = data.content?.[0]?.text?.trim();
  if (!content) throw new Error("Claude からの応答が空です");

  // マークダウンのコードフェンスを除去
  const jsonStr = content
    .replace(/^```(?:json)?\n?/, "")
    .replace(/\n?```$/, "")
    .trim();

  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("JSON parse error, raw:", jsonStr);
    throw new Error("AIの出力をJSONとして解析できませんでした");
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const respond = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const githubToken = Deno.env.get("GITHUB_TOKEN");
    const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");

    if (!anthropicKey) return respond({ error: "ANTHROPIC_API_KEY が設定されていません" }, 500);

    const body = await req.json().catch(() => ({}));
    const sourceUrl: string = body.url?.trim();
    if (!sourceUrl) return respond({ error: "url は必須です" }, 400);

    const ownerRepo = extractOwnerRepo(sourceUrl);
    if (!ownerRepo) {
      return respond({ error: "GitHub URLを入力してください（例: https://github.com/owner/repo）" }, 400);
    }

    const { repo, readme } = await fetchGitHubData(ownerRepo, githubToken);
    if (!repo) return respond({ error: `GitHubリポジトリ ${ownerRepo} の取得に失敗しました` }, 400);

    const payload = {
      name: repo.name || ownerRepo.split("/")[1],
      description: repo.description || "",
      readme,
      stars: repo.stargazers_count || 0,
      license: repo.license?.spdx_id || repo.license?.name || "Unknown",
      language: repo.language || "",
      topics: repo.topics || [],
      github_url: `https://github.com/${ownerRepo}`,
      source_url: repo.homepage || sourceUrl,
    };

    const aiOutput = await callClaude(anthropicKey, payload);

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: draft, error: dbError } = await supabase
      .from("oss_tool_drafts")
      .insert({
        source_url: payload.source_url || sourceUrl,
        github_url: payload.github_url,
        ...aiOutput,
        raw_ai_output: aiOutput,
        status: "draft",
      })
      .select()
      .single();

    if (dbError) throw new Error(`DB保存エラー: ${dbError.message}`);

    return respond({
      draft,
      repo_meta: {
        stars: payload.stars,
        language: payload.language,
        license: payload.license,
        topics: payload.topics,
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "不明なエラーが発生しました";
    console.error("generate-tool-draft error:", message);
    return respond({ error: message }, 500);
  }
});
