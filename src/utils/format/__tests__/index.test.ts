import { describe, test, expect } from 'vitest'
import { formatPhone, formatIdCard, formatBankCard, formatAmount, formatPercent } from './index'

describe('formatPhone', () => {
  test('formats valid phone numbers with default separator', () => {
    expect(formatPhone('13812345678')).toBe('138 1234 5678')
    expect(formatPhone(13812345678)).toBe('138 1234 5678')
  })

  test('formats valid phone numbers with custom separator', () => {
    expect(formatPhone('13812345678', '-')).toBe('138-1234-5678')
  })

  test('handles invalid phone numbers', () => {
    expect(formatPhone('1381234')).toBe('1381234')
    expect(formatPhone('abc')).toBe('abc')
    expect(formatPhone('')).toBe('')
  })

  test('handles null and undefined', () => {
    expect(formatPhone(null as any)).toBe('null')
    expect(formatPhone(undefined as any)).toBe('undefined')
  })
})

describe('formatIdCard', () => {
  test('formats valid ID cards with default separator', () => {
    expect(formatIdCard('440101199001011234')).toBe('440101 19900101 1234')
    expect(formatIdCard('44010119900101123X')).toBe('440101 19900101 123X')
  })

  test('formats valid ID cards with custom separator', () => {
    expect(formatIdCard('440101199001011234', '-')).toBe('440101-19900101-1234')
  })

  test('handles invalid ID cards', () => {
    expect(formatIdCard('440101')).toBe('440101')
    expect(formatIdCard('')).toBe('')
  })

  test('handles null and undefined', () => {
    expect(formatIdCard(null as any)).toBe('null')
    expect(formatIdCard(undefined as any)).toBe('undefined')
  })
})

describe('formatBankCard', () => {
  test('formats valid bank card numbers with default separator', () => {
    expect(formatBankCard('6225365271562822')).toBe('6225 3652 7156 2822')
    expect(formatBankCard(6225365271562822)).toBe('6225 3652 7156 2822')
  })

  test('formats valid bank card numbers with custom separator', () => {
    expect(formatBankCard('6225365271562822', '-')).toBe('6225-3652-7156-2822')
  })

  test('handles invalid bank card numbers', () => {
    expect(formatBankCard('62253')).toBe('6225')
    expect(formatBankCard('')).toBe('')
  })

  test('handles null and undefined', () => {
    expect(formatBankCard(null as any)).toBe('')
    expect(formatBankCard(undefined as any)).toBe('')
  })
})

describe('formatAmount', () => {
  test('formats numbers with default options', () => {
    expect(formatAmount(1234567.89)).toBe('1,234,567.89')
    expect(formatAmount('1234567.89')).toBe('1,234,567.89')
  })

  test('formats with custom prefix and suffix', () => {
    expect(formatAmount(1234567.89, { prefix: '¥' })).toBe('¥1,234,567.89')
    expect(formatAmount(1234567.89, { suffix: ' USD' })).toBe('1,234,567.89 USD')
  })

  test('formats with custom decimal options', () => {
    expect(formatAmount(1234567.89, { decimals: 0 })).toBe('1,234,568')
    expect(formatAmount(1234567.89, { decimals: 3 })).toBe('1,234,567.890')
  })

  test('formats with custom separators', () => {
    expect(formatAmount(1234567.89, { decimalSeparator: ',', thousandsSeparator: '.' })).toBe('1.234.567,89')
  })

  test('handles invalid numbers', () => {
    expect(formatAmount('abc')).toBe('abc')
    expect(formatAmount('')).toBe('0.00')
  })

  test('handles null and undefined', () => {
    expect(formatAmount(null as any)).toBe('null')
    expect(formatAmount(undefined as any)).toBe('undefined')
  })
})

describe('formatPercent', () => {
  test('formats numbers with default decimals', () => {
    expect(formatPercent(0.1234)).toBe('12.34%')
    expect(formatPercent(1)).toBe('100.00%')
  })

  test('formats numbers with custom decimals', () => {
    expect(formatPercent(0.1234, 1)).toBe('12.3%')
    expect(formatPercent(0.1234, 0)).toBe('12%')
    expect(formatPercent(0.1234, 3)).toBe('12.340%')
  })

  test('handles zero and negative numbers', () => {
    expect(formatPercent(0)).toBe('0.00%')
    expect(formatPercent(-0.1234)).toBe('-12.34%')
  })

  test('handles null and undefined', () => {
    expect(formatPercent(null as any)).toBe('NaN%')
    expect(formatPercent(undefined as any)).toBe('NaN%')
  })
})
