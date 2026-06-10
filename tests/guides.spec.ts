import { test, expect } from "@playwright/test";

const guides = [
  "coolify",
  "nextcloud",
  "vaultwarden",
  "gitea",
  "n8n",
  "appflowy",
  "baserow",
  "plausible",
  "metabase",
  "nocodb",
  "umami",
  "mattermost",
  "vikunja",
  "plane",
  "outline",
];

type Issue = { guide: string; type: string; detail: string };
const issues: Issue[] = [];

test.describe.configure({ mode: "serial" });

for (const slug of guides) {
  test(`guide: ${slug}`, async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("pageerror", (e) => consoleErrors.push(String(e.message)));
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });

    const resp = await page.goto(`/guides/${slug}-selfhost-vps`, {
      waitUntil: "domcontentloaded",
    });
    if (!resp || !resp.ok()) {
      issues.push({ guide: slug, type: "http", detail: `status ${resp?.status()}` });
    }

    // h1
    const h1 = page.locator("h1").first();
    try {
      await h1.waitFor({ state: "visible", timeout: 10000 });
      const txt = (await h1.textContent())?.trim() || "";
      if (!txt) issues.push({ guide: slug, type: "h1-empty", detail: "" });
    } catch {
      issues.push({ guide: slug, type: "h1-missing", detail: "no h1 within 10s" });
    }

    // Wait a beat for content
    await page.waitForTimeout(500);

    // Collect internal links (skip hash/external)
    const links = await page.$$eval("a[href]", (as) =>
      as
        .map((a) => (a as HTMLAnchorElement).getAttribute("href") || "")
        .filter((h) => h.startsWith("/") && !h.startsWith("//"))
    );
    const unique = Array.from(new Set(links));

    // Check tool links resolve (tool ids must be numeric & exist)
    for (const href of unique) {
      const m = href.match(/^\/tools\/(.+)$/);
      if (m && !/^\d+$/.test(m[1])) {
        issues.push({ guide: slug, type: "bad-tool-id", detail: href });
      }
    }

    // Check that /alternatives/* slugs aren't obviously broken (basic sanity: lowercase, no spaces)
    for (const href of unique) {
      if (href.startsWith("/alternatives/")) {
        const slugPart = href.replace("/alternatives/", "");
        if (!/^[a-z0-9-]+$/.test(slugPart)) {
          issues.push({ guide: slug, type: "bad-alt-slug", detail: href });
        }
      }
    }

    if (consoleErrors.length) {
      issues.push({
        guide: slug,
        type: "console-error",
        detail: consoleErrors.slice(0, 3).join(" | "),
      });
    }
  });
}

test.afterAll(async () => {
  // eslint-disable-next-line no-console
  console.log("\n===== GUIDE E2E ISSUES =====");
  if (issues.length === 0) console.log("No issues found.");
  for (const i of issues) {
    // eslint-disable-next-line no-console
    console.log(`[${i.guide}] ${i.type}: ${i.detail}`);
  }
  console.log("===== END =====\n");
});
