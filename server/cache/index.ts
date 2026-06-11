/**
 * Tiny in-process multi-level cache with TTL. Suitable for SSR HTML and hot
 * read paths. For a single Autoscale instance this is per-instance; correctness
 * never depends on it (it's a cache, not state).
 */
export const TTL = {
  SHORT: 60_000, // 1 min — fixtures / What's On
  MEDIUM: 5 * 60_000, // 5 min — sitemap, semi-static pages
  LONG: 15 * 60_000, // 15 min — static marketing pages
} as const;

interface Entry<T> {
  value: T;
  expiresAt: number;
}

const store = new Map<string, Entry<unknown>>();

export function cacheGet<T>(key: string): T | undefined {
  const hit = store.get(key);
  if (!hit) return undefined;
  if (Date.now() > hit.expiresAt) {
    store.delete(key);
    return undefined;
  }
  return hit.value as T;
}

export function cacheSet<T>(key: string, value: T, ttlMs: number): void {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export async function cached<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const hit = cacheGet<T>(key);
  if (hit !== undefined) return hit;
  const value = await fn();
  cacheSet(key, value, ttlMs);
  return value;
}

/** Invalidate by exact key or prefix (e.g. invalidate all SSR pages). */
export function cacheInvalidate(prefix: string): void {
  for (const key of store.keys()) {
    if (key === prefix || key.startsWith(prefix)) store.delete(key);
  }
}

export function cacheClear(): void {
  store.clear();
}
