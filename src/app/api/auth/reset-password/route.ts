import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit, getIP, rateLimitResponse } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  const ip = getIP(request)
  const rl = await checkRateLimit({ name: "reset-password", limit: 5, windowSeconds: 900, identifier: ip })
  if (rl.limited) return rateLimitResponse(rl.retryAfter)

  // TODO: implement reset-password token validation and password update
  return NextResponse.json({ error: "Not implemented" }, { status: 501 })
}
