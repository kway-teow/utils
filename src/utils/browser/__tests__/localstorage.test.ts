import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LocalStorageUtil } from '../localstorage'

describe('LocalStorageUtil', () => {
  // 在每个测试前清空 localStorage
  beforeEach(() => {
    localStorage.clear()
  })

  describe('setItem', () => {
    it('should store string value correctly', () => {
      LocalStorageUtil.setItem('testString', 'hello')
      const stored = JSON.parse(localStorage.getItem('testString')!)
      expect(stored.value).toBe('hello')
      expect(stored.valueType).toBe('string')
    })

    it('should store number value correctly', () => {
      LocalStorageUtil.setItem('testNumber', 123)
      const stored = JSON.parse(localStorage.getItem('testNumber')!)
      expect(stored.value).toBe(123)
      expect(stored.valueType).toBe('number')
    })

    it('should store boolean value correctly', () => {
      LocalStorageUtil.setItem('testBoolean', true)
      const stored = JSON.parse(localStorage.getItem('testBoolean')!)
      expect(stored.value).toBe(true)
      expect(stored.valueType).toBe('boolean')
    })

    it('should store object value correctly', () => {
      const testObj = { name: 'John', age: 30 }
      LocalStorageUtil.setItem('testObject', testObj)
      const stored = JSON.parse(localStorage.getItem('testObject')!)
      expect(stored.value).toEqual(testObj)
      expect(stored.valueType).toBe('object')
    })

    it('should store array value correctly', () => {
      const testArray = [1, 2, 3]
      LocalStorageUtil.setItem('testArray', testArray)
      const stored = JSON.parse(localStorage.getItem('testArray')!)
      expect(stored.value).toEqual(testArray)
      expect(stored.valueType).toBe('array')
    })

    it('should store null value correctly', () => {
      LocalStorageUtil.setItem('testNull', null)
      const stored = JSON.parse(localStorage.getItem('testNull')!)
      expect(stored.value).toBeNull()
      expect(stored.valueType).toBe('object')
    })

    it('should throw error for non-string key', () => {
      // @ts-expect-error Testing invalid input
      expect(() => LocalStorageUtil.setItem(123, 'value')).toThrow('key must be a string')
    })

    it('should setItem expiration time correctly', () => {
      const mockDate = new Date('2023-01-01').getTime()
      vi.spyOn(Date.prototype, 'getTime').mockReturnValue(mockDate)

      LocalStorageUtil.setItem('testExpires', 'value', 1) // 1 hour expiration
      const stored = JSON.parse(localStorage.getItem('testExpires')!)
      expect(stored.expires).toBe(mockDate + 3600 * 1000)
    })
  })

  describe('getItem', () => {
    it('should retrieve stored value correctly', () => {
      LocalStorageUtil.setItem('test', 'hello')
      expect(LocalStorageUtil.getItem('test')).toBe('hello')
    })

    it('should return null for non-existent key', () => {
      expect(LocalStorageUtil.getItem('nonexistent')).toBeNull()
    })

    it('should return null for expired value', () => {
      const mockDate = new Date('2023-01-01').getTime()
      vi.spyOn(Date.prototype, 'getTime')
        .mockReturnValueOnce(mockDate) // 首次调用返回初始时间
        .mockReturnValueOnce(mockDate + 2 * 3600 * 1000) // 第二次调用返回 2 小时后

      LocalStorageUtil.setItem('expired', 'value', 1)
      expect(LocalStorageUtil.getItem('expired')).toBeNull()
    })

    it('should return null for invalid JSON', () => {
      // 直接设置一个无效的 JSON 字符串
      localStorage.setItem('invalid', '{invalid json}')
      expect(LocalStorageUtil.getItem('invalid')).toBeNull()
    })

    it('should throw error for non-string key', () => {
      // @ts-expect-error Testing invalid input
      expect(() => LocalStorageUtil.getItem(123)).toThrow('key must be a string')
    })
  })

  describe('removeItem', () => {
    it('should removeItem stored value', () => {
      LocalStorageUtil.setItem('test', 'value')
      LocalStorageUtil.removeItem('test')
      expect(localStorage.getItem('test')).toBeNull()
    })

    it('should not throw error when removing non-existent key', () => {
      expect(() => LocalStorageUtil.removeItem('nonexistent')).not.toThrow()
    })

    it('should throw error for non-string key', () => {
      // @ts-expect-error Testing invalid input
      expect(() => LocalStorageUtil.removeItem(123)).toThrow('key must be a string')
    })
  })

  describe('clear', () => {
    it('should clear all stored values', () => {
      LocalStorageUtil.setItem('test1', 'value1')
      LocalStorageUtil.setItem('test2', 'value2')
      LocalStorageUtil.clear()
      expect(localStorage.length).toBe(0)
    })
  })

  describe('has', () => {
    it('should return true for existing key', () => {
      LocalStorageUtil.setItem('test', 'value')
      expect(LocalStorageUtil.has('test')).toBe(true)
    })

    it('should return false for non-existent key', () => {
      expect(LocalStorageUtil.has('nonexistent')).toBe(false)
    })

    it('should throw error for non-string key', () => {
      // @ts-expect-error Testing invalid input
      expect(() => LocalStorageUtil.has(123)).toThrow('key must be a string')
    })
  })
})
