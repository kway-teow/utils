/**
 * 创建一个请求去重函数，确保并发调用时函数只执行一次，所有调用者都能获取结果
 * @template T 函数参数类型
 * @template R 函数返回值类型
 * @param {(...args: T[]) => R | Promise<R>} fn 需要去重的函数
 * @param {number} [cacheTime=300] 缓存结果的时间（毫秒），在此时间内的重复调用将直接返回缓存结果
 * @returns {(...args: T[]) => Promise<R>} 返回一个新的函数，该函数返回一个 Promise
 * @example
 * ```typescript
 * const deduplicatedFn = deduplicatePromise(async (query: string) => {
 *   const result = await searchAPI(query);
 *   return result;
 * }, 500);
 *
 * // 在并发环境中使用
 * // 即使同时调用多次，底层的searchAPI只会执行一次
 * // 所有调用都将收到相同的结果
 * const result1 = deduplicatedFn('search term');
 * const result2 = deduplicatedFn('search term');
 * const results = await Promise.all([result1, result2]);
 * ```
 */
export function deduplicatePromise<T extends any[], R>(
  fn: (...args: T) => R | Promise<R>,
  cacheTime: number = 300,
): {
    (...args: T): Promise<R>
    clearCache: () => void
  } {
  // 使用Map缓存进行中的请求和已完成的结果
  // 键是参数的字符串表示，值是Promise或结果
  const pendingRequests = new Map<string, Promise<R>>()
  const completedResults = new Map<string, { result: R, timestamp: number }>()

  const getCacheKey = (args: T): string => {
    try {
      return JSON.stringify(args)
    }
    catch {
      // 如果参数无法序列化，则使用时间戳作为键
      // 不用console.warn因为这是预期行为，对于循环引用的对象
      // 我们使用当前时间作为key，确保函数被执行
      return Date.now().toString()
    }
  }

  const wrappedFn = (...args: T): Promise<R> => {
    const key = getCacheKey(args)

    // 检查是否有缓存的结果，且在缓存时间内
    const cachedResult = completedResults.get(key)
    if (cachedResult && Date.now() - cachedResult.timestamp < cacheTime) {
      return Promise.resolve(cachedResult.result)
    }

    // 检查是否有正在进行中的相同请求
    const pendingRequest = pendingRequests.get(key)
    if (pendingRequest) {
      return pendingRequest
    }

    // 创建新请求
    const request = Promise.resolve()
      .then(() => fn(...args))
      .then((result) => {
        // 缓存结果
        completedResults.set(key, { result, timestamp: Date.now() })
        // 请求完成后从进行中移除
        pendingRequests.delete(key)
        return result
      })
      .catch((error) => {
        // 发生错误时从进行中移除
        pendingRequests.delete(key)
        throw error
      })

    // 存储进行中的请求
    pendingRequests.set(key, request)

    return request
  }

  // 添加清除缓存的方法
  wrappedFn.clearCache = () => {
    pendingRequests.clear()
    completedResults.clear()
  }

  return wrappedFn
}
