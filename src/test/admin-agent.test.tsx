import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import React from "react";

import AdminAgentPage, { arrToText, textToArr, isGitHubUrl } from "@/pages/AdminAgent";

// ── Mocks ────────────────────────────────────────────────────────────────────

// vi.hoisted で宣言しないとホイスト後に TDZ エラーになる
const { mockInvoke, mockFrom } = vi.hoisted(() => ({
  mockInvoke: vi.fn(),
  mockFrom: vi.fn(),
}));

// チェーンを返す Supabase builder モック
function makeBuilderMock(resolved: { data: unknown; error: unknown }) {
  const builder: Record<string, unknown> = {};
  ["select", "order", "limit", "insert", "update", "delete", "eq", "single"].forEach((k) => {
    builder[k] = vi.fn().mockImplementation(() => {
      if (["limit", "single"].includes(k)) return Promise.resolve(resolved);
      return builder;
    });
  });
  return builder;
}

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    functions: { invoke: mockInvoke },
    from: mockFrom,
  },
}));

vi.mock("@/hooks/use-seo", () => ({ useSeo: vi.fn() }));

vi.mock("@/components/SiteLayout", () => ({
  SiteLayout: ({ children }: { children: React.ReactNode }) => <div data-testid="layout">{children}</div>,
}));

// ── Helper ───────────────────────────────────────────────────────────────────

function makeQc() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

function Wrapper({ children }: { children: React.ReactNode }) {
  const qc = makeQc();
  return (
    <QueryClientProvider client={qc}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

// ── Pure utility tests ───────────────────────────────────────────────────────

describe("textToArr", () => {
  it("splits lines and trims whitespace", () => {
    expect(textToArr("Notion\n Slack \nLinear")).toEqual(["Notion", "Slack", "Linear"]);
  });

  it("filters out blank lines", () => {
    expect(textToArr("A\n\nB\n   ")).toEqual(["A", "B"]);
  });

  it("returns empty array for empty string", () => {
    expect(textToArr("")).toEqual([]);
  });
});

describe("arrToText", () => {
  it("joins with newline", () => {
    expect(arrToText(["A", "B", "C"])).toBe("A\nB\nC");
  });

  it("handles null gracefully", () => {
    expect(arrToText(null)).toBe("");
    expect(arrToText(undefined)).toBe("");
  });

  it("handles empty array", () => {
    expect(arrToText([])).toBe("");
  });
});

describe("isGitHubUrl", () => {
  it("accepts github.com URLs", () => {
    expect(isGitHubUrl("https://github.com/owner/repo")).toBe(true);
    expect(isGitHubUrl("http://github.com/foo")).toBe(true);
  });

  it("rejects non-GitHub URLs", () => {
    expect(isGitHubUrl("https://gitlab.com/owner/repo")).toBe(false);
    expect(isGitHubUrl("https://example.com")).toBe(false);
  });

  it("rejects invalid URLs", () => {
    expect(isGitHubUrl("not-a-url")).toBe(false);
    expect(isGitHubUrl("")).toBe(false);
  });
});

// ── Component tests ───────────────────────────────────────────────────────────

describe("AdminAgentPage", () => {
  beforeEach(() => {
    mockInvoke.mockReset();
    mockFrom.mockReset();
    // DraftList のデフォルト: 下書きなし
    mockFrom.mockReturnValue(makeBuilderMock({ data: [], error: null }));
  });

  it("renders URL input and disabled generate button", async () => {
    render(<AdminAgentPage />, { wrapper: Wrapper });

    expect(screen.getByPlaceholderText(/github\.com\/owner\/repo/i)).toBeInTheDocument();
    const btn = screen.getByRole("button", { name: /AIで調査する/i });
    expect(btn).toBeDisabled();
  });

  it("enables generate button when URL is entered", async () => {
    render(<AdminAgentPage />, { wrapper: Wrapper });

    const input = screen.getByPlaceholderText(/github\.com\/owner\/repo/i);
    fireEvent.change(input, { target: { value: "https://github.com/appflowy/appflowy" } });

    expect(screen.getByRole("button", { name: /AIで調査する/i })).toBeEnabled();
  });

  it("shows loading state and calls supabase.functions.invoke with the URL", async () => {
    // invoke が解決しないままにして loading state をキャプチャ
    let resolveInvoke!: (v: unknown) => void;
    mockInvoke.mockReturnValue(new Promise(r => { resolveInvoke = r; }));

    render(<AdminAgentPage />, { wrapper: Wrapper });

    const input = screen.getByPlaceholderText(/github\.com\/owner\/repo/i);
    fireEvent.change(input, { target: { value: "https://github.com/test/repo" } });
    fireEvent.click(screen.getByRole("button", { name: /AIで調査する/i }));

    await waitFor(() => {
      expect(screen.getByText(/調査中/)).toBeInTheDocument();
    });

    expect(mockInvoke).toHaveBeenCalledWith("generate-tool-draft", {
      body: { url: "https://github.com/test/repo" },
    });

    // Promiseを解決して保留中の状態更新をフラッシュ
    await act(async () => {
      resolveInvoke({ data: { draft: null }, error: null });
    });
  });

  it("shows error message when Edge Function returns an error", async () => {
    mockInvoke.mockResolvedValue({
      data: { error: "GitHub URLを入力してください" },
      error: null,
    });

    render(<AdminAgentPage />, { wrapper: Wrapper });

    fireEvent.change(
      screen.getByPlaceholderText(/github\.com\/owner\/repo/i),
      { target: { value: "https://not-github.com/foo" } },
    );
    fireEvent.click(screen.getByRole("button", { name: /AIで調査する/i }));

    await waitFor(() => {
      expect(screen.getByText(/GitHub URLを入力してください/)).toBeInTheDocument();
    });
  });

  it("shows error when invoke itself throws (network error)", async () => {
    mockInvoke.mockRejectedValue(new Error("Network failure"));

    render(<AdminAgentPage />, { wrapper: Wrapper });

    fireEvent.change(
      screen.getByPlaceholderText(/github\.com\/owner\/repo/i),
      { target: { value: "https://github.com/owner/repo" } },
    );
    fireEvent.click(screen.getByRole("button", { name: /AIで調査する/i }));

    await waitFor(() => {
      expect(screen.getByText(/Network failure/)).toBeInTheDocument();
    });
  });

  it("shows draft form with generated fields after successful generation", async () => {
    const mockDraft = {
      id: "uuid-1",
      name: "AppFlowy",
      summary_ja: "Notionの代替OSSです",
      category: "生産性",
      alternative_to: ["Notion", "Confluence"],
      use_cases: ["個人メモ", "チームWiki"],
      pros: ["完全無料", "自己ホスト"],
      cons: ["設定が必要"],
      vps_supported: true,
      docker_supported: true,
      difficulty: "中程度",
      license_note: "AGPLライセンス",
      commercial_use_note: "商用可",
      recommended_for: ["エンジニア"],
      not_recommended_for: ["非技術者"],
      setup_notes: "Dockerで起動できます",
      seo_title: "AppFlowyの使い方",
      seo_description: "AppFlowyはNotionの代替",
      source_url: "https://appflowy.io",
      github_url: "https://github.com/appflowy/appflowy",
      status: "draft",
    };

    mockInvoke.mockResolvedValue({ data: { draft: mockDraft }, error: null });

    render(<AdminAgentPage />, { wrapper: Wrapper });

    fireEvent.change(
      screen.getByPlaceholderText(/github\.com\/owner\/repo/i),
      { target: { value: "https://github.com/appflowy/appflowy" } },
    );
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /AIで調査する/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/生成完了/)).toBeInTheDocument();
    });

    // ツール名フィールドに値が入っている
    const nameInput = screen.getByDisplayValue("AppFlowy");
    expect(nameInput).toBeInTheDocument();

    // サマリーが表示されている
    expect(screen.getByDisplayValue("Notionの代替OSSです")).toBeInTheDocument();

    // 下書き保存ボタンと公開ボタンが表示されている
    expect(screen.getByRole("button", { name: /下書き保存/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /toolsテーブルへ公開/ })).toBeInTheDocument();
  });

  it("saves draft when save button is clicked", async () => {
    const mockDraft = {
      id: "uuid-1",
      name: "TestTool",
      summary_ja: "テスト",
      category: "その他",
      alternative_to: [], use_cases: [], pros: [], cons: [],
      vps_supported: false, docker_supported: true,
      difficulty: "簡単", license_note: "", commercial_use_note: "",
      recommended_for: [], not_recommended_for: [],
      setup_notes: "", seo_title: "", seo_description: "",
      source_url: "https://test.com",
      github_url: "https://github.com/test/tool",
      status: "draft",
    };

    mockInvoke.mockResolvedValue({ data: { draft: mockDraft }, error: null });

    // save用のmockを設定
    const updateBuilder = makeBuilderMock({ data: mockDraft, error: null });
    mockFrom.mockReturnValue(updateBuilder);

    render(<AdminAgentPage />, { wrapper: Wrapper });

    fireEvent.change(
      screen.getByPlaceholderText(/github\.com\/owner\/repo/i),
      { target: { value: "https://github.com/test/tool" } },
    );
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /AIで調査する/i }));
    });

    await waitFor(() => screen.getByRole("button", { name: /下書き保存/ }));
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /下書き保存/ }));
    });

    await waitFor(() => {
      expect(screen.getByText(/下書きを保存しました/)).toBeInTheDocument();
    });
  });

  it("shows draft list section", async () => {
    const drafts = [
      { id: "1", name: "Tool A", category: "開発ツール", status: "draft", source_url: "https://a.com", github_url: "https://github.com/a/a", created_at: "2026-05-17T00:00:00Z" },
      { id: "2", name: "Tool B", category: "生産性", status: "published", source_url: "https://b.com", github_url: "https://github.com/b/b", created_at: "2026-05-16T00:00:00Z" },
    ];
    mockFrom.mockReturnValue(makeBuilderMock({ data: drafts, error: null }));

    render(<AdminAgentPage />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText("Tool A")).toBeInTheDocument();
      expect(screen.getByText("Tool B")).toBeInTheDocument();
    });

    expect(screen.getByText("下書き")).toBeInTheDocument();
    expect(screen.getByText("公開済")).toBeInTheDocument();
  });

  it("clears previous error when a new generation starts", async () => {
    mockInvoke
      .mockResolvedValueOnce({ data: { error: "最初のエラー" }, error: null })
      .mockReturnValueOnce(new Promise(() => {})); // 2回目は pending

    render(<AdminAgentPage />, { wrapper: Wrapper });

    const input = screen.getByPlaceholderText(/github\.com\/owner\/repo/i);
    fireEvent.change(input, { target: { value: "https://github.com/x/y" } });

    await act(async () => { fireEvent.click(screen.getByRole("button", { name: /AIで調査する/i })); });
    await waitFor(() => screen.getByText("最初のエラー"));

    // 2回目の生成で前のエラーが消える
    await act(async () => { fireEvent.click(screen.getByRole("button", { name: /AIで調査する/i })); });
    expect(screen.queryByText("最初のエラー")).not.toBeInTheDocument();
  });
});
