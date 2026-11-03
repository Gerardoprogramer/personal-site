// Best-effort in-memory limiter. Each server instance keeps its own counts,
// so on serverless hosting this slows down abuse but is not a global limit.

const MAX_TRACKED_KEYS = 5000;

type Options = { limit: number; windowMs: number };

export function createRateLimiter({ limit, windowMs }: Options) {
  const hits = new Map<string, number[]>();

  return function check(key: string) {
    const now = Date.now();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

    if (recent.length >= limit) {
      hits.set(key, recent);
      const retryAfterMs = windowMs - (now - recent[0]);
      return { ok: false as const, retryAfter: Math.ceil(retryAfterMs / 1000) };
    }

    recent.push(now);
    hits.delete(key);
    hits.set(key, recent);

    // Map keeps insertion order, so the first key is the least recently used.
    if (hits.size > MAX_TRACKED_KEYS) {
      const oldest = hits.keys().next().value;
      if (oldest !== undefined) hits.delete(oldest);
    }

    return { ok: true as const };
  };
}

export function getClientIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip")?.trim() || null;
}
