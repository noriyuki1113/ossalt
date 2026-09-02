import { test, expect } from "../playwright-fixture";

test.describe("OSSアルタナティブ Core Flows", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for hero to be visible before each test
    await page.locator("h1").first().waitFor({ state: "visible", timeout: 15000 });
  });

  test("landing page loads with hero, search and quick chips", async ({ page }) => {
    // Hero title
    await expect(page.locator("h1")).toContainText("OSSで代替する");

    // Hero search input
    const searchInput = page.getByLabel("OSSツールを検索");
    await expect(searchInput).toBeVisible();

    // Quick chip
    const quickChip = page.getByRole("button", { name: "Notion代替" });
    await expect(quickChip).toBeVisible();

    // Category filter
    const categoryAll = page.getByRole("button", { name: "すべて" });
    await expect(categoryAll).toBeVisible();
  });

  test("quick chip click fills the search input", async ({ page }) => {
    const searchInput = page.getByLabel("OSSツールを検索");
    await page.getByRole("button", { name: "Notion代替" }).click();

    await expect(searchInput).toHaveValue("Notion");
  });

  test("category filter navigates to /category/:slug", async ({ page }) => {
    await page.getByRole("button", { name: "AI・ML" }).click();
    await page.waitForURL("**/category/ai-ml", { timeout: 10000 });
    expect(page.url()).toContain("/category/ai-ml");
  });

  test("search for 'Notion' shows results", async ({ page }) => {
    const searchInput = page.getByLabel("OSSツールを検索");
    await searchInput.fill("Notion");

    // Wait for debounce + results to load
    const resultCards = page.locator('a[href*="/tools/"]');
    await expect(resultCards.first()).toBeVisible({ timeout: 10000 });

    const count = await resultCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("card navigation to detail page", async ({ page }) => {
    const searchInput = page.getByLabel("OSSツールを検索");
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
    const searchInput = page.getByLabel("OSSツールを検索");
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

  test("empty/no-match search does not crash", async ({ page }) => {
    const searchInput = page.getByLabel("OSSツールを検索");
    await searchInput.fill("xyznonexistent12345");

    // Wait for debounce
    await page.waitForTimeout(500);

    // Page should still be functional — no crash
    await expect(page.locator("h1").first()).toBeVisible();

    // Clear search
    await searchInput.fill("");
    await page.waitForTimeout(500);

    // Hero should still be visible
    await expect(page.locator("h1")).toContainText("OSSで代替する");
  });
});
