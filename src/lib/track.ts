/**
 * Lightweight event tracking utility.
 * Sends events to the project's `track` Edge Function.
 * Uses sendBeacon/fetch(keepalive) so it never blocks UI.
 */

const PROJECT_ID = import.meta.env.VITE_SUPABASE_PROJECT_ID;
const TRACK_URL = `https://${PROJECT_ID}.supabase.co/functions/v1/track`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

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

    // sendBeacon doesn't allow custom headers; fall back to fetch+keepalive
    // so we can pass the anon apikey/Authorization headers required by the
    // Supabase Edge Function gateway.
    fetch(TRACK_URL, {
      method: "POST",
      body,
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
    }).catch(() => {
      /* best effort */
    });
  } catch {
    // silently ignore – tracking must never break UX
  }
}
