/**
 * LocalStorage 工具类
 * 提供 LocalStorage 的基础操作封装，支持过期时间设置
 *
 * 使用方法:
 * 1. 推荐使用 LocalStorageUtil 类的方法操作数据
 * 2. 也可以直接使用原生 localStorage 方法，过期检查仍然有效
 * 3. 如果在非浏览器环境，初始化会自动跳过
 */

export interface StorageData<T = any> {
  value: T
  expires?: number
  valueType?: 'string' | 'number' | 'boolean' | 'object' | 'array'
}

export class LocalStorageUtil {
  private static isInitialized = false

  /**
   * 初始化并劫持原生localStorage方法
   * 确保即使直接使用localStorage.getItem也能检查过期时间
   */
  static init(): void {
    if (this.isInitialized || typeof localStorage === 'undefined') {
      return
    }

    // 保存原始方法
    const originalGetItem = localStorage.getItem.bind(localStorage)

    // 重写getItem方法
    localStorage.getItem = function (key: string): string | null {
      const item = originalGetItem(key)
      if (!item) return null

      try {
        const data = JSON.parse(item)
        // 检查是否是我们存储的格式并检查过期时间
        if (data && typeof data === 'object' && 'value' in data && data.expires) {
          if (data.expires < new Date().getTime()) {
            localStorage.removeItem(key)
            return null
          }
        }
        return item
      }
      catch {
        return item // 如果解析失败，返回原始值
      }
    }

    this.isInitialized = true
  }

  /**
     * 设置 localStorage
     * @param key 键
     * @param value 值
     * @param expires 过期时间（小时），可选
     */
  static setItem<T>(key: string, value: T, expires?: number): void {
    if (typeof key !== 'string') {
      throw new Error('key must be a string')
    }

    // 确定值的类型
    let valueType: StorageData['valueType']
    if (Array.isArray(value)) {
      valueType = 'array'
    }
    else if (value === null) {
      valueType = 'object'
    }
    else {
      valueType = typeof value as StorageData['valueType']
    }

    const data: StorageData<T> = {
      value,
      valueType,
      ...(expires ? { expires: new Date().getTime() + expires * 3600 * 1000 } : {}),
    }
    localStorage.setItem(key, JSON.stringify(data))
  }

  /**
     * 获取 localStorage
     * @param key 键
     * @returns 存储的值，如果已过期或不存在则返回 null
     */
  static getItem<T>(key: string): T | null {
    if (typeof key !== 'string') {
      throw new Error('key must be a string')
    }

    const item = localStorage.getItem(key)
    if (!item) return null

    try {
      const data: StorageData<T> = JSON.parse(item)

      // 检查是否过期
      if (data.expires && data.expires < new Date().getTime()) {
        localStorage.removeItem(key)
        return null
      }

      // 根据存储时的类型进行恢复
      if (data.valueType === 'array' && !Array.isArray(data.value)) {
        return null
      }

      if (data.valueType && typeof data.value !== data.valueType && data.valueType !== 'array') {
        return null
      }

      return data.value
    }
    catch {
      return null
    }
  }

  /**
     * 删除指定的 localStorage
     * @param key 键
     */
  static removeItem(key: string): void {
    if (typeof key !== 'string') {
      throw new Error('key must be a string')
    }

    localStorage.removeItem(key)
  }

  /**
     * 清空所有 localStorage
  */
  static clear(): void {
    localStorage.clear()
  }

  /**
     * 检查是否存在某个 key
     * @param key 键
     * @returns boolean
  */
  static has(key: string): boolean {
    if (typeof key !== 'string') {
      throw new Error('key must be a string')
    }

    return localStorage.getItem(key) !== null
  }

  /**
   * 清理所有过期的 localStorage 项目
   * @returns 被清理的键的数组
   */
  static clearExpired(): string[] {
    const expiredKeys: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key) continue

      const item = localStorage.getItem(key)
      if (!item) continue

      try {
        const data: StorageData = JSON.parse(item)
        if (data.expires && data.expires < new Date().getTime()) {
          localStorage.removeItem(key)
          expiredKeys.push(key)
          i-- // 因为删除了一项，索引需要回退一位
        }
      }
      catch {
        // 解析失败则跳过该项
        continue
      }
    }

    return expiredKeys
  }
}

// 自动初始化
if (typeof window !== 'undefined') {
  LocalStorageUtil.init()
}
