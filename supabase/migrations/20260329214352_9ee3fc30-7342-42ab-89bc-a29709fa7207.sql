CREATE INDEX IF NOT EXISTS idx_tools_parent_category_ja ON tools(parent_category_ja);
CREATE INDEX IF NOT EXISTS idx_tools_category_ja ON tools(category_ja);
CREATE INDEX IF NOT EXISTS idx_tools_stars_num ON tools(stars_num DESC);