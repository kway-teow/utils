/**
 * 缓存配置选项
 */
export interface DeduplicateOptions<T extends any[]> {
  /** 缓存结果的时间（毫秒），默认300ms */
  cacheTime?: number
  /** 自定义缓存key生成器 */
  keyGenerator?: (...args: T) => string
  /** 基于特定参数字段生成key的字段索引数组 */
  keyFields?: number[]
  /** 条件缓存：返回false时不使用缓存 */
  shouldCache?: (...args: T) => boolean
}

/**
 * 缓存条目
 */
interface CacheEntry<R> {
  result: R
  timestamp: number
}

/**
 * 增强版去重Promise函数
 */
export interface DeduplicatedFunction<T extends any[], R> {
  (...args: T): Promise<R>
  /** 清除所有缓存 */
  clearCache: () => void
  /** 清除特定key的缓存 */
  clearKey: (...args: T) => void
}

/**
 * 创建一个请求去重函数，确保并发调用时函数只执行一次，所有调用者都能获取结果
 * @template T 函数参数类型
 * @template R 函数返回值类型
 * @param {(...args: T[]) => R | Promise<R>} fn 需要去重的函数
 * @param {DeduplicateOptions<T>} [options] 配置选项
 * @returns {DeduplicatedFunction<T, R>} 返回一个增强的去重函数
 * @example
 * ```typescript
 * // 基础用法
 * const deduped = deduplicatePromise(async (query: string) => {
 *   return await searchAPI(query);
 * });
 *
 * // 自定义key生成器
 * const deduped = deduplicatePromise(
 *   async (user: User, options: SearchOptions) => searchAPI(user, options),
 *   {
 *     keyGenerator: (user, options) => `${user.id}-${options.type}`,
 *     cacheTime: 1000
 *   }
 * );
 *
 * // 基于特定字段缓存
 * const deduped = deduplicatePromise(
 *   async (user: User, query: string, timestamp: number) => searchAPI(user, query),
 *   {
 *     keyFields: [0, 1], // 只基于user和query参数生成key，忽略timestamp
 *     cacheTime: 500
 *   }
 * );
 *
 * // 条件缓存
 * const deduped = deduplicatePromise(
 *   async (query: string, useCache: boolean) => searchAPI(query),
 *   {
 *     shouldCache: (query, useCache) => useCache && query.length > 2,
 *     cacheTime: 1000
 *   }
 * );
 * ```
 */
export function deduplicatePromise<T extends any[], R>(
  fn: (...args: T) => R | Promise<R>,
  options: DeduplicateOptions<T> = {},
): DeduplicatedFunction<T, R> {
  const {
    cacheTime = 300,
    keyGenerator,
    keyFields,
    shouldCache,
  } = options

  // 缓存存储
  const pendingRequests = new Map<string, Promise<R>>()
  const completedResults = new Map<string, CacheEntry<R>>()

  /**
   * 生成缓存key
   */
  const getCacheKey = (args: T): string => {
    try {
      // 使用自定义key生成器
      if (keyGenerator) {
        return keyGenerator(...args)
      }

      // 基于特定字段生成key
      if (keyFields !== undefined) {
        const selectedArgs = keyFields.map(index => args[index])
        return JSON.stringify(selectedArgs)
      }

      // 默认使用所有参数
      return JSON.stringify(args)
    }
    catch {
      // 如果无法生成key，使用时间戳确保每次都执行
      return Date.now().toString()
    }
  }

  /**
   * 检查缓存是否有效
   */
  const isCacheValid = (entry: CacheEntry<R>): boolean => {
    const age = Date.now() - entry.timestamp
    return age < cacheTime
  }

  const wrappedFn = (...args: T): Promise<R> => {
    // 检查是否应该使用缓存
    try {
      if (shouldCache && !shouldCache(...args)) {
        return Promise.resolve(fn(...args))
      }
    }
    catch {
      // 如果shouldCache函数抛出错误，回退到正常缓存行为
    }

    const key = getCacheKey(args)

    // 检查是否有有效的缓存结果
    const cachedEntry = completedResults.get(key)
    if (cachedEntry && isCacheValid(cachedEntry)) {
      return Promise.resolve(cachedEntry.result)
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
        // 缓存成功结果
        completedResults.set(key, {
          result,
          timestamp: Date.now(),
        })
        pendingRequests.delete(key)
        return result
      })
      .catch((error) => {
        // 错误时清理进行中的请求，不缓存错误
        pendingRequests.delete(key)
        throw error
      })

    // 存储进行中的请求
    pendingRequests.set(key, request)

    return request
  }

  // 清除所有缓存
  wrappedFn.clearCache = () => {
    pendingRequests.clear()
    completedResults.clear()
  }

  // 清除特定key的缓存
  wrappedFn.clearKey = (...args: T) => {
    const key = getCacheKey(args)
    pendingRequests.delete(key)
    completedResults.delete(key)
  }

  return wrappedFn
}
