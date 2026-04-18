import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load fonts once at startup
const notoSansJP = readFileSync(join(__dirname, "../fonts/NotoSansJP-Bold.ttf"));

const W = 1200;
const H = 630;

/**
 * @param {object} params
 * @param {"tool"|"alt"|"compare"|"default"} params.type
 * @param {string} [params.name]        Tool name
 * @param {string} [params.competitor]  SaaS competitor name
 * @param {string} [params.category]    Category (Japanese)
 * @param {string} [params.oss]         OSS name (compare page)
 * @param {string} [params.saas]        SaaS name (compare page)
 * @returns {Promise<Buffer>}
 */
export async function renderOgImage(params) {
  const { type = "default", name, competitor, category, oss, saas } = params;

  const element = buildLayout({ type, name, competitor, category, oss, saas });

  const svg = await satori(element, {
    width: W,
    height: H,
    fonts: [
      {
        name: "Noto Sans JP",
        data: notoSansJP,
        weight: 700,
        style: "normal",
      },
    ],
  });

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: W } });
  return Buffer.from(resvg.render().asPng());
}

function buildLayout({ type, name, competitor, category, oss, saas }) {
  // Shared brand footer
  const footer = {
    type: "div",
    props: {
      style: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginTop: "auto",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              background: "#22c55e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            children: {
              type: "span",
              props: {
                style: { color: "#fff", fontSize: "14px", fontWeight: 700 },
                children: "OSS",
              },
            },
          },
        },
        {
          type: "span",
          props: {
            style: { color: "#94a3b8", fontSize: "18px", fontWeight: 700 },
            children: "ossalt.jp",
          },
        },
        {
          type: "span",
          props: {
            style: { color: "#475569", fontSize: "16px" },
            children: "— OSSアルタナティブ",
          },
        },
      ],
    },
  };

  if (type === "tool") {
    const hasCompetitor = !!competitor;
    return {
      type: "div",
      props: {
        style: {
          width: W,
          height: H,
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "64px 72px",
          fontFamily: "Noto Sans JP",
          position: "relative",
        },
        children: [
          // Accent line top
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: "linear-gradient(90deg, #22c55e, #16a34a)",
              },
            },
          },
          // Category badge
          category
            ? {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "28px",
                  },
                  children: {
                    type: "span",
                    props: {
                      style: {
                        background: "rgba(34,197,94,0.15)",
                        border: "1px solid rgba(34,197,94,0.4)",
                        color: "#22c55e",
                        fontSize: "18px",
                        padding: "6px 16px",
                        borderRadius: "999px",
                      },
                      children: category,
                    },
                  },
                },
              }
            : { type: "div", props: { style: { height: "56px" } } },
          // Tool name
          {
            type: "div",
            props: {
              style: {
                color: "#f8fafc",
                fontSize: name && name.length > 20 ? "64px" : "80px",
                fontWeight: 700,
                lineHeight: 1.1,
                marginBottom: "24px",
              },
              children: name || "OSS Tool",
            },
          },
          // Competitor line
          hasCompetitor
            ? {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    marginBottom: "auto",
                  },
                  children: [
                    {
                      type: "span",
                      props: {
                        style: {
                          background: "rgba(248,250,252,0.08)",
                          color: "#94a3b8",
                          fontSize: "24px",
                          padding: "8px 20px",
                          borderRadius: "8px",
                          border: "1px solid rgba(248,250,252,0.1)",
                        },
                        children: competitor,
                      },
                    },
                    {
                      type: "span",
                      props: {
                        style: { color: "#475569", fontSize: "24px" },
                        children: "の代替OSSとして注目",
                      },
                    },
                  ],
                },
              }
            : {
                type: "span",
                props: {
                  style: { color: "#64748b", fontSize: "22px", marginBottom: "auto" },
                  children: "オープンソース代替ツール",
                },
              },
          footer,
        ],
      },
    };
  }

  if (type === "compare") {
    return {
      type: "div",
      props: {
        style: {
          width: W,
          height: H,
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "64px 72px",
          fontFamily: "Noto Sans JP",
          position: "relative",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: "linear-gradient(90deg, #3b82f6, #6366f1)",
              },
            },
          },
          {
            type: "span",
            props: {
              style: {
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.4)",
                color: "#818cf8",
                fontSize: "18px",
                padding: "6px 16px",
                borderRadius: "999px",
                marginBottom: "28px",
              },
              children: "徹底比較",
            },
          },
          {
            type: "div",
            props: {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "32px",
                marginBottom: "auto",
              },
              children: [
                {
                  type: "span",
                  props: {
                    style: {
                      color: "#22c55e",
                      fontSize: oss && oss.length > 12 ? "56px" : "72px",
                      fontWeight: 700,
                    },
                    children: oss || "OSS",
                  },
                },
                {
                  type: "span",
                  props: {
                    style: { color: "#475569", fontSize: "48px", fontWeight: 700 },
                    children: "vs",
                  },
                },
                {
                  type: "span",
                  props: {
                    style: {
                      color: "#94a3b8",
                      fontSize: saas && saas.length > 12 ? "56px" : "72px",
                      fontWeight: 700,
                    },
                    children: saas || "SaaS",
                  },
                },
              ],
            },
          },
          {
            type: "span",
            props: {
              style: { color: "#64748b", fontSize: "22px", marginBottom: "32px" },
              children: "コスト・機能・セルフホストを徹底比較",
            },
          },
          footer,
        ],
      },
    };
  }

  if (type === "alt") {
    return {
      type: "div",
      props: {
        style: {
          width: W,
          height: H,
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)",
          display: "flex",
          flexDirection: "column",
          padding: "64px 72px",
          fontFamily: "Noto Sans JP",
          position: "relative",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "4px",
                background: "linear-gradient(90deg, #f59e0b, #f97316)",
              },
            },
          },
          {
            type: "span",
            props: {
              style: {
                background: "rgba(245,158,11,0.15)",
                border: "1px solid rgba(245,158,11,0.4)",
                color: "#fbbf24",
                fontSize: "18px",
                padding: "6px 16px",
                borderRadius: "999px",
                marginBottom: "28px",
              },
              children: "OSS代替ツール一覧",
            },
          },
          {
            type: "div",
            props: {
              style: {
                color: "#f8fafc",
                fontSize: name && name.length > 14 ? "60px" : "76px",
                fontWeight: 700,
                lineHeight: 1.1,
                marginBottom: "20px",
              },
              children: name ? `${name} の代替` : "OSSの代替を探す",
            },
          },
          {
            type: "span",
            props: {
              style: { color: "#64748b", fontSize: "22px", marginBottom: "auto" },
              children: "無料・自己ホスト可能なオープンソースツール比較",
            },
          },
          footer,
        ],
      },
    };
  }

  // Default
  return {
    type: "div",
    props: {
      style: {
        width: W,
        height: H,
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "64px 72px",
        fontFamily: "Noto Sans JP",
        position: "relative",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(90deg, #22c55e, #16a34a)",
            },
          },
        },
        {
          type: "div",
          props: {
            style: {
              color: "#f8fafc",
              fontSize: "72px",
              fontWeight: 700,
              marginBottom: "20px",
            },
            children: "OSSアルタナティブ",
          },
        },
        {
          type: "span",
          props: {
            style: { color: "#64748b", fontSize: "26px", marginBottom: "auto" },
            children: "有料SaaSの代わりに使えるOSSを日本語で検索・比較",
          },
        },
        footer,
      ],
    },
  };
}
