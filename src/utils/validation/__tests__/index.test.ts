import { describe, test, expect } from 'vitest'
import { isEmail, isChinesePhone, isURL, isChineseIDCard, isEmpty } from '../index'

describe('isEmail', () => {
  test('should return true for valid email addresses', () => {
    expect(isEmail('test@example.com')).toBe(true)
    expect(isEmail('user.name@domain.com')).toBe(true)
    expect(isEmail('user+label@domain.co.uk')).toBe(true)
    expect(isEmail(null as any)).toBe(false)
    expect(isEmail(undefined as any)).toBe(false)
    expect(isEmail({} as any)).toBe(false)
  })

  test('should return false for invalid email addresses', () => {
    expect(isEmail('')).toBe(false)
    expect(isEmail('test@')).toBe(false)
    expect(isEmail('@domain.com')).toBe(false)
    expect(isEmail('test@domain')).toBe(false)
    expect(isEmail('test.domain.com')).toBe(false)
    expect(isEmail(null as any)).toBe(false)
    expect(isEmail(undefined as any)).toBe(false)
    expect(isEmail({} as any)).toBe(false)
  })
})

describe('isChinesePhone', () => {
  test('should return true for valid Chinese phone numbers', () => {
    expect(isChinesePhone('13812345678')).toBe(true)
    expect(isChinesePhone('15912345678')).toBe(true)
    expect(isChinesePhone('17712345678')).toBe(true)
    expect(isChinesePhone(null as any)).toBe(false)
    expect(isChinesePhone(undefined as any)).toBe(false)
    expect(isChinesePhone({} as any)).toBe(false)
  })

  test('should return false for invalid Chinese phone numbers', () => {
    expect(isChinesePhone('')).toBe(false)
    expect(isChinesePhone('1381234567')).toBe(false) // too short
    expect(isChinesePhone('138123456789')).toBe(false) // too long
    expect(isChinesePhone('23812345678')).toBe(false) // wrong prefix
    expect(isChinesePhone('abcdefghijk')).toBe(false)
    expect(isChinesePhone(null as any)).toBe(false)
    expect(isChinesePhone(undefined as any)).toBe(false)
    expect(isChinesePhone({} as any)).toBe(false)
  })
})

describe('isURL', () => {
  test('should return true for valid URLs', () => {
    expect(isURL('https://www.example.com')).toBe(true)
    expect(isURL('http://localhost:3000')).toBe(true)
    expect(isURL('https://sub.domain.com/path?query=value')).toBe(true)
    expect(isURL('ftp://ftp.example.com')).toBe(true)
    expect(isURL(null as any)).toBe(false)
    expect(isURL(undefined as any)).toBe(false)
    expect(isURL({} as any)).toBe(false)
  })

  test('should return false for invalid URLs', () => {
    expect(isURL('')).toBe(false)
    expect(isURL('not-a-url')).toBe(false)
    expect(isURL('http://')).toBe(false)
    expect(isURL('www.example.com')).toBe(false)
    expect(isURL(null as any)).toBe(false)
    expect(isURL(undefined as any)).toBe(false)
    expect(isURL({} as any)).toBe(false)
  })
})

describe('isChineseIDCard', () => {
  test('should return true for valid Chinese ID card numbers', () => {
    expect(isChineseIDCard('110101199001011234')).toBe(true) // 18 digits
    expect(isChineseIDCard('11010119900101123X')).toBe(true) // 17 digits + X
    expect(isChineseIDCard('110101990101123')).toBe(true) // 15 digits (old format)
    expect(isChineseIDCard(null as any)).toBe(false)
    expect(isChineseIDCard(undefined as any)).toBe(false)
    expect(isChineseIDCard({} as any)).toBe(false)
  })

  test('should return false for invalid Chinese ID card numbers', () => {
    expect(isChineseIDCard('')).toBe(false)
    expect(isChineseIDCard('12345')).toBe(false)
    expect(isChineseIDCard('11010119900101')).toBe(false) // too short
    expect(isChineseIDCard('1101011990010112345')).toBe(false) // too long
    expect(isChineseIDCard('11010119900101123Y')).toBe(false) // invalid ending
    expect(isChineseIDCard(null as any)).toBe(false)
    expect(isChineseIDCard(undefined as any)).toBe(false)
    expect(isChineseIDCard({} as any)).toBe(false)
  })
})

describe('isEmpty', () => {
  test('should return true for empty values', () => {
    expect(isEmpty('')).toBe(true)
    expect(isEmpty('   ')).toBe(true)
    expect(isEmpty(null)).toBe(true)
    expect(isEmpty(undefined)).toBe(true)
    expect(isEmpty([])).toBe(true)
    expect(isEmpty({})).toBe(true)
  })

  test('should return false for non-empty values', () => {
    expect(isEmpty('text')).toBe(false)
    expect(isEmpty(' text ')).toBe(false)
    expect(isEmpty(['item'])).toBe(false)
    expect(isEmpty({ key: 'value' })).toBe(false)
    expect(isEmpty(0)).toBe(false)
    expect(isEmpty(false)).toBe(false)
  })
})
