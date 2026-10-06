/**
 * Rate limiter sederhana berbasis in-memory Map.
 *
 * Cukup untuk keperluan landing page: mencegah bot mengirim ratusan
 * request dari satu IP dalam waktu singkat.
 *
 * CATATAN: ini berjalan per-instance. Untuk deployment multi-instance,
 * ganti dengan Upstash Redis / Vercel KV.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Bersihkan bucket yang sudah kedaluwarsa agar Map tidak tumbuh terus. */
function sweep(now: number): void {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

/**
 * Coba ambil token untuk sebuah identifier (biasanya IP).
 *
 * @returns true bila masih di bawah batas, false bila kena rate limit.
 */
export function checkRateLimit(
  identifier: string,
  limit = 5,
  windowMs = 60_000,
): boolean {
  const now = Date.now();
  sweep(now);

  const bucket = buckets.get(identifier);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(identifier, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (bucket.count >= limit) return false;

  bucket.count += 1;
  return true;
}

/** Ambil sisa token yang tersedia (untuk debugging/testing). */
export function remainingTokens(
  identifier: string,
  limit = 5,
): number {
  const bucket = buckets.get(identifier);
  if (!bucket || bucket.resetAt <= Date.now()) return limit;
  return Math.max(0, limit - bucket.count);
}