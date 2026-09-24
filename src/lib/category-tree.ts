// Builds a tree from the flat `categories` table (33 rows, hierarchical via
// parent_id) and resolves a selected slug to itself plus all its
// descendants, so filtering by a parent category also matches projects
// tagged only with one of its children.

export interface CategoryRow {
  id: string;
  slug: string;
  name_ja: string;
  parent_id: string | null;
  sort_order: number;
}

export interface CategoryNode {
  id: string;
  slug: string;
  nameJa: string;
  sortOrder: number;
  children: CategoryNode[];
}

export function buildCategoryTree(rows: CategoryRow[]): CategoryNode[] {
  const nodeById = new Map<string, CategoryNode>();
  for (const row of rows) {
    nodeById.set(row.id, { id: row.id, slug: row.slug, nameJa: row.name_ja, sortOrder: row.sort_order, children: [] });
  }

  const roots: CategoryNode[] = [];
  for (const row of rows) {
    const node = nodeById.get(row.id)!;
    const parent = row.parent_id ? nodeById.get(row.parent_id) : undefined;
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const sortRec = (nodes: CategoryNode[]) => {
    nodes.sort((a, b) => a.sortOrder - b.sortOrder);
    nodes.forEach((n) => sortRec(n.children));
  };
  sortRec(roots);

  return roots;
}

export function findCategoryBySlug(tree: CategoryNode[], slug: string): CategoryNode | null {
  for (const node of tree) {
    if (node.slug === slug) return node;
    const found = findCategoryBySlug(node.children, slug);
    if (found) return found;
  }
  return null;
}

// This slug plus every descendant's slug — used so selecting a parent
// category also surfaces projects tagged only with one of its children.
export function collectSlugs(node: CategoryNode): string[] {
  return [node.slug, ...node.children.flatMap(collectSlugs)];
}
