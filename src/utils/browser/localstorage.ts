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
    if (LocalStorageUtil.isInitialized) {
      return
    }

    if (typeof window === 'undefined' || !window.localStorage) {
      LocalStorageUtil.isInitialized = false
      return
    }

    // 保存原始的 getItem 方法
    const originalGetItem = localStorage.getItem.bind(localStorage)

    // 重写 getItem 方法
    localStorage.getItem = function (key: string): string | null {
      const item = originalGetItem(key)
      if (item === null) {
        return null
      }

      try {
        const data = JSON.parse(item)
        if (
          typeof data === 'object'
          && data !== null
          && 'value' in data
          && 'expires' in data
          && typeof data.expires === 'number'
          && Date.now() > data.expires
        ) {
          localStorage.removeItem(key)
          return null
        }
        return item
      }
      catch {
        // 如果解析失败，返回原始值
        return item
      }
    }

    LocalStorageUtil.isInitialized = true
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
      ...(expires !== undefined ? { expires: Date.now() + expires * 3600 * 1000 } : {}),
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
      if (data.expires && data.expires < Date.now()) {
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

    const item = localStorage.getItem(key)
    if (!item) return false

    try {
      const data: StorageData = JSON.parse(item)
      if (data.expires && data.expires < Date.now()) {
        localStorage.removeItem(key)
        return false
      }
      return true
    }
    catch {
      return true // 如果不是我们存储的格式，但存在值，则返回 true
    }
  }
}

// 自动初始化
if (typeof window !== 'undefined') {
  LocalStorageUtil.init()
}
