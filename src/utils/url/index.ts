/**
 * URL 工具函数，用于处理 URL 参数、构建和查询字符串操作
 * @module
 */

/**
 * 从给定 URL 字符串解析 URL 参数
 * @param url - 要解析的 URL 字符串。如果未提供，则使用当前窗口位置（仅限浏览器环境）
 * @returns 包含 URL 参数键值对的对象
 */
export function parseUrlParams(url?: string): Record<string, string> {
  if (!url && typeof window === 'undefined') {
    return {}
  }

  const urlString = url || (typeof window !== 'undefined' ? window.location.href : '')
  try {
    const urlObj = new URL(urlString)
    const params: Record<string, string> = {}

    urlObj.searchParams.forEach((value, key) => {
      params[key] = value
    })

    return params
  }
  catch {
    return {}
  }
}

/**
 * 构建 URL 的选项
 */
export interface BuildUrlOptions {
  /** 基础 URL */
  baseUrl: string
  /** 附加到基础 URL 的路径 */
  path?: string
  /** 作为对象的查询参数 */
  params?: Record<string, string | number | boolean | null | undefined>
  /** URL 的片段/哈希部分（不包含 #） */
  hash?: string
}

/**
 * 从组件构建 URL
 * @param options - 用于构建 URL 的 BuildUrlOptions
 * @returns 构建的 URL 字符串
 */
export function buildUrl(options: BuildUrlOptions): string {
  const { baseUrl, path = '', params = {}, hash = '' } = options

  if (!baseUrl) {
    return ''
  }

  let url = baseUrl

  // 如果存在路径，则添加路径
  if (path) {
    // 确保 baseUrl 和 path 之间只有一个斜杠
    url = url.endsWith('/') ? url + path.replace(/^\//, '') : `${url}/${path.replace(/^\//, '')}`
  }

  // 如果存在查询参数，则添加查询参数
  const searchParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      searchParams.append(key, String(value))
    }
  })

  const queryString = searchParams.toString()
  if (queryString) {
    url = `${url}${url.includes('?') ? '&' : '?'}${queryString}`
  }

  // 如果存在哈希，则添加哈希
  if (hash) {
    url = `${url}#${hash}`
  }

  return url
}

/**
 * 将查询字符串解析为对象
 * @param queryString - 要解析的查询字符串（不包含前导 ?）
 * @returns 包含查询字符串中键值对的对象
 */
export function parseQueryString(queryString: string): Record<string, string> {
  if (!queryString) {
    return {}
  }

  const cleanQuery = queryString.startsWith('?') ? queryString.slice(1) : queryString
  const searchParams = new URLSearchParams(cleanQuery)
  const result: Record<string, string> = {}

  searchParams.forEach((value, key) => {
    result[key] = value
  })

  return result
}

/**
 * 将对象转换为查询字符串
 * @param params - 包含要转换的键值对的对象
 * @param options - 字符串化选项
 * @returns 查询字符串（不包含前导 ?）
 */
export function stringifyQueryParams(
  params: Record<string, string | number | boolean | null | undefined>,
  options: { skipNull?: boolean, skipEmpty?: boolean } = {},
): string {
  if (!params || typeof params !== 'object') {
    return ''
  }

  const { skipNull = true, skipEmpty = false } = options
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    // 如果 skipNull 为 true，则跳过 null/undefined 值
    if (skipNull && (value === null || value === undefined)) {
      return
    }

    // 如果 skipEmpty 为 true，则跳过空字符串
    if (skipEmpty && value === '') {
      return
    }

    searchParams.append(key, String(value))
  })

  return searchParams.toString()
}

/**
 * 将查询参数附加到现有 URL
 * @param url - 要附加参数的基础 URL
 * @param params - 要附加的参数
 * @returns 附加了参数的 URL
 */
export function appendQueryParams(
  url: string,
  params: Record<string, string | number | boolean | null | undefined>,
): string {
  if (!url) {
    return ''
  }

  if (!params || Object.keys(params).length === 0) {
    return url
  }

  const queryString = stringifyQueryParams(params)
  if (!queryString) {
    return url
  }

  return `${url}${url.includes('?') ? '&' : '?'}${queryString}`
}

/**
 * 查询字符串辅助函数集合
 */
export const queryStringHelpers = {
  /** 解析查询字符串 */
  parse: parseQueryString,
  /** 字符串化查询参数 */
  stringify: stringifyQueryParams,
  /** 附加查询参数 */
  append: appendQueryParams,
}
