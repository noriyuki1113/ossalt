/**
 * Maps a tool's name (lowercase) to its dedicated self-host guide route,
 * for tools that have one. Used to cross-link tool cards to guides.
 */
export const SELFHOST_GUIDE_BY_TOOL: Record<string, string> = {
  "n8n": "/guides/n8n-selfhost-vps",
  "appflowy": "/guides/appflowy-selfhost-vps",
  "baserow": "/guides/baserow-selfhost-vps",
  "plausible": "/guides/plausible-selfhost-vps",
  "metabase": "/guides/metabase-selfhost-vps",
  "nocodb": "/guides/nocodb-selfhost-vps",
  "umami": "/guides/umami-selfhost-vps",
  "coolify": "/guides/coolify-selfhost-vps",
  "nextcloud": "/guides/nextcloud-selfhost-vps",
  "vaultwarden": "/guides/vaultwarden-selfhost-vps",
  "gitea": "/guides/gitea-selfhost-vps",
};

export function getSelfhostGuideLink(toolName: string | null | undefined): string | null {
  if (!toolName) return null;
  return SELFHOST_GUIDE_BY_TOOL[toolName.trim().toLowerCase()] ?? null;
}
