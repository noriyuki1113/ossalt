import { test, expect } from "../playwright-fixture";

test.describe("OSSアルタナティブ Core Flows", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for hero to be visible before each test
    await page.locator("h1").first().waitFor({ state: "visible", timeout: 15000 });
  });

  test("landing page loads with hero and CTAs", async ({ page }) => {
    // Hero title
    await expect(page.locator("h1")).toContainText("有料SaaS、もういらない。");

    // CTA buttons
    const primaryCta = page.getByRole("button", { name: "無料でOSSを探す" });
    const secondaryCta = page.getByRole("button", { name: "代替ツールを見つける" });
    await expect(primaryCta).toBeVisible();
    await expect(secondaryCta).toBeVisible();

    // Search input
    const searchInput = page.getByPlaceholder("ツール名やカテゴリで検索…");
    await expect(searchInput).toBeVisible();
  });

  test("primary CTA scrolls to catalog section", async ({ page }) => {
    const primaryCta = page.getByRole("button", { name: "無料でOSSを探す" });
    const initialScrollY = await page.evaluate(() => window.scrollY);

    await primaryCta.click();
    // Wait for smooth scroll to complete
    await page.waitForTimeout(1000);

    const newScrollY = await page.evaluate(() => window.scrollY);
    expect(newScrollY).toBeGreaterThan(initialScrollY);
  });

  test("secondary CTA scrolls to popular alternatives", async ({ page }) => {
    const secondaryCta = page.getByRole("button", { name: "代替ツールを見つける" });
    const initialScrollY = await page.evaluate(() => window.scrollY);

    await secondaryCta.click();
    await page.waitForTimeout(1000);

    const newScrollY = await page.evaluate(() => window.scrollY);
    expect(newScrollY).toBeGreaterThan(initialScrollY);
  });

  test("search for 'Notion' shows results", async ({ page }) => {
    const searchInput = page.getByPlaceholder("ツール名やカテゴリで検索…");
    await searchInput.fill("Notion");

    // Wait for debounce + results to load
    const resultCards = page.locator('[class*="grid"] a[href*="/tools/"]');
    await expect(resultCards.first()).toBeVisible({ timeout: 10000 });

    const count = await resultCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("card navigation to detail page", async ({ page }) => {
    const searchInput = page.getByPlaceholder("ツール名やカテゴリで検索…");
    await searchInput.fill("Notion");

    // Wait for results
    const firstCard = page.locator('a[href*="/tools/"]').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });

    await firstCard.click();
    await page.waitForURL("**/tools/**", { timeout: 10000 });

    // URL changed to a detail page
    expect(page.url()).toMatch(/\/tools\/\d+/);
  });

  test("detail page has title and links", async ({ page }) => {
    const searchInput = page.getByPlaceholder("ツール名やカテゴリで検索…");
    await searchInput.fill("Notion");

    const firstCard = page.locator('a[href*="/tools/"]').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    await firstCard.click();
    await page.waitForURL("**/tools/**", { timeout: 10000 });

    // Title visible
    const heading = page.locator("h1").first();
    await expect(heading).toBeVisible();
    const titleText = await heading.textContent();
    expect(titleText?.length).toBeGreaterThan(0);

    // GitHub or official link exists
    const externalLink = page.locator('a[href*="github.com"], a[href*="http"]').first();
    await expect(externalLink).toBeVisible({ timeout: 5000 });
  });

  test("empty search does not crash", async ({ page }) => {
    const searchInput = page.getByPlaceholder("ツール名やカテゴリで検索…");
    await searchInput.fill("xyznonexistent12345");

    // Wait for debounce
    await page.waitForTimeout(500);

    // Page should still be functional — no crash
    await expect(page.locator("h1").first()).toBeVisible();

    // Clear search
    await searchInput.fill("");
    await page.waitForTimeout(500);

    // Hero should still be visible
    await expect(page.locator("h1")).toContainText("有料SaaS、もういらない。");
  });
});
