import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  use: {
    baseURL: "https://ossalt.jp",
    viewport: { width: 390, height: 844 }, // iPhone 14 size
  },
  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
  ],
});
