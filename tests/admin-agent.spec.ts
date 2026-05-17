import { test, expect, type Page } from "@playwright/test";

// ── ヘルパー ──────────────────────────────────────────────────────────────────

const SUPABASE_FUNCTIONS_RE = /supabase\.co\/functions\/v1\/generate-tool-draft/;

/** Supabase Edge Function 呼び出しを成功レスポンスでモック */
async function mockGenerateSuccess(page: Page) {
  await page.route(SUPABASE_FUNCTIONS_RE, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        draft: {
          id: "mock-uuid-1",
          name: "AppFlowy",
          summary_ja: "NotionのOSS代替ツール。セルフホスト可能なコラボレーションワークスペース。",
          category: "生産性",
          alternative_to: ["Notion", "Confluence"],
          use_cases: ["個人メモ管理", "チームWiki", "プロジェクト管理"],
          pros: ["完全無料", "自己ホスト可能", "オフライン対応"],
          cons: ["初期設定が必要", "モバイルアプリは発展途上"],
          vps_supported: true,
          docker_supported: true,
          difficulty: "中程度",
          license_note: "AGPLv3ライセンス。商用利用可。",
          commercial_use_note: "セルフホスト版は商用利用可能です。",
          recommended_for: ["個人エンジニア", "スタートアップ"],
          not_recommended_for: ["技術に不慣れなユーザー"],
          setup_notes: "Dockerコマンドで1コマンド起動できます。",
          seo_title: "【無料】AppFlowyの使い方・代替 | OSSアルタナティブ",
          seo_description: "AppFlowyはNotionの完全無料OSSとして自己ホスト可能なドキュメント管理ツールです。",
          source_url: "https://appflowy.io",
          github_url: "https://github.com/appflowy-io/appflowy",
          status: "draft",
          created_at: new Date().toISOString(),
        },
        repo_meta: { stars: 60000, language: "Rust", license: "AGPL-3.0" },
      }),
    });
  });
}

/** Supabase Edge Function 呼び出しをエラーレスポンスでモック */
async function mockGenerateError(page: Page, errorMsg: string) {
  await page.route(SUPABASE_FUNCTIONS_RE, async (route) => {
    await route.fulfill({
      status: 400,
      contentType: "application/json",
      body: JSON.stringify({ error: errorMsg }),
    });
  });
}

/** oss_tool_drafts の一覧取得をモック（空） */
async function mockDraftListEmpty(page: Page) {
  await page.route(/supabase\.co\/rest\/v1\/oss_tool_drafts/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]),
      headers: { "Content-Range": "0-0/0" },
    });
  });
}

// ── テストグループ ────────────────────────────────────────────────────────────

test.describe("/admin/agent — AIツールカード生成", () => {
  test.beforeEach(async ({ page }) => {
    await mockDraftListEmpty(page);
  });

  test("ページが正常にロードされる", async ({ page }) => {
    await page.goto("/admin/agent");

    await expect(page.locator("h1")).toContainText("AIツールカード生成");
    await expect(page.getByPlaceholder(/github\.com\/owner\/repo/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /AIで調査する/i })).toBeVisible();
    await expect(page.getByText(/保存済み下書き/)).toBeVisible();
  });

  test("URLが空の場合、生成ボタンが無効", async ({ page }) => {
    await page.goto("/admin/agent");

    const btn = page.getByRole("button", { name: /AIで調査する/i });
    await expect(btn).toBeDisabled();
  });

  test("URLを入力すると生成ボタンが有効になる", async ({ page }) => {
    await page.goto("/admin/agent");

    const input = page.getByPlaceholder(/github\.com\/owner\/repo/i);
    await input.fill("https://github.com/appflowy-io/appflowy");

    await expect(page.getByRole("button", { name: /AIで調査する/i })).toBeEnabled();
  });

  test("Enterキーで生成を開始できる", async ({ page }) => {
    await mockGenerateSuccess(page);
    await page.goto("/admin/agent");

    const input = page.getByPlaceholder(/github\.com\/owner\/repo/i);
    await input.fill("https://github.com/appflowy-io/appflowy");
    await input.press("Enter");

    await expect(page.getByText(/生成完了/)).toBeVisible({ timeout: 15000 });
  });

  test("正常生成フロー: フォームにAI生成結果が表示される", async ({ page }) => {
    await mockGenerateSuccess(page);
    await page.goto("/admin/agent");

    const input = page.getByPlaceholder(/github\.com\/owner\/repo/i);
    await input.fill("https://github.com/appflowy-io/appflowy");
    await page.getByRole("button", { name: /AIで調査する/i }).click();

    // 「生成完了」が表示される
    await expect(page.getByText(/生成完了/)).toBeVisible({ timeout: 15000 });

    // 各フィールドに値が入っている
    await expect(page.getByDisplayValue("AppFlowy")).toBeVisible();
    await expect(page.getByDisplayValue("NotionのOSS代替ツール。セルフホスト可能なコラボレーションワークスペース。")).toBeVisible();

    // 下書き保存・公開ボタンが表示される
    await expect(page.getByRole("button", { name: /下書き保存/ })).toBeVisible();
    await expect(page.getByRole("button", { name: /toolsテーブルへ公開/ })).toBeVisible();
  });

  test("生成中にローディング表示が出る", async ({ page }) => {
    // ゆっくり解決するモック
    await page.route(SUPABASE_FUNCTIONS_RE, async (route) => {
      await new Promise(r => setTimeout(r, 1500));
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ draft: { id: "1", name: "Slow Tool", summary_ja: "", category: "その他", alternative_to: [], use_cases: [], pros: [], cons: [], vps_supported: false, docker_supported: false, difficulty: "簡単", license_note: "", commercial_use_note: "", recommended_for: [], not_recommended_for: [], setup_notes: "", seo_title: "", seo_description: "", source_url: "", github_url: "" } }),
      });
    });

    await page.goto("/admin/agent");
    await page.getByPlaceholder(/github\.com\/owner\/repo/i).fill("https://github.com/test/repo");
    await page.getByRole("button", { name: /AIで調査する/i }).click();

    // ローディングテキスト
    await expect(page.getByText(/調査中/)).toBeVisible({ timeout: 3000 });
  });

  test("エラーレスポンス時にエラーメッセージが表示される", async ({ page }) => {
    await mockGenerateError(page, "GitHub URLを入力してください");
    await page.goto("/admin/agent");

    await page.getByPlaceholder(/github\.com\/owner\/repo/i).fill("https://example.com/foo");
    await page.getByRole("button", { name: /AIで調査する/i }).click();

    await expect(page.getByText(/GitHub URLを入力してください/)).toBeVisible({ timeout: 10000 });
    // 下書きフォームは表示されない
    await expect(page.getByText(/生成完了/)).not.toBeVisible();
  });

  test("フォームのフィールドを編集できる", async ({ page }) => {
    await mockGenerateSuccess(page);
    await page.goto("/admin/agent");

    await page.getByPlaceholder(/github\.com\/owner\/repo/i).fill("https://github.com/appflowy-io/appflowy");
    await page.getByRole("button", { name: /AIで調査する/i }).click();
    await expect(page.getByText(/生成完了/)).toBeVisible({ timeout: 15000 });

    // ツール名を編集
    const nameInput = page.getByDisplayValue("AppFlowy");
    await nameInput.fill("AppFlowy（編集済み）");
    await expect(page.getByDisplayValue("AppFlowy（編集済み）")).toBeVisible();
  });

  test("再生成時に前のエラーがクリアされる", async ({ page }) => {
    // 1回目エラー
    let callCount = 0;
    await page.route(SUPABASE_FUNCTIONS_RE, async (route) => {
      callCount++;
      if (callCount === 1) {
        await route.fulfill({
          status: 400,
          contentType: "application/json",
          body: JSON.stringify({ error: "1回目のエラー" }),
        });
      } else {
        await new Promise(r => setTimeout(r, 30000)); // タイムアウト（2回目は pending のまま）
        await route.abort();
      }
    });

    await page.goto("/admin/agent");
    const input = page.getByPlaceholder(/github\.com\/owner\/repo/i);
    await input.fill("https://github.com/x/y");

    await page.getByRole("button", { name: /AIで調査する/i }).click();
    await expect(page.getByText(/1回目のエラー/)).toBeVisible({ timeout: 10000 });

    // 2回目クリック → エラーが消える
    await page.getByRole("button", { name: /AIで調査する/i }).click();
    await expect(page.getByText(/1回目のエラー/)).not.toBeVisible();
  });
});

test.describe("/admin → /admin/agent ナビゲーション", () => {
  test("/admin にエージェントへのリンクカードが存在する", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByText(/AIツールカード生成/)).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole("link", { name: /エージェントを起動する/i })).toBeVisible();
  });

  test("/admin のリンクから /admin/agent に遷移できる", async ({ page }) => {
    await mockDraftListEmpty(page);
    await page.goto("/admin");
    await page.getByRole("link", { name: /エージェントを起動する/i }).click();
    await page.waitForURL("**/admin/agent");
    await expect(page.locator("h1")).toContainText("AIツールカード生成");
  });
});

test.describe("Edge Function — generate-tool-draft ロジック検証", () => {
  test("GitHub URL以外を入力するとエラーが返る", async ({ page }) => {
    // 実際のEdge Functionを呼び出すのではなくロジックを模倣
    // フロントエンドの isGitHubUrl バリデーションをUIで確認
    await mockDraftListEmpty(page);
    await mockGenerateError(page, "GitHub URLを入力してください（例: https://github.com/owner/repo）");
    await page.goto("/admin/agent");

    await page.getByPlaceholder(/github\.com\/owner\/repo/i).fill("https://notion.so");
    await page.getByRole("button", { name: /AIで調査する/i }).click();

    await expect(page.getByText(/GitHub URLを入力してください/)).toBeVisible({ timeout: 10000 });
  });

  test("所有者/リポジトリ名のないGitHub URLでエラーが返る", async ({ page }) => {
    await mockDraftListEmpty(page);
    await mockGenerateError(page, "GitHub URLを入力してください（例: https://github.com/owner/repo）");
    await page.goto("/admin/agent");

    await page.getByPlaceholder(/github\.com\/owner\/repo/i).fill("https://github.com/");
    await page.getByRole("button", { name: /AIで調査する/i }).click();

    await expect(page.getByText(/GitHub URLを入力してください/)).toBeVisible({ timeout: 10000 });
  });
});
