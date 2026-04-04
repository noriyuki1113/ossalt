/**
 * Normalize dynamic/user-generated Japanese text before rendering.
 * Applies NFC normalization and strips invisible characters that can
 * cause intermittent rendering anomalies on mobile browsers.
 */

const INVISIBLE_RE = /[\u200B-\u200F\u2060-\u206F\uFEFF\u00AD]/g;

export function normalizeText(text: string | null | undefined): string {
  if (!text) return "";
  const normalized = text.normalize("NFC");
  const cleaned = normalized.replace(INVISIBLE_RE, "");

  if (process.env.NODE_ENV === "development" && cleaned.includes("\uFFFD")) {
    console.warn("[normalizeText] Replacement character \uFFFD detected:", text);
  }

  return cleaned;
}
