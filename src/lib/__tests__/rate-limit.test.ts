import { describe, it, expect } from 'vitest'
import { getIP, rateLimitResponse } from '@/lib/rate-limit'

describe('getIP', () => {
  it('extracts the first IP from x-forwarded-for', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' },
    })
    expect(getIP(req)).toBe('1.2.3.4')
  })

  it('trims whitespace from extracted IP', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-forwarded-for': '  1.2.3.4  ' },
    })
    expect(getIP(req)).toBe('1.2.3.4')
  })

  it('falls back to x-real-ip when x-forwarded-for is absent', () => {
    const req = new Request('http://localhost', {
      headers: { 'x-real-ip': '9.9.9.9' },
    })
    expect(getIP(req)).toBe('9.9.9.9')
  })

  it('defaults to 127.0.0.1 when no IP headers are present', () => {
    const req = new Request('http://localhost')
    expect(getIP(req)).toBe('127.0.0.1')
  })
})

describe('rateLimitResponse', () => {
  it('returns HTTP 429', async () => {
    const res = rateLimitResponse(60)
    expect(res.status).toBe(429)
  })

  it('sets the Retry-After header to the given seconds', async () => {
    const res = rateLimitResponse(120)
    expect(res.headers.get('Retry-After')).toBe('120')
  })

  it('formats plural minutes in the error message', async () => {
    const res = rateLimitResponse(120)
    const body = await res.json()
    expect(body.error).toContain('2 minutes')
  })

  it('formats singular minute in the error message', async () => {
    const res = rateLimitResponse(59)
    const body = await res.json()
    expect(body.error).toContain('1 minute')
    expect(body.error).not.toContain('minutes')
  })

  it('rounds a partial minute up', async () => {
    const res = rateLimitResponse(61)
    const body = await res.json()
    expect(body.error).toContain('2 minutes')
  })
})
