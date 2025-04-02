import { describe, it, expect, beforeEach, vi, test, afterEach } from 'vitest'
import { LocalStorageUtil } from '../localstorage'

describe('LocalStorageUtil', () => {
  // Mock localStorage
  const mockLocalStorage = {
    store: {} as Record<string, string>,
    getItem: vi.fn((key: string) => mockLocalStorage.store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      mockLocalStorage.store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete mockLocalStorage.store[key]
    }),
    clear: vi.fn(() => {
      mockLocalStorage.store = {}
    }),
    length: 0,
    key: vi.fn((index: number) => Object.keys(mockLocalStorage.store)[index] || null),
  }

  beforeEach(() => {
    // Mock window object
    const globalWindow = global.window || {}
    Object.defineProperty(global, 'window', {
      value: globalWindow,
      writable: true,
    })

    // Setup localStorage mock
    Object.defineProperty(global.window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    })

    // Reset the initialization state
    // @ts-expect-error - accessing private property for testing
    LocalStorageUtil.isInitialized = false
    // Clear mock storage
    mockLocalStorage.store = {}
    // Reset all mocks
    vi.clearAllMocks()
    // Reset Date.now mock
    vi.spyOn(Date, 'now').mockRestore()
    // Initialize LocalStorageUtil
    LocalStorageUtil.init()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.spyOn(Date, 'now').mockRestore()
  })

  describe('getItem override', () => {
    test('should handle non-expired items correctly', () => {
      // Setup: Store an item that won't expire
      const testData = {
        value: 'test-value',
        valueType: 'string',
        expires: Date.now() + 3600000, // 1 hour from now
      }
      mockLocalStorage.store.testKey = JSON.stringify(testData)

      // Test direct localStorage.getItem
      const result = localStorage.getItem('testKey')

      // Verify the result
      expect(result).not.toBeNull()
      expect(JSON.parse(result!)).toEqual(testData)
    })

    test('should remove expired items and return null', () => {
      // Setup: Store an expired item
      const testData = {
        value: 'expired-value',
        valueType: 'string',
        expires: Date.now() - 1000, // 1 second ago
      }
      mockLocalStorage.store.expiredKey = JSON.stringify(testData)

      // Test direct localStorage.getItem
      const result = localStorage.getItem('expiredKey')

      // Verify the result
      expect(result).toBeNull()
      // Verify the item was removed
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('expiredKey')
    })

    test('should handle non-JSON data correctly', () => {
      // Setup: Store a plain string
      mockLocalStorage.store.plainKey = 'plain-string'

      // Test direct localStorage.getItem
      const result = localStorage.getItem('plainKey')

      // Verify the result
      expect(result).toBe('plain-string')
    })

    test('should handle missing keys correctly', () => {
      // Test direct localStorage.getItem with non-existent key
      const result = localStorage.getItem('nonexistentKey')

      // Verify the result
      expect(result).toBeNull()
    })

    test('should handle malformed JSON data correctly', () => {
      // Setup: Store malformed JSON
      mockLocalStorage.store.malformedKey = '{ bad json'

      // Test direct localStorage.getItem
      const result = localStorage.getItem('malformedKey')

      // Verify the result
      expect(result).toBe('{ bad json')
    })
  })

  describe('init', () => {
    it('should skip initialization in non-browser environment', () => {
      // Reset initialization state
      // @ts-expect-error - accessing private property for testing
      LocalStorageUtil.isInitialized = false

      // Mock window as undefined
      const originalWindow = global.window
      // @ts-expect-error Testing undefined window
      global.window = undefined

      LocalStorageUtil.init()
      expect(LocalStorageUtil['isInitialized']).toBe(false)

      // Restore window
      global.window = originalWindow
    })

    it('should handle null return from original getItem', () => {
      // Mock original getItem to return null
      const originalGetItem = localStorage.getItem
      localStorage.getItem = vi.fn().mockReturnValue(null)

      LocalStorageUtil.init()
      expect(localStorage.getItem('nonexistent')).toBeNull()

      // Restore original method
      localStorage.getItem = originalGetItem
    })

    it('should handle all cases in overridden getItem', () => {
      const now = new Date('2023-01-01T00:00:00Z').getTime()
      // Mock all time-related functions
      vi.spyOn(Date, 'now').mockReturnValue(now)

      // Mock localStorage.removeItem
      const removeItemSpy = vi.spyOn(localStorage, 'removeItem')

      LocalStorageUtil.init()

      // Case 1: Expired item
      const expiredData = {
        value: 'test-value',
        expires: now - 10000,
      }
      localStorage.setItem('expired', JSON.stringify(expiredData))

      const expiredItem = localStorage.getItem('expired')
      expect(expiredItem).toBeNull()
      expect(removeItemSpy).toHaveBeenCalledWith('expired')

      // Case 2: Valid item with expiry
      localStorage.setItem('valid', JSON.stringify({
        value: 'test-value',
        expires: now + 1000,
      }))
      const validItem = localStorage.getItem('valid')
      expect(validItem).toBe(JSON.stringify({
        value: 'test-value',
        expires: now + 1000,
      }))

      // Case 3: Item without expiry
      localStorage.setItem('noExpiry', JSON.stringify({
        value: 'test-value',
      }))
      const noExpiryItem = localStorage.getItem('noExpiry')
      expect(noExpiryItem).toBe(JSON.stringify({
        value: 'test-value',
      }))

      // Case 4: Non-object JSON
      localStorage.setItem('nonObject', '"string value"')
      expect(localStorage.getItem('nonObject')).toBe('"string value"')

      // Case 5: Object without value property
      localStorage.setItem('noValue', JSON.stringify({ prop: 'test' }))
      expect(localStorage.getItem('noValue')).toBe(JSON.stringify({ prop: 'test' }))

      // Case 6: Invalid JSON
      localStorage.setItem('invalid', '{invalid json')
      expect(localStorage.getItem('invalid')).toBe('{invalid json')
    })

    it('should initialize only once', () => {
      // First initialization
      LocalStorageUtil.init()
      const firstGetItem = localStorage.getItem

      // Second initialization
      LocalStorageUtil.init()
      const secondGetItem = localStorage.getItem

      // The function reference should be the same after second init
      expect(secondGetItem).toBe(firstGetItem)
    })

    it('should handle non-standard items when using native getItem', () => {
      LocalStorageUtil.init()

      // Store a plain string
      localStorage.setItem('plain', 'test-value')

      // Should return the original value for non-standard items
      expect(localStorage.getItem('plain')).toBe('test-value')
    })

    it('should handle invalid JSON when using native getItem', () => {
      LocalStorageUtil.init()

      // Store invalid JSON
      localStorage.setItem('invalid', '{invalid json')

      // Should return the original value for invalid JSON
      expect(localStorage.getItem('invalid')).toBe('{invalid json')
    })

    it('should handle non-object data when using native getItem', () => {
      LocalStorageUtil.init()

      // Store valid JSON but not an object
      localStorage.setItem('nonObject', '"string value"')

      // Should return the original value
      expect(localStorage.getItem('nonObject')).toBe('"string value"')
    })

    it('should handle object without value property when using native getItem', () => {
      LocalStorageUtil.init()

      // Store object without value property
      localStorage.setItem('noValue', JSON.stringify({ someOtherProp: 'test' }))

      // Should return the original value
      expect(localStorage.getItem('noValue')).toBe('{"someOtherProp":"test"}')
    })
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
      vi.spyOn(Date, 'now').mockReturnValue(mockDate)

      LocalStorageUtil.setItem('expired', 'value', 1)

      // 模拟时间前进 2 小时
      vi.spyOn(Date, 'now').mockReturnValue(mockDate + 2 * 3600 * 1000)

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

    it('should return null for mismatched array type', () => {
      localStorage.setItem('test', JSON.stringify({
        value: 'not-an-array',
        valueType: 'array',
      }))
      expect(LocalStorageUtil.getItem('test')).toBeNull()
    })

    it('should return null for mismatched primitive type', () => {
      localStorage.setItem('test', JSON.stringify({
        value: 'string-value',
        valueType: 'number',
      }))
      expect(LocalStorageUtil.getItem('test')).toBeNull()
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
