import { describe, expect, test } from 'vitest'
import { add, subtract, multiply, divide, round, formatCurrency, randomInt, randomFloat, uuid, randomString, randomElement, randomElements, shuffle } from '../index'

describe('精确数学计算工具', () => {
  describe('add 函数', () => {
    test('正确处理两个数字的加法', () => {
      expect(add(0.1, 0.2)).toBe(0.3)
      expect(add(1.999, 0.001)).toBe(2)
      expect(add(0.3, 0.6)).toBe(0.9)
    })

    test('处理字符串数字', () => {
      expect(add('0.1', '0.2')).toBe(0.3)
      expect(add('1.999', '0.001')).toBe(2)
    })

    test('处理边界情况', () => {
      expect(add(undefined, 0.2)).toBe(0)
      expect(add(0.1, undefined)).toBe(0)
      expect(add(undefined, undefined)).toBe(0)
      expect(add('abc', 0.2)).toBe(0)
      expect(add(0.1, 'xyz')).toBe(0)
    })
  })

  describe('subtract 函数', () => {
    test('正确处理两个数字的减法', () => {
      expect(subtract(0.3, 0.1)).toBe(0.2)
      expect(subtract(2, 0.001)).toBe(1.999)
      expect(subtract(1, 0.7)).toBe(0.3)
    })

    test('处理字符串数字', () => {
      expect(subtract('0.3', '0.1')).toBe(0.2)
      expect(subtract('2', '0.001')).toBe(1.999)
    })

    test('处理边界情况', () => {
      expect(subtract(undefined, 0.1)).toBe(0)
      expect(subtract(0.3, undefined)).toBe(0)
      expect(subtract(undefined, undefined)).toBe(0)
      expect(subtract('abc', 0.1)).toBe(0)
      expect(subtract(0.3, 'xyz')).toBe(0)
    })
  })

  describe('multiply 函数', () => {
    test('正确处理两个数字的乘法', () => {
      expect(multiply(0.1, 0.2)).toBe(0.02)
      expect(multiply(1.5, 2)).toBe(3)
      expect(multiply(0.3, 0.6)).toBe(0.18)
    })

    test('处理字符串数字', () => {
      expect(multiply('0.1', '0.2')).toBe(0.02)
      expect(multiply('1.5', '2')).toBe(3)
    })

    test('处理边界情况', () => {
      expect(multiply(undefined, 0.2)).toBe(0)
      expect(multiply(0.1, undefined)).toBe(0)
      expect(multiply(undefined, undefined)).toBe(0)
      expect(multiply('abc', 0.2)).toBe(0)
      expect(multiply(0.1, 'xyz')).toBe(0)
    })
  })

  describe('divide 函数', () => {
    test('正确处理两个数字的除法', () => {
      expect(divide(0.3, 0.1)).toBe(3)
      expect(divide(1, 3)).toBe(0.33)
      expect(divide(5, 2, 3)).toBe(2.5)
    })

    test('处理字符串数字', () => {
      expect(divide('0.3', '0.1')).toBe(3)
      expect(divide('1', '3')).toBe(0.33)
    })

    test('处理边界情况', () => {
      expect(divide(undefined, 0.1)).toBe(0)
      expect(divide(0.3, undefined)).toBe(0)
      expect(divide(undefined, undefined)).toBe(0)
      expect(divide('abc', 0.1)).toBe(0)
      expect(divide(0.3, 'xyz')).toBe(0)
      expect(divide(0.3, 0)).toBe(0)
    })
  })

  describe('round 函数', () => {
    test('正确处理四舍五入', () => {
      expect(round(0.4)).toBe(0)
      expect(round(0.5)).toBe(1)
      expect(round(1.234, 2)).toBe(1.23)
      expect(round(1.235, 2)).toBe(1.24)
    })

    test('处理字符串数字', () => {
      expect(round('0.4')).toBe(0)
      expect(round('0.5')).toBe(1)
      expect(round('1.234', 2)).toBe(1.23)
    })

    test('处理边界情况', () => {
      expect(round(undefined)).toBe(0)
      expect(round('abc')).toBe(0)
    })
  })

  describe('formatCurrency 函数', () => {
    test('正确格式化货币', () => {
      expect(formatCurrency(1234.56)).toBe('¥1,234.56')
      expect(formatCurrency(1000)).toBe('¥1,000.00')
      expect(formatCurrency(1234.56, 'USD', 'en-US')).toBe('$1,234.56')
      expect(formatCurrency(1234.56789, 'CNY', 'zh-CN', 3)).toBe('¥1,234.568')
    })

    test('处理字符串数字', () => {
      expect(formatCurrency('1234.56')).toBe('¥1,234.56')
      expect(formatCurrency('1000')).toBe('¥1,000.00')
    })

    test('处理边界情况', () => {
      expect(formatCurrency(undefined)).toBe('¥0.00')
      expect(formatCurrency('abc')).toBe('¥0.00')
    })
  })
})

describe('随机数生成工具', () => {
  describe('randomInt 函数', () => {
    test('生成指定范围内的随机整数', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomInt(1, 10)
        expect(result).toBeGreaterThanOrEqual(1)
        expect(result).toBeLessThanOrEqual(10)
        expect(Number.isInteger(result)).toBe(true)
      }
    })

    test('处理默认参数', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomInt()
        expect(result).toBeGreaterThanOrEqual(0)
        expect(result).toBeLessThanOrEqual(100)
        expect(Number.isInteger(result)).toBe(true)
      }
    })

    test('处理最小值大于最大值的情况', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomInt(10, 1)
        expect(result).toBeGreaterThanOrEqual(1)
        expect(result).toBeLessThanOrEqual(10)
        expect(Number.isInteger(result)).toBe(true)
      }
    })

    test('处理边界情况', () => {
      expect(randomInt(NaN, 10)).toBe(0)
      expect(randomInt(1, NaN)).toBe(0)
    })
  })

  describe('randomFloat 函数', () => {
    test('生成指定范围内的随机浮点数', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomFloat(1, 10)
        expect(result).toBeGreaterThanOrEqual(1)
        expect(result).toBeLessThanOrEqual(10)

        // 检查小数位数是否为2
        const decimalPart = result.toString().split('.')[1] || ''
        expect(decimalPart.length).toBeLessThanOrEqual(2)
      }
    })

    test('处理默认参数', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomFloat()
        expect(result).toBeGreaterThanOrEqual(0)
        expect(result).toBeLessThanOrEqual(1)

        // 检查小数位数是否为2
        const decimalPart = result.toString().split('.')[1] || ''
        expect(decimalPart.length).toBeLessThanOrEqual(2)
      }
    })

    test('自定义小数位数', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomFloat(1, 10, 3)
        expect(result).toBeGreaterThanOrEqual(1)
        expect(result).toBeLessThanOrEqual(10)

        // 检查小数位数是否为3
        const decimalPart = result.toString().split('.')[1] || ''
        expect(decimalPart.length).toBeLessThanOrEqual(3)
      }
    })

    test('处理最小值大于最大值的情况', () => {
      for (let i = 0; i < 100; i++) {
        const result = randomFloat(10, 1)
        expect(result).toBeGreaterThanOrEqual(1)
        expect(result).toBeLessThanOrEqual(10)
      }
    })

    test('处理边界情况', () => {
      expect(randomFloat(NaN, 10)).toBe(0)
      expect(randomFloat(1, NaN)).toBe(0)
      expect(randomFloat(1, 10, NaN)).toBe(0)
    })
  })

  describe('uuid 函数', () => {
    test('生成有效的UUID v4', () => {
      for (let i = 0; i < 10; i++) {
        const id = uuid()
        // 检查格式
        expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
      }
    })

    test('生成的UUID是唯一的', () => {
      const ids = new Set()
      for (let i = 0; i < 100; i++) {
        ids.add(uuid())
      }
      expect(ids.size).toBe(100)
    })
  })

  describe('randomString 函数', () => {
    test('生成指定长度的随机字符串', () => {
      for (let i = 0; i < 10; i++) {
        const length = 10 + i
        const result = randomString(length)
        expect(result.length).toBe(length)
        // 检查是否只包含字母和数字
        expect(result).toMatch(/^[A-Za-z0-9]+$/)
      }
    })

    test('处理默认参数', () => {
      const result = randomString()
      expect(result.length).toBe(16)
      expect(result).toMatch(/^[A-Za-z0-9]+$/)
    })

    test('使用自定义字符集', () => {
      const chars = 'ABC123'
      for (let i = 0; i < 10; i++) {
        const result = randomString(10, chars)
        expect(result.length).toBe(10)

        // 检查是否只包含自定义字符集中的字符
        for (let j = 0; j < result.length; j++) {
          expect(chars).toContain(result[j])
        }
      }
    })

    test('处理边界情况', () => {
      expect(randomString(-1)).toBe('')
      expect(randomString(0)).toBe('')
      expect(randomString(NaN)).toBe('')
      expect(randomString(5, '')).toMatch(/^[A-Za-z0-9]{5}$/)
    })
  })

  describe('randomElement 函数', () => {
    test('从数组中随机选择一个元素', () => {
      const array = [1, 2, 3, 4, 5]
      for (let i = 0; i < 100; i++) {
        const result = randomElement(array)
        expect(array).toContain(result)
      }
    })

    test('处理边界情况', () => {
      expect(randomElement([])).toBeUndefined()
      expect(randomElement(undefined)).toBeUndefined()
      expect(randomElement(null as any)).toBeUndefined()
    })

    test('处理只有一个元素的数组', () => {
      expect(randomElement([42])).toBe(42)
    })
  })

  describe('randomElements 函数', () => {
    test('从数组中随机选择多个不重复元素', () => {
      const array = [1, 2, 3, 4, 5]
      const result = randomElements(array, 3)

      expect(result.length).toBe(3)

      // 检查结果中的所有元素都来自原数组
      for (const item of result) {
        expect(array).toContain(item)
      }

      // 检查结果中没有重复元素
      expect(new Set(result).size).toBe(result.length)
    })

    test('处理默认参数', () => {
      const array = [1, 2, 3, 4, 5]
      const result = randomElements(array)

      expect(result.length).toBe(1)
      expect(array).toContain(result[0])
    })

    test('请求数量大于数组长度时返回打乱后的数组', () => {
      const array = [1, 2, 3]
      const result = randomElements(array, 5)

      expect(result.length).toBe(3)

      // 检查结果包含原数组的所有元素
      expect(result.sort()).toEqual([1, 2, 3])
    })

    test('处理边界情况', () => {
      expect(randomElements([], 3)).toEqual([])
      expect(randomElements(undefined, 3)).toEqual([])
      expect(randomElements([1, 2, 3], 0)).toEqual([])
      expect(randomElements([1, 2, 3], -1)).toEqual([])
      expect(randomElements([1, 2, 3], NaN)).toEqual([])
    })
  })

  describe('shuffle 函数', () => {
    test('随机打乱数组元素顺序', () => {
      const originalArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      // 创建一个副本来测试，避免修改原始数组
      const arrayCopy = [...originalArray]

      const result = shuffle(arrayCopy)

      // 检查长度相同
      expect(result.length).toBe(originalArray.length)

      // 检查结果包含相同的元素（排序后应相等）
      expect([...result].sort((a, b) => a - b)).toEqual([...originalArray].sort((a, b) => a - b))

      // 验证原数组不变
      expect(arrayCopy).toEqual(originalArray)

      // 打乱后的数组不应该等于原数组（注意：这个测试有极小概率失败）
      let differentOrder = false
      for (let i = 0; i < 5; i++) {
        const shuffled = shuffle(originalArray)
        if (JSON.stringify(shuffled) !== JSON.stringify(originalArray)) {
          differentOrder = true
          break
        }
      }
      expect(differentOrder).toBe(true)
    })

    test('处理边界情况', () => {
      expect(shuffle([])).toEqual([])
      expect(shuffle(undefined)).toEqual([])
      expect(shuffle(null as any)).toEqual([])
    })

    test('处理一个元素的数组', () => {
      expect(shuffle([42])).toEqual([42])
    })
  })
})
