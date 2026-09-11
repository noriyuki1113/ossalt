import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import IndexPage from "@/pages/Index";

const state = vi.hoisted(() => ({
  data: { tools: [{ id: 1, name: "Sample tool" }], totalCount: 1 },
  isError: false,
  refetch: vi.fn(),
}));
vi.mock("@/hooks/use-tools", () => ({ useTools: () => ({ ...state, isLoading: false }) }));
vi.mock("@/hooks/use-seo", () => ({ useSeo: () => {} }));
vi.mock("@/lib/track", () => ({ track: () => {} }));
vi.mock("@/components/SiteLayout", () => ({ SiteLayout: ({ children }: { children: ReactNode }) => <>{children}</> }));
vi.mock("@/components/ToolCard", () => ({ ToolCard: ({ tool }: { tool: { name: string } }) => <p>{tool.name}</p>, ToolCardSkeleton: () => null }));
vi.mock("@/components/LazySection", () => ({ LazySection: () => null }));
vi.mock("@/components/StatsBar", () => ({ StatsBar: () => null }));
vi.mock("@/components/home/QuickAlternativesPills", () => ({ QuickAlternativesPills: () => null }));
vi.mock("@/components/home/SponsorPitchSection", () => ({ SponsorPitchSection: () => null }));
vi.mock("@/components/ads/CategorySponsorCTA", () => ({ CategorySponsorCTA: () => null }));
vi.mock("@/components/discovery/FilterToolbar", () => ({ FilterToolbar: () => null }));

function NavigationHarness() {
  const navigate = useNavigate();
  const location = useLocation();
  return <>
    <output data-testid="location">{location.pathname}{location.search}</output>
    <button onClick={() => navigate(-1)}>Back in history</button>
    <button onClick={() => navigate("/?search=Slack")}>Open Slack search</button>
  </>;
}

async function open(path: string) {
  await act(async () => {
    render(<MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <NavigationHarness />
      <Routes>
        <Route path="/" element={<IndexPage />} />
        <Route path="/category/:slug" element={<IndexPage />} />
      </Routes>
    </MemoryRouter>);
  });
}

beforeEach(() => { state.isError = false; state.refetch.mockClear(); });
afterEach(cleanup);

describe("discovery navigation", () => {
  it("keeps cached results when the same search is submitted again", async () => {
    await open("/?search=Notion");
    fireEvent.submit(screen.getByRole("search"));
    expect(screen.getByText("Sample tool")).toBeInTheDocument();
  });

  it("preserves the search in category links and browser back navigation", async () => {
    await open("/?search=Notion");
    fireEvent.click(screen.getByRole("button", { name: /^業務ソフト$/ }));
    expect(screen.getByTestId("location")).toHaveTextContent("/category/business?search=Notion");
    fireEvent.click(screen.getByText("Back in history"));
    expect(screen.getByRole("searchbox")).toHaveValue("Notion");
    expect(screen.getByTestId("location")).toHaveTextContent("/?search=Notion");
  });

  it("updates the input when navigating to another search URL", async () => {
    await open("/?search=Notion");
    fireEvent.click(screen.getByText("Open Slack search"));
    expect(screen.getByRole("searchbox")).toHaveValue("Slack");
  });

  it("offers retry when loading fails", async () => {
    state.isError = true;
    await open("/?search=Notion");
    expect(screen.getByRole("alert")).toHaveTextContent("読み込めませんでした");
    fireEvent.click(screen.getByRole("button", { name: "再読み込み" }));
    expect(state.refetch).toHaveBeenCalledTimes(1);
  });
});
