import { describe, test, expect } from 'vitest'
import { formatNumber } from '../index'

describe('number', () => {
  test('formatNumber', () => {
    expect(formatNumber(123456789)).toBe('123,456,789.00')
  })
  test('formatNumber with decimals', () => {
    expect(formatNumber(123456789, 2)).toBe('123,456,789.00')
  })
  test('formatNumber with string', () => {
    expect(formatNumber('123456789', 2)).toBe('123,456,789.00')
  })
  test('formatNumber with null', () => {
    expect(formatNumber(null, 2)).toBe('')
  })
  test('formatNumber with undefined', () => {
    expect(formatNumber(undefined, 2)).toBe('')
  })
  test('formatNumber with NaN', () => {
    expect(formatNumber(NaN, 2)).toBe('')
  })

  test('formatNumber with object', () => {
    expect(formatNumber({ a: 1 } as any, 2)).toBe('')
  })
  test('formatNumber with array', () => {
    expect(formatNumber([1, 2, 3] as any, 2)).toBe('')
  })
})
