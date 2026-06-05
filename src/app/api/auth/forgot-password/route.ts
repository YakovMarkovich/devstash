import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit, getIP, rateLimitResponse } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  const ip = getIP(request)
  const rl = await checkRateLimit({ name: "forgot-password", limit: 3, windowSeconds: 3600, identifier: ip })
  if (rl.limited) return rateLimitResponse(rl.retryAfter)

  // TODO: implement forgot-password email flow
  return NextResponse.json({ error: "Not implemented" }, { status: 501 })
}
