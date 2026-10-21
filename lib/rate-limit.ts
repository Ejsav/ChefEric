import "server-only";

// Best-effort burst protection, per server instance. Serverless instances
// don't share memory, so this stops a single client hammering one instance;
// for a hard guarantee add a Vercel Firewall rate-limit rule on /api/*
// (see docs/OPERATIONS.md).
const buckets = new Map<string, number[]>();

const LOOPBACK = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);

export function clientIp(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "";
  return !ip || LOOPBACK.has(ip) ? "local" : ip;
}

/** True when `key` has made more than `max` calls within `windowMs`.
 *  Requests with no client address (a local server, the test suite) are
 *  never limited; Vercel always supplies one. */
export function limited(key: string, max = 6, windowMs = 10 * 60_000) {
  if (key.endsWith(":local")) return false;
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  buckets.set(key, recent);
  if (buckets.size > 5_000) {
    for (const [k, v] of buckets) if (!v.some((t) => now - t < windowMs)) buckets.delete(k);
  }
  return recent.length > max;
}
