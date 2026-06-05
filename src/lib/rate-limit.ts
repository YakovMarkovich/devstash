import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { NextRequest, NextResponse } from "next/server"

let redis: Redis | null = null
function getRedis() {
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  }
  return redis
}

// One Ratelimit instance per rule (name + limit + window), not per request.
// The per-request identifier is only passed to limiter.limit().
const limiters = new Map<string, Ratelimit>()
function getLimiter(name: string, limit: number, windowSeconds: number): Ratelimit {
  const cacheKey = `${name}:${limit}:${windowSeconds}`
  if (!limiters.has(cacheKey)) {
    limiters.set(
      cacheKey,
      new Ratelimit({
        redis: getRedis(),
        limiter: Ratelimit.slidingWindow(limit, `${windowSeconds} s`),
        prefix: `rl:${name}`,
      })
    )
  }
  return limiters.get(cacheKey)!
}

export function getIP(req: NextRequest | Request): string {
  const forwarded =
    req.headers.get("x-forwarded-for") ??
    req.headers.get("x-real-ip") ??
    "127.0.0.1"
  return forwarded.split(",")[0].trim()
}

type RateLimitConfig = {
  /** Short stable name for the rule, e.g. "login", "register". Used as Redis key prefix. */
  name: string
  limit: number
  windowSeconds: number
  /** Per-request differentiator, e.g. IP or IP+email. Used as the limiter identifier. */
  identifier: string
}

export async function checkRateLimit(
  config: RateLimitConfig
): Promise<{ limited: boolean; retryAfter: number }> {
  try {
    const limiter = getLimiter(config.name, config.limit, config.windowSeconds)
    const { success, reset } = await limiter.limit(config.identifier)
    if (!success) {
      const retryAfter = Math.ceil((reset - Date.now()) / 1000)
      return { limited: true, retryAfter: Math.max(retryAfter, 1) }
    }
    return { limited: false, retryAfter: 0 }
  } catch {
    // Fail open — allow the request if Upstash is unavailable
    return { limited: false, retryAfter: 0 }
  }
}

export function rateLimitResponse(retryAfter: number): NextResponse {
  const minutes = Math.ceil(retryAfter / 60)
  return NextResponse.json(
    { error: `Too many attempts. Please try again in ${minutes} minute${minutes !== 1 ? "s" : ""}.` },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfter) },
    }
  )
}
