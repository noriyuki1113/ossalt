/** Keep user text out of PostgREST filter syntax; support common SaaS queries. */
export function searchTerms(value: string): string[] {
  return value.normalize("NFKC")
    .trim().replace(/代替$/u, "")
    .replace(/[,().%_*"\\{}:]/g, " ")
    .trim().split(/\s+/u).filter(Boolean).slice(0, 8);
}

export function toolSearchFilter(term: string): string {
  return ["name", "description_ja", "description_en", "primary_competitor", "primary_competitor_ja", "category_ja", "category_en"]
    .map(column => `${column}.ilike.%${term}%`).join(",");
}
