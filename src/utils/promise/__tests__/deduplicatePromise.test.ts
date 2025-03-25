import { describe, test, expect, vi, beforeEach } from 'vitest'
import { deduplicatePromise } from '../deduplicate-promise'

describe('deduplicatePromise', () => {
  // 模拟延迟函数
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  // 每个测试前重置模拟计时器
  beforeEach(() => {
    vi.useRealTimers()
  })

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
    const deduped = deduplicatePromise(mockFn, 1000) // 1秒缓存

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
    const deduped = deduplicatePromise(mockFn, 1000)

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

    // 错误后再次调用应重新执行原始函数
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
