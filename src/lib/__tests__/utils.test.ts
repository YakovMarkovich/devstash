import { describe, it, expect } from 'vitest'
import { cn, formatDate } from '@/lib/utils'

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b')
  })

  it('drops falsy values', () => {
    expect(cn('a', false && 'b', undefined, 'c')).toBe('a c')
  })

  it('last tailwind class wins on conflict', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4')
  })

  it('merges responsive and base without conflict', () => {
    expect(cn('p-2', 'md:p-4')).toBe('p-2 md:p-4')
  })
})

describe('formatDate', () => {
  it('formats to short month and day', () => {
    expect(formatDate(new Date('2026-01-15'))).toBe('Jan 15')
  })

  it('formats single-digit day without padding', () => {
    expect(formatDate(new Date('2026-03-05'))).toBe('Mar 5')
  })

  it('formats December correctly', () => {
    expect(formatDate(new Date('2026-12-31'))).toBe('Dec 31')
  })
})
