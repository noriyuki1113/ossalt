import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  use: {
    baseURL: 'https://ossalt.jp',
    viewport: { width: 390, height: 844 }, // iPhoneサイズ
  },

  projects: [
    {
      name: 'Mobile Chrome',
      use: {
        ...devices['iPhone 14'],
      },
    },
  ],

  reporter: 'html',
});
