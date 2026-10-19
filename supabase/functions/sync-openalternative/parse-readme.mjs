// OpenAlternative's curated list is a discovery source. Its license and star
// labels are claims to verify against each project's own repository.
export function parseReadme(markdown) {
  const tools = [];
  const seenNames = new Set();
  const seenUrls = new Set();
  let parent = "";
  let category = "";
  let inCatalog = false;

  for (const line of markdown.split(/\r?\n/)) {
    const section = line.match(/^##\s+(.+)$/);
    if (section) {
      parent = section[1].trim();
      category = "";
      inCatalog = parent === "AI & Machine Learning" || inCatalog && !["Contributing", "Footnotes"].includes(parent);
      if (["Contributing", "Footnotes"].includes(parent)) inCatalog = false;
      continue;
    }
    if (!inCatalog) continue;
    const subsection = line.match(/^###\s+(.+)$/);
    if (subsection) {
      category = subsection[1].trim();
      continue;
    }
    if (!category) continue;
    const entry = line.match(/^-\s+\[([^\]]+)\]\((https:\/\/[^)]+)\)\s+-\s+(.+)$/);
    if (!entry) continue;
    const [, rawName, sourceUrl, rawDescription] = entry;
    let url;
    try { url = new URL(sourceUrl); } catch { continue; }
    // Sponsor links and table-of-contents links are not catalog records.
    if (!['openalternative.co', 'www.openalternative.co'].includes(url.hostname) || url.pathname === '/') continue;
    const name = rawName.trim();
    const key = name.toLocaleLowerCase('en-US');
    const canonicalUrl = `${url.origin}${url.pathname.replace(/\/$/, '')}`;
    if (!name || seenNames.has(key) || seenUrls.has(canonicalUrl)) continue;
    seenNames.add(key);
    seenUrls.add(canonicalUrl);
    const annotations = [...rawDescription.matchAll(/`([^`]+)`/g)].map(m => m[1]);
    const licenseClaim = annotations.find(s => !s.startsWith('⭐')) || null;
    const starsClaim = annotations.find(s => s.startsWith('⭐'))?.slice(1).trim() || null;
    tools.push({
      name,
      source_url: canonicalUrl,
      description_en: rawDescription.replace(/`[^`]+`/g, '').trim(),
      parent_category_en: parent,
      category_en: category,
      license_claim: licenseClaim,
      stars_claim: starsClaim,
    });
  }
  return tools;
}
