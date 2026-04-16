import { ImageResponse } from "@vercel/og";

export const config = { runtime: "edge" };

// Japanese characters used in the image — keep this minimal for fast font subset load
const JP_CHARS = "の代替ツール無料セルフホスト可能なオープンソース一覧日本向け";

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

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const competitor = searchParams.get("c") ?? "OSS";

  const fontData = await loadFont();
  const fonts = fontData
    ? [{ name: "NotoSansJP", data: fontData, style: "normal" as const, weight: 700 as const }]
    : [];

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #0d1f3c 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "56px 72px",
          fontFamily: fontData ? "NotoSansJP, sans-serif" : "sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
          <div
            style={{
              width: 12,
              height: 12,
              background: "#22c55e",
              borderRadius: "50%",
              display: "flex",
            }}
          />
          <span style={{ color: "#22c55e", fontSize: 22 }}>ossalt.jp</span>
          <span style={{ color: "#334155", fontSize: 22, marginLeft: 4 }}>— OSSアルタナティブ</span>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div
            style={{
              background: "rgba(34,197,94,0.12)",
              border: "1px solid rgba(34,197,94,0.35)",
              borderRadius: 999,
              color: "#22c55e",
              fontSize: 24,
              padding: "7px 22px",
              display: "flex",
              width: "fit-content",
              marginBottom: 28,
            }}
          >
            OSS代替ツール
          </div>

          <div
            style={{
              color: "#f8fafc",
              fontSize: 82,
              fontWeight: 700,
              lineHeight: 1.1,
              display: "flex",
              flexWrap: "wrap",
              alignItems: "baseline",
              gap: 12,
            }}
          >
            <span style={{ color: "#7dd3fc" }}>{competitor}</span>
            <span>の代替</span>
          </div>

          <div style={{ color: "#64748b", fontSize: 30, marginTop: 24, display: "flex" }}>
            無料・セルフホスト可能なオープンソースツール一覧
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid #1e293b",
            paddingTop: 24,
          }}
        >
          <div style={{ color: "#475569", fontSize: 22, display: "flex" }}>
            日本のエンジニア向けOSSディレクトリ
          </div>
          <div
            style={{
              background: "#22c55e",
              color: "#0f172a",
              fontSize: 22,
              fontWeight: 700,
              borderRadius: 8,
              padding: "8px 22px",
              display: "flex",
            }}
          >
            無料で探す →
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts,
    }
  );
}
