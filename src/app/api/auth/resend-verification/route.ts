import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit, getIP, rateLimitResponse } from "@/lib/rate-limit"

export async function POST(request: NextRequest) {
  const ip = getIP(request)
  const body = await request.json().catch(() => ({}))
  const email = typeof body?.email === "string" ? body.email.toLowerCase() : ""

  const identifier = email ? `${ip}:${email}` : ip
  const rl = await checkRateLimit({ name: "resend-verification", limit: 3, windowSeconds: 900, identifier })
  if (rl.limited) return rateLimitResponse(rl.retryAfter)

  // TODO: implement resend-verification email flow
  return NextResponse.json({ error: "Not implemented" }, { status: 501 })
}
