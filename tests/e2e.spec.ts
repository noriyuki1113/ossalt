import { test, expect } from "../playwright-fixture";

test.describe("OSSアルタナティブ Core Flows", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("h1").first().waitFor({ state: "visible", timeout: 15000 });
  });

  test("landing page shows the service-first search experience", async ({ page }) => {
    await expect(page.locator("h1")).toContainText("いま使っているSaaSの代替OSSを探す");
    await expect(
      page.getByPlaceholder("代替を探したいサービス名（例：Notion）")
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "検索" })).toBeVisible();
  });

  test("quick chip fills the service search", async ({ page }) => {
    const searchInput = page.getByPlaceholder("代替を探したいサービス名（例：Notion）");
    await page.getByRole("button", { name: "Notion代替" }).click();
    await expect(searchInput).toHaveValue("Notion");
  });

  test("search for Notion shows result cards", async ({ page }) => {
    const searchInput = page.getByPlaceholder("代替を探したいサービス名（例：Notion）");
    await searchInput.fill("Notion");
    await page.getByRole("button", { name: "検索" }).click();

    const resultCards = page.locator('a[href*="/tools/"]');
    await expect(resultCards.first()).toBeVisible({ timeout: 10000 });
    expect(await resultCards.count()).toBeGreaterThan(0);
  });

  test("result card opens a tool detail page", async ({ page }) => {
    const searchInput = page.getByPlaceholder("代替を探したいサービス名（例：Notion）");
    await searchInput.fill("Notion");
    await page.getByRole("button", { name: "検索" }).click();

    const firstCard = page.locator('a[href*="/tools/"]').first();
    await expect(firstCard).toBeVisible({ timeout: 10000 });
    await firstCard.click();
    await page.waitForURL("**/tools/**", { timeout: 10000 });
    expect(page.url()).toMatch(/\/tools\/\d+/);
  });

  test("empty search keeps the page functional", async ({ page }) => {
    const searchInput = page.getByPlaceholder("代替を探したいサービス名（例：Notion）");
    await searchInput.fill("xyznonexistent12345");
    await page.getByRole("button", { name: "検索" }).click();
    await expect(page.locator("h1").first()).toBeVisible();

    await searchInput.fill("");
    await page.getByRole("button", { name: "検索" }).click();
    await expect(page.locator("h1")).toContainText("いま使っているSaaSの代替OSSを探す");
  });
});
