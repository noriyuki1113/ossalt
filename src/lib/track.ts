/**
 * Lightweight event tracking utility.
 * Sends events to the existing Supabase Edge Function (`track`).
 * Uses sendBeacon/fetch(keepalive) so it never blocks UI.
 */

const TRACK_URL = "https://wcuofgycadbydhtuevay.supabase.co/functions/v1/track";

interface TrackPayload {
  event_type: string;
  path: string;
  [key: string]: string | number | boolean | null | undefined;
}

export function track(
  eventType: string,
  extra: Record<string, string | number | boolean | null | undefined> = {},
) {
  try {
    const payload: TrackPayload = {
      event_type: eventType,
      path: window.location.pathname,
      ...extra,
    };
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(TRACK_URL, body);
    } else {
      fetch(TRACK_URL, { method: "POST", body, keepalive: true });
    }
  } catch {
    // silently ignore – tracking must never break UX
  }
}
