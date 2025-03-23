/**
 * 首字母大写
 * @param str 输入字符串
 * @returns 首字母大写的字符串
 */
export const capitalize = (str: string | undefined): string => {
  if (typeof str !== 'string') return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

/**
 * 驼峰转换为短横线
 * @param str 输入字符串
 * @returns 短横线格式的字符串
 */
export const camelToKebab = (str: string | undefined): string => {
  if (typeof str !== 'string') return ''
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}

/**
 * 短横线转换为驼峰
 * @param str 输入字符串
 * @returns 驼峰格式的字符串
 */
export const kebabToCamel = (str: string | undefined): string => {
  if (typeof str !== 'string') return ''
  return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase())
}
