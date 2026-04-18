// Import edge-specific bundle directly; Vercel's bundler resolves the default
// condition to index.node.js which uses Node.js APIs unsupported in Edge Runtime.
// @ts-ignore
import { ImageResponse } from "@vercel/og/dist/index.edge.js";

export const config = { runtime: "edge" };

const JP_CHARS = "の代替ツール無料セルフホスト可能なオープンソース一覧日本向けスター";

let fontCache: ArrayBuffer | null = null;

async function loadFont(): Promise<ArrayBuffer | null> {
  if (fontCache) return fontCache;
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&text=${encodeURIComponent(JP_CHARS)}`;
    const css = await fetch(cssUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    }).then((r) => r.text());
    const match = css.match(/src: url\((.+?)\) format\('opentype'\)/);
    if (!match) return null;
    fontCache = await fetch(match[1]).then((r) => r.arrayBuffer());
    return fontCache;
  } catch {
    return null;
  }
}

function formatStars(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "alt"; // "alt" | "tool" | "compare"
  const name = searchParams.get("c") ?? "OSS";
  const category = searchParams.get("cat") ?? "";
  const stars = parseInt(searchParams.get("stars") ?? "0", 10);

  const fontData = await loadFont();
  const fonts = fontData
    ? [{ name: "NotoSansJP", data: fontData, style: "normal" as const, weight: 700 as const }]
    : [];

  const base = {
    background: "linear-gradient(135deg, #0f172a 0%, #0d1f3c 100%)",
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
    padding: "56px 72px",
    fontFamily: fontData ? "NotoSansJP, sans-serif" : "sans-serif",
  };

  const header = (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
      <div style={{ width: 12, height: 12, background: "#22c55e", borderRadius: "50%", display: "flex" }} />
      <span style={{ color: "#22c55e", fontSize: 22 }}>ossalt.jp</span>
      <span style={{ color: "#334155", fontSize: 22, marginLeft: 4 }}>— OSSアルタナティブ</span>
    </div>
  );

  const footer = (left: string) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #1e293b", paddingTop: 24 }}>
      <div style={{ color: "#475569", fontSize: 22, display: "flex" }}>{left}</div>
      <div style={{ background: "#22c55e", color: "#0f172a", fontSize: 22, fontWeight: 700, borderRadius: 8, padding: "8px 22px", display: "flex" }}>
        無料で探す →
      </div>
    </div>
  );

  let content: React.ReactNode;

  if (type === "tool") {
    // Tool detail page: show tool name + category + stars
    content = (
      <div style={base}>
        {header}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.35)", borderRadius: 999, color: "#22c55e", fontSize: 24, padding: "7px 22px", display: "flex", width: "fit-content", marginBottom: 28 }}>
            OSSツール
          </div>
          <div style={{ color: "#f8fafc", fontSize: 88, fontWeight: 700, lineHeight: 1.1, display: "flex" }}>
            {name}
          </div>
          {category && (
            <div style={{ color: "#64748b", fontSize: 30, marginTop: 20, display: "flex" }}>
              {category}
            </div>
          )}
          {stars > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 20 }}>
              <span style={{ color: "#fbbf24", fontSize: 28 }}>★</span>
              <span style={{ color: "#94a3b8", fontSize: 28 }}>{formatStars(stars)} GitHub Stars</span>
            </div>
          )}
        </div>
        {footer("無料・セルフホスト可能")}
      </div>
    );
  } else if (type === "compare") {
    // Compare page: "AppFlowy vs Notion"
    const [ossName, saasName] = name.includes(" vs ") ? name.split(" vs ") : [name, ""];
    content = (
      <div style={base}>
        {header}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.35)", borderRadius: 999, color: "#22c55e", fontSize: 24, padding: "7px 22px", display: "flex", width: "fit-content", marginBottom: 28 }}>
            OSS vs SaaS 比較
          </div>
          <div style={{ color: "#f8fafc", fontSize: 72, fontWeight: 700, lineHeight: 1.1, display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" as const }}>
            <span style={{ color: "#7dd3fc" }}>{ossName}</span>
            <span style={{ color: "#475569", fontSize: 44 }}>vs</span>
            <span>{saasName}</span>
          </div>
          <div style={{ color: "#64748b", fontSize: 28, marginTop: 24, display: "flex" }}>
            コスト・機能・セルフホスト対応を徹底比較
          </div>
        </div>
        {footer("日本のエンジニア向けOSSディレクトリ")}
      </div>
    );
  } else {
    // Default: alternatives page
    content = (
      <div style={base}>
        {header}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.35)", borderRadius: 999, color: "#22c55e", fontSize: 24, padding: "7px 22px", display: "flex", width: "fit-content", marginBottom: 28 }}>
            OSS代替ツール
          </div>
          <div style={{ color: "#f8fafc", fontSize: 82, fontWeight: 700, lineHeight: 1.1, display: "flex", flexWrap: "wrap" as const, alignItems: "baseline", gap: 12 }}>
            <span style={{ color: "#7dd3fc" }}>{name}</span>
            <span>の代替</span>
          </div>
          <div style={{ color: "#64748b", fontSize: 30, marginTop: 24, display: "flex" }}>
            無料・セルフホスト可能なオープンソースツール一覧
          </div>
        </div>
        {footer("日本のエンジニア向けOSSディレクトリ")}
      </div>
    );
  }

  return new ImageResponse(content, { width: 1200, height: 630, fonts });
}
