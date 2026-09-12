import { test, expect, type Page } from "../playwright-fixture";

// Fills the hero search box and waits for the underlying Supabase `tools`
// query to complete, asserting it actually succeeded. This turns a vague
// "locator not visible" timeout into a clear "API returned 401/500/etc."
// failure when something upstream (network, RLS, credentials) is broken,
// which is otherwise very hard to diagnose from CI logs alone.
async function searchAndWaitForApi(page: Page, query: string) {
  const responsePromise = page.waitForResponse(
    (res) => res.url().includes("/rest/v1/tools") && res.url().includes("ilike"),
    { timeout: 10000 },
  );
  await page.getByLabel("代替を探したいサービス名・ツール名").fill(query);
  const response = await responsePromise;
  if (!response.ok()) {
    const body = await response.text().catch(() => "<no body>");
    throw new Error(`tools API request failed: ${response.status()} ${response.url()}\nBody: ${body}`);
  }
  return response;
}

test.describe("OSSアルタナティブ Core Flows", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    // Wait for hero to be visible before each test
    await page.locator("h1").first().waitFor({ state: "visible", timeout: 15000 });
  });

  test("landing page loads with hero, search and quick chips", async ({ page }) => {
    // Hero title
    await expect(page.locator("h1")).toContainText("代替OSSを探す");

    // Hero search input
    const searchInput = page.getByLabel("代替を探したいサービス名・ツール名");
    await expect(searchInput).toBeVisible();

    // Quick chip
    const quickChip = page.getByRole("button", { name: "Notion代替" });
    await expect(quickChip).toBeVisible();

    // Category filter
    const categoryAll = page.getByRole("button", { name: "すべて" });
    await expect(categoryAll).toBeVisible();
  });

  test("quick chip click fills the search input", async ({ page }) => {
    const searchInput = page.getByLabel("代替を探したいサービス名・ツール名");
    await page.getByRole("button", { name: "Notion代替" }).click();

    await expect(searchInput).toHaveValue("Notion");
  });

  test("category filter navigates to /category/:slug", async ({ page }) => {
    await page.getByRole("button", { name: "AI・ML" }).click();
    await page.waitForURL("**/category/ai-ml", { timeout: 10000 });
    expect(page.url()).toContain("/category/ai-ml");
  });

  test("search for 'Notion' shows results", async ({ page }) => {
    await searchAndWaitForApi(page, "Notion");

    const resultCards = page.locator('a[href*="/tools/"]');
    await expect(resultCards.first()).toBeVisible({ timeout: 10000 });

    const count = await resultCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("card navigation to detail page", async ({ page }) => {
    await searchAndWaitForApi(page, "Notion");

    const firstCard = page.locator('a[href*="/tools/"]').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });

    await firstCard.click();
    await page.waitForURL("**/tools/**", { timeout: 10000 });

    // URL changed to a detail page
    expect(page.url()).toMatch(/\/tools\/\d+/);
  });

  test("detail page has title and links", async ({ page }) => {
    await searchAndWaitForApi(page, "Notion");

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
    const searchInput = page.getByLabel("代替を探したいサービス名・ツール名");
    await searchInput.fill("xyznonexistent12345");

    // Wait for debounce
    await page.waitForTimeout(500);

    // Page should still be functional — no crash
    await expect(page.locator("h1").first()).toBeVisible();

    // Clear search
    await searchInput.fill("");
    await page.waitForTimeout(500);

    // Hero should still be visible
    await expect(page.locator("h1")).toContainText("代替OSSを探す");
  });
});
