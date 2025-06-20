import { describe, test, expect, vi, beforeEach } from 'vitest'
import { deduplicatePromise } from '../deduplicate-promise'

describe('deduplicatePromise', () => {
  // 模拟延迟函数
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  // 每个测试前重置模拟计时器
  beforeEach(() => {
    vi.useRealTimers()
  })

  describe('基础功能', () => {
    test('应该执行原始函数并返回结果', async () => {
      const mockFn = vi.fn().mockResolvedValue('result')
      const deduped = deduplicatePromise(mockFn)

      const result = await deduped('test')

      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith('test')
      expect(result).toBe('result')
    })

    test('并发调用时，原始函数只应被调用一次', async () => {
      const mockFn = vi.fn().mockImplementation(async () => {
        await delay(50)
        return 'result'
      })

      const deduped = deduplicatePromise(mockFn)

      // 同时发起多个调用
      const results = await Promise.all([
        deduped('test'),
        deduped('test'),
        deduped('test'),
      ])

      // 验证原始函数只被调用一次
      expect(mockFn).toHaveBeenCalledTimes(1)

      // 验证所有调用都获得相同的结果
      expect(results).toEqual(['result', 'result', 'result'])
    })

    test('不同参数的调用应分别执行原始函数', async () => {
      const mockFn = vi.fn().mockImplementation(async (arg) => {
        await delay(50)
        return `result-${arg}`
      })

      const deduped = deduplicatePromise(mockFn)

      // 使用不同参数同时调用
      const results = await Promise.all([
        deduped('test1'),
        deduped('test2'),
        deduped('test1'), // 重复参数
      ])

      // 验证原始函数被调用两次（不同参数）
      expect(mockFn).toHaveBeenCalledTimes(2)
      expect(mockFn).toHaveBeenCalledWith('test1')
      expect(mockFn).toHaveBeenCalledWith('test2')

      // 验证结果正确
      expect(results).toEqual(['result-test1', 'result-test2', 'result-test1'])
    })

    test('cacheTime内的重复调用应返回缓存结果', async () => {
      vi.useFakeTimers()

      const mockFn = vi.fn().mockResolvedValue('result')
      const deduped = deduplicatePromise(mockFn, { cacheTime: 1000 }) // 1秒缓存

      // 第一次调用
      const result1 = await deduped('test')
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(result1).toBe('result')

      // 缓存时间内再次调用
      vi.advanceTimersByTime(500)
      const result2 = await deduped('test')

      // 原始函数不应再次被调用
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(result2).toBe('result')

      // 缓存时间后再次调用
      vi.advanceTimersByTime(600) // 总共已过1100ms
      const result3 = await deduped('test')

      // 原始函数应再次被调用
      expect(mockFn).toHaveBeenCalledTimes(2)
      expect(result3).toBe('result')
    })

    test('clearCache方法应清除所有缓存', async () => {
      const mockFn = vi.fn().mockResolvedValue('result')
      const deduped = deduplicatePromise(mockFn, { cacheTime: 1000 })

      // 第一次调用
      await deduped('test')
      expect(mockFn).toHaveBeenCalledTimes(1)

      // 清除缓存
      deduped.clearCache()

      // 再次调用
      await deduped('test')

      // 原始函数应再次被调用
      expect(mockFn).toHaveBeenCalledTimes(2)
    })

    test('原始函数抛出错误时，应正确传播错误', async () => {
      const error = new Error('Test error')
      const mockFn = vi.fn().mockRejectedValue(error)
      const deduped = deduplicatePromise(mockFn)

      // 验证错误被正确传播
      await expect(deduped('test')).rejects.toThrow('Test error')

      // 验证原始函数被调用
      expect(mockFn).toHaveBeenCalledTimes(1)

      // 错误后再次调用应重新执行原始函数（错误不缓存）
      mockFn.mockRejectedValueOnce(error)
      await expect(deduped('test')).rejects.toThrow('Test error')
      expect(mockFn).toHaveBeenCalledTimes(2)
    })

    test('应处理无法序列化的参数', async () => {
      const mockFn = vi.fn().mockResolvedValue('result')
      const deduped = deduplicatePromise(mockFn)

      // 创建带循环引用的对象（无法序列化）
      const circular: any = {}
      circular.self = circular

      // 使用无法序列化的参数调用
      const result = await deduped(circular)

      // 验证函数仍然被调用，尽管参数无法序列化
      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith(circular)
      expect(result).toBe('result')
    })

    test('应支持同步函数', async () => {
      const mockFn = vi.fn().mockReturnValue('sync result')
      const deduped = deduplicatePromise(mockFn)

      const result = await deduped('test')

      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(result).toBe('sync result')
    })

    test('边界情况：空参数调用', async () => {
      const mockFn = vi.fn().mockResolvedValue('result')
      const deduped = deduplicatePromise(mockFn)

      const result = await deduped()

      expect(mockFn).toHaveBeenCalledTimes(1)
      expect(mockFn).toHaveBeenCalledWith()
      expect(result).toBe('result')
    })
  })

  describe('自定义key生成器', () => {
    test('应该使用自定义key生成器', async () => {
      const mockFn = vi.fn().mockImplementation(async (user, options) => {
        return `result-${user.id}-${options.type}`
      })

      const deduped = deduplicatePromise(mockFn, {
        keyGenerator: (user, options) => `${user.id}-${options.type}`,
        cacheTime: 1000,
      })

      const user1 = { id: 'user1', name: 'Alice' }
      const user2 = { id: 'user1', name: 'Bob' } // 不同name但相同id
      const options = { type: 'search', limit: 10 }

      // 第一次调用
      const result1 = await deduped(user1, options)
      expect(mockFn).toHaveBeenCalledTimes(1)

      // 使用不同用户对象但相同id，应该使用缓存
      const result2 = await deduped(user2, options)
      expect(mockFn).toHaveBeenCalledTimes(1) // 仍然是1次，因为key相同
      expect(result1).toBe(result2)
    })

    test('自定义key生成器抛出错误时应回退到时间戳', async () => {
      vi.useFakeTimers()

      const mockFn = vi.fn().mockImplementation(async (arg: string) => {
        return `result-${arg}`
      })

      const deduped = deduplicatePromise(mockFn, {
        keyGenerator: (_arg: string) => {
          throw new Error('Key generation failed')
        },
      })

      // 应该能正常工作，每次都执行函数（因为每次都生成不同的时间戳key）
      await deduped('test1')
      // 推进时间确保时间戳不同
      await vi.advanceTimersByTimeAsync(1)
      await deduped('test1')

      expect(mockFn).toHaveBeenCalledTimes(2) // 因为key生成失败，每次都执行

      vi.useRealTimers()
    })
  })

  describe('基于特定字段的缓存', () => {
    test('应该只基于指定字段生成缓存key', async () => {
      const mockFn = vi.fn().mockImplementation(async (user, query, timestamp) => {
        return `${user.id}-${query}-${timestamp}`
      })

      const deduped = deduplicatePromise(mockFn, {
        keyFields: [0, 1], // 只基于user和query，忽略timestamp
        cacheTime: 1000,
      })

      const user = { id: 'user1' }
      const query = 'search'

      // 第一次调用
      await deduped(user, query, 100)
      expect(mockFn).toHaveBeenCalledTimes(1)

      // 不同timestamp但user和query相同，应该使用缓存
      await deduped(user, query, 200)
      expect(mockFn).toHaveBeenCalledTimes(1)

      // 不同query，应该重新执行
      await deduped(user, 'different', 300)
      expect(mockFn).toHaveBeenCalledTimes(2)
    })

    test('keyFields为空数组时应该使用空key', async () => {
      const mockFn = vi.fn().mockResolvedValue('result')

      const deduped = deduplicatePromise(mockFn, {
        keyFields: [],
        cacheTime: 1000,
      })

      // 所有调用都使用相同的key（空数组序列化为"[]"）
      await deduped('arg1')
      await deduped('arg2')
      await deduped('arg3')

      expect(mockFn).toHaveBeenCalledTimes(1) // 只调用一次
    })

    test('keyFields超出参数范围时应该正常处理', async () => {
      const mockFn = vi.fn().mockResolvedValue('result')
      const deduped = deduplicatePromise(mockFn, {
        keyFields: [0, 5, 10], // 索引超出实际参数数量
      })

      await deduped('arg1', 'arg2')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('条件缓存', () => {
    test('shouldCache返回false时不应使用缓存', async () => {
      const mockFn = vi.fn().mockImplementation(async (query, useCache) => {
        return `result-${query}-${useCache}`
      })

      const deduped = deduplicatePromise(mockFn, {
        shouldCache: (query, useCache) => useCache && query.length > 2,
        cacheTime: 1000,
      })

      // useCache=false，不使用缓存
      await deduped('test', false)
      await deduped('test', false)
      expect(mockFn).toHaveBeenCalledTimes(2)

      // 重置mock
      mockFn.mockClear()

      // useCache=true且query长度>2，使用缓存
      await deduped('test', true)
      await deduped('test', true)
      expect(mockFn).toHaveBeenCalledTimes(1)

      // query长度<=2，不使用缓存
      await deduped('ab', true)
      await deduped('ab', true)
      expect(mockFn).toHaveBeenCalledTimes(3) // 1 + 2
    })

    test('shouldCache函数抛出错误时应该使用缓存', async () => {
      const mockFn = vi.fn().mockImplementation(async (arg: string) => {
        return `result-${arg}`
      })
      const deduped = deduplicatePromise(mockFn, {
        shouldCache: (_arg: string) => {
          throw new Error('shouldCache error')
        },
        cacheTime: 1000,
      })

      // 应该能正常工作，使用缓存
      await deduped('test')
      await deduped('test')

      // 由于shouldCache抛出错误，应该回退到正常缓存行为
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('缓存管理', () => {
    test('clearKey应该清除特定key的缓存', async () => {
      const mockFn = vi.fn()
        .mockResolvedValueOnce('result1')
        .mockResolvedValueOnce('result2')
        .mockResolvedValueOnce('result1-new')

      const deduped = deduplicatePromise(mockFn, {
        cacheTime: 1000,
      })

      // 缓存两个不同的结果
      await deduped('test1')
      await deduped('test2')
      expect(mockFn).toHaveBeenCalledTimes(2)

      // 验证缓存工作
      await deduped('test1')
      await deduped('test2')
      expect(mockFn).toHaveBeenCalledTimes(2)

      // 清除test1的缓存
      deduped.clearKey('test1')

      // test1应该重新执行，test2仍使用缓存
      await deduped('test1')
      await deduped('test2')
      expect(mockFn).toHaveBeenCalledTimes(3)
    })
  })

  describe('向后兼容性', () => {
    test('应该支持旧的API形式', async () => {
      const mockFn = vi.fn().mockResolvedValue('result')

      // 旧的API：传递cacheTime作为第二个参数
      const deduped = deduplicatePromise(mockFn, { cacheTime: 500 })

      const result = await deduped('test')
      expect(result).toBe('result')
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    test('无配置时应使用默认值', async () => {
      const mockFn = vi.fn().mockResolvedValue('result')
      const deduped = deduplicatePromise(mockFn)

      const result = await deduped('test')
      expect(result).toBe('result')
    })
  })
})
