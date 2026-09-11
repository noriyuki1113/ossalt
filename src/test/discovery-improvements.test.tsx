import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { SearchBar } from "@/components/SearchBar";
import { searchTerms, toolSearchFilter } from "@/lib/tool-search";

describe("service discovery", () => {
  it("submits the search form without navigating away", () => {
    const submit = vi.fn();
    render(<SearchBar value="Notion" onChange={() => {}} onSubmit={submit} />);
    fireEvent.submit(screen.getByRole("search"));
    expect(submit).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("searchbox")).toHaveValue("Notion");
    cleanup();
  });
  it("supports multiword services and Japanese suffixes", () => {
    expect(searchTerms(" Ｎｏｔｉｏｎ 代替 ")).toEqual(["Notion"]);
    expect(searchTerms("Google Analytics")).toEqual(["Google", "Analytics"]);
    expect(searchTerms(" ")).toEqual([]);
  });
  it("removes filter operators from user input", () => {
    const terms = searchTerms('Notion%,name.eq.*(x)');
    expect(terms.every(term => !/[,().%_*]/.test(term))).toBe(true);
    expect(toolSearchFilter("Notion")).toContain("primary_competitor.ilike.%Notion%");
  });
});
