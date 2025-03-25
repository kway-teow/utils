import { describe, test, expect } from 'vitest'
import { formatDate, getRelativeTime, isSameDay, getCurrentDate, formatTime } from './index'

// 格式化日期 测试各种格式
describe('formatDate', () => {
  test('formats current date to YYYY-MM-DD', () => {
    const mockDate = new Date('2024-03-22')
    expect(formatDate(mockDate)).toBe('2024-03-22')
  })

  test('formats string date', () => {
    expect(formatDate('2025-03-22')).toBe('2025-03-22')
  })

  test('formats timestamp', () => {
    expect(formatDate(1716393600000, 'YYYY-MM-DD', 'Asia/Shanghai')).toBe('2024-05-23')
  })

  test('handles custom format', () => {
    const date = new Date('2024-03-22 15:30:45')
    expect(formatDate(date, 'YYYY-MM-DD HH:mm:ss')).toBe('2024-03-22 15:30:45')
  })

  test('handles null input', () => {
    expect(formatDate(null as any)).toBe('')
  })

  test('handles undefined input', () => {
    expect(formatDate(undefined as any)).toBe('')
  })

  test('handles invalid number input', () => {
    expect(formatDate(123 as any)).toBe('1970-01-01')
  })

  test('handles string number input', () => {
    expect(formatDate('1716393600000', 'YYYY-MM-DD', 'Asia/Shanghai')).toBe('2024-05-23')
  })
})

// 获取相对时间 测试各种格式
describe('getRelativeTime', () => {
  test('returns 刚刚 for current time', () => {
    const now = new Date()
    expect(getRelativeTime(now, now)).toBe('刚刚')
  })

  test('returns minutes ago', () => {
    const now = new Date('2024-03-22 12:00:00')
    const past = new Date('2024-03-22 11:58:00')
    expect(getRelativeTime(past, now)).toBe('2分钟前')
  })

  test('returns hours ago', () => {
    const now = new Date('2024-03-22 12:00:00')
    const past = new Date('2024-03-22 10:00:00')
    expect(getRelativeTime(past, now)).toBe('2小时前')
  })

  test('returns days ago', () => {
    const now = new Date('2024-03-22 12:00:00')
    const past = new Date('2024-03-20 12:00:00')
    expect(getRelativeTime(past, now)).toBe('2天前')
  })

  test('returns months ago', () => {
    const now = new Date('2024-03-22 12:00:00')
    const past = new Date('2024-01-22 12:00:00')
    expect(getRelativeTime(past, now)).toBe('2个月前')
  })

  test('returns years ago', () => {
    const now = new Date('2024-03-22 12:00:00')
    const past = new Date('2022-03-22 12:00:00')
    expect(getRelativeTime(past, now)).toBe('2年前')
  })
  test('handles default value', () => {
    expect(getRelativeTime(null as any, undefined as any)).toBe('')
  })
  test('handles null now', () => {
    expect(getRelativeTime(null as any, null as any)).toBe('')
  })
})

// 判断是否为同一天
describe('isSameDay', () => {
  test('returns true for same day', () => {
    const date1 = new Date('2024-03-22 10:00:00')
    const date2 = new Date('2024-03-22 15:30:00')
    expect(isSameDay(date1, date2)).toBe(true)
  })

  test('returns false for different days', () => {
    const date1 = new Date('2024-03-22')
    const date2 = new Date('2024-03-23')
    expect(isSameDay(date1, date2)).toBe(false)
  })

  test('handles string dates', () => {
    expect(isSameDay('2024-03-22', '2024-03-22')).toBe(true)
    expect(isSameDay('2024-03-22', '2024-03-23')).toBe(false)
  })

  test('handles timestamps', () => {
    const timestamp1 = new Date('2024-03-22 10:00:00').getTime()
    const timestamp2 = new Date('2024-03-22 15:30:00').getTime()
    expect(isSameDay(timestamp1, timestamp2)).toBe(true)
  })

  test('handles null input', () => {
    expect(isSameDay(null as any, null as any)).toBe(false)
  })

  test('handles undefined input', () => {
    expect(isSameDay(undefined as any, undefined as any)).toBe(false)
  })

  test('handles number input', () => {
    expect(isSameDay(123 as any, 123 as any)).toBe(true)
  })
})

// 获取当前日期
describe('getCurrentDate', () => {
  test('returns current date', () => {
    expect(getCurrentDate()).toBe(formatDate(new Date()))
  })
})

// 秒转为时分秒
describe('formatTime', () => {
  test('returns HH:mm:ss for 3600 seconds', () => {
    expect(formatTime(3600)).toBe('01:00:00')
  })

  test('returns HH:mm:ss for 3661 seconds', () => {
    expect(formatTime(3661, 'H:m:s')).toBe('1:1:1')
  })

  test('returns HH:mm:ss for 7323 seconds', () => {
    expect(formatTime(7323)).toBe('02:02:03')
  })

  test('returns 00:00:00 for 0 seconds', () => {
    expect(formatTime(0)).toBe('00:00:00')
  })

  test('handles negative seconds', () => {
    expect(formatTime(-3600)).toBe('-01:00:00')
  })

  test('handles custom format', () => {
    expect(formatTime(3661, 'HH时mm分ss秒')).toBe('01时01分01秒')
  })

  test('handles decimal seconds', () => {
    expect(formatTime(3661.5)).toBe('01:01:01')
  })

  test('handles null input', () => {
    expect(formatTime(null as any)).toBe('')
  })

  test('handles undefined input', () => {
    expect(formatTime(undefined as any)).toBe('')
  })

  test('handles NaN input', () => {
    expect(formatTime(NaN as any)).toBe('')
  })

  test('handles Infinity input', () => {
    expect(formatTime(Infinity as any)).toBe('')
  })

  test('handles Infinity input', () => {
    expect(formatTime(-Infinity as any)).toBe('')
  })

  test('handles string input', () => {
    expect(formatTime('123456789' as any, 'H:m:s')).toBe('')
  })
})
