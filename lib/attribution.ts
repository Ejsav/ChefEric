// Where serious clients come from. On every visit we keep the first touch
// (30 days, localStorage) and the current session's touch. Both travel with an
// inquiry so the office can see that a request began on Instagram, a
// concierge's link, a Google search or a private invitation.

export type Touch = {
  ts: number;
  landing: string;
  referrer?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
};

const FIRST = "ej:first-touch";
const SESSION = "ej:session-touch";
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

function read(store: Storage, key: string): Touch | null {
  try { return JSON.parse(store.getItem(key) ?? "null") as Touch | null; } catch { return null; }
}

export function captureAttribution() {
  if (typeof window === "undefined") return;
  const q = new URLSearchParams(location.search);
  const ref = document.referrer && new URL(document.referrer).origin !== location.origin ? document.referrer : undefined;
  const touch: Touch = {
    ts: Date.now(),
    landing: location.pathname + location.search,
    referrer: ref,
    source: q.get("utm_source") ?? q.get("ref") ?? undefined,
    medium: q.get("utm_medium") ?? undefined,
    campaign: q.get("utm_campaign") ?? undefined,
    content: q.get("utm_content") ?? undefined,
    term: q.get("utm_term") ?? undefined,
  };
  try {
    const first = read(localStorage, FIRST);
    if (!first || Date.now() - first.ts > THIRTY_DAYS) localStorage.setItem(FIRST, JSON.stringify(touch));
    if (!sessionStorage.getItem(SESSION)) sessionStorage.setItem(SESSION, JSON.stringify(touch));
  } catch {}
}

export function getAttribution(): { first: Touch | null; session: Touch | null } {
  if (typeof window === "undefined") return { first: null, session: null };
  try { return { first: read(localStorage, FIRST), session: read(sessionStorage, SESSION) }; } catch { return { first: null, session: null }; }
}
