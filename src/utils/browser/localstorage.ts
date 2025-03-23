/**
 * LocalStorage 工具类
 * 提供 LocalStorage 的基础操作封装，支持过期时间设置
 */

export interface StorageData<T = any> {
  value: T
  expires?: number
  valueType?: 'string' | 'number' | 'boolean' | 'object' | 'array'
}

export class LocalStorageUtil {
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
}
