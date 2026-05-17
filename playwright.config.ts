import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  reporter: 'html',

  projects: [
    // 本番サイト向け（既存テスト）
    {
      name: 'production',
      testMatch: /e2e\.spec\.ts/,
      use: {
        baseURL: 'https://ossalt.jp',
        ...devices['iPhone 14'],
      },
    },
    // ローカル dev server 向け（admin/agent テスト）
    {
      name: 'local',
      testMatch: /admin-agent\.spec\.ts/,
      use: {
        baseURL: 'http://localhost:8080',
        ...devices['iPhone 14'],
      },
    },
  ],

  // ローカルプロジェクト実行時にdev serverを起動
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:8080',
    reuseExistingServer: true,
    timeout: 30000,
  },
});
