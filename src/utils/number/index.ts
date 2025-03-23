/**
 * 数字千分位格式化
 * @param num 要格式化的数字
 * @param decimals 保留小数位数
 * @returns 格式化后的字符串
 */
export function formatNumber(num: number | string | undefined | null, decimals = 2): string {
  if (num === undefined || num === null) return ''
  if (typeof num === 'string' && /^\d+$/.test(num)) {
    num = Number(num)
  }
  if (typeof num !== 'number' || Number.isNaN(num)) return ''
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}
