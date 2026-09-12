import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  reporter: 'html',

  projects: [
    // コアフロー（旧: 本番サイト直接テスト。PRの変更を検証するため
    // ローカルのdev serverに向け直した — 本番URLを叩くと、そのPRの
    // 差分と無関係に「今ossalt.jpに何がデプロイされているか」だけで
    // 合否が決まってしまい、CIとして機能しない）
    {
      name: 'core-flows',
      testMatch: /e2e\.spec\.ts/,
      use: {
        baseURL: 'http://localhost:8080',
        ...devices['iPhone 14'],
      },
    },
    // ローカル dev server 向け（admin/agent テスト）
    {
      name: 'local',
      testMatch: /(admin-agent|guides)\.spec\.ts/,
      use: {
        baseURL: 'http://localhost:8080',
        ...devices['Pixel 5'],
      },
    },
  ],

  // 両プロジェクトともdev serverを利用
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:8080',
    reuseExistingServer: true,
    timeout: 30000,
  },
});
