import express from "express";
import { renderOgImage } from "./render.mjs";

const app = express();
const PORT = process.env.PORT || 3000;

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24h

function cacheKey(params) {
  return JSON.stringify(params);
}

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// OG image endpoint
// GET /og?type=tool&name=AppFlowy&competitor=Notion&category=ビジネス
// GET /og?type=compare&oss=AppFlowy&saas=Notion
// GET /og?type=alt&name=Notion
app.get("/og", async (req, res) => {
  const { type = "default", name, competitor, category, oss, saas } = req.query;
  const params = { type, name, competitor, category, oss, saas };
  const key = cacheKey(params);

  try {
    let png = cache.get(key);
    if (!png) {
      png = await renderOgImage(params);
      cache.set(key, png);
      // Evict after TTL
      setTimeout(() => cache.delete(key), CACHE_TTL);
    }

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=3600");
    res.send(png);
  } catch (err) {
    console.error("OG render error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`ossalt OG service running on port ${PORT}`);
});
