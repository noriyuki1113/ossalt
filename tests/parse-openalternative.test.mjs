import { test } from "node:test";
import assert from "node:assert/strict";
import { parseReadme } from "../supabase/functions/sync-openalternative/parse-readme.mjs";

test("reads only catalog entries and keeps upstream metadata as unverified claims", () => {
  const markdown = `## Sponsors
- [Paid link](https://example.com) - Advertiser
## Contents
- [AI & Machine Learning](#ai--machine-learning)
## AI & Machine Learning
### AI Development Platforms
- [Example](https://openalternative.co/example) - A platform \`MIT\` \`⭐ 1.2K\`
### AI Interfaces
- [Example](https://openalternative.co/example) - Same project in another category
- [Second](https://openalternative.co/second) - Unverified license \`⭐ 12\`
## Contributing
- [Another](https://openalternative.co/another) - Ignore this
`;
  assert.deepEqual(parseReadme(markdown), [
    {
      name: "Example", source_url: "https://openalternative.co/example",
      description_en: "A platform", parent_category_en: "AI & Machine Learning",
      category_en: "AI Development Platforms", license_claim: "MIT", stars_claim: "1.2K",
    },
    {
      name: "Second", source_url: "https://openalternative.co/second",
      description_en: "Unverified license", parent_category_en: "AI & Machine Learning",
      category_en: "AI Interfaces", license_claim: null, stars_claim: "12",
    },
  ]);
});
