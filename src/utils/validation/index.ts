/**
 * 验证邮箱格式
 * @param email 邮箱地址
 * @returns 是否为有效邮箱
 */
export function isEmail(email: string): boolean {
  if (email === null || email === undefined) return false
  if (typeof email !== 'string') return false
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return pattern.test(email)
}

/**
 * 验证手机号格式（中国大陆）
 * @param phone 手机号
 * @returns 是否为有效手机号
 */
export function isChinesePhone(phone: string): boolean {
  if (phone === null || phone === undefined) return false
  if (typeof phone !== 'string') return false
  const pattern = /^1\d{10}$/
  return pattern.test(phone)
}

/**
 * 验证URL格式
 * @param url URL地址
 * @returns 是否为有效URL
 */
export function isURL(url: string): boolean {
  if (url === null || url === undefined) return false
  if (typeof url !== 'string') return false
  try {
    new URL(url)
    return true
  }
  catch {
    return false
  }
}

/**
 * 验证身份证号（中国大陆）
 * @param idCard 身份证号
 * @returns 是否为有效身份证号
 */
export function isChineseIDCard(idCard: string): boolean {
  if (idCard === null || idCard === undefined) return false
  if (typeof idCard !== 'string') return false
  const pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  return pattern.test(idCard)
}

/**
 * 验证是否为空值
 * @param value 要验证的值
 * @returns 是否为空值
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value.trim() === ''
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') return Object.keys(value).length === 0
  return false
}
