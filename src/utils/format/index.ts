/**
 * 格式化相关工具函数
 */

/**
 * 格式化手机号码
 * @param phone 手机号码
 * @param separator 分隔符
 * @returns 格式化后的手机号码
 * @example
 * formatPhone('13812345678') // 138 1234 5678
 * formatPhone('13812345678', '-') // 138-1234-5678
 */
export function formatPhone(phone: string | number, separator: string = ' '): string {
  const value = String(phone).replace(/[^\d]/g, '')
  const groups = value.match(/^(\d{3})(\d{4})(\d{4})$/)

  if (!groups) {
    return String(phone)
  }

  return groups.slice(1).join(separator)
}

/**
 * 格式化身份证号
 * @param idCard 身份证号
 * @param separator 分隔符
 * @returns 格式化后的身份证号
 * @example
 * formatIdCard('440101199001011234') // 440101 19900101 1234
 * formatIdCard('440101199001011234', '-') // 440101-19900101-1234
 */
export function formatIdCard(idCard: string, separator: string = ' '): string {
  const value = String(idCard).replace(/[^\dXx]/g, '')
  const groups = value.match(/^(\d{6})(\d{8})(\d{3}[\dXx])$/)

  if (!groups) {
    return String(idCard)
  }

  return groups.slice(1).join(separator)
}

/**
 * 格式化银行卡号
 * @param cardNumber 银行卡号
 * @param separator 分隔符
 * @returns 格式化后的银行卡号
 * @example
 * formatBankCard('6225365271562822') // 6225 3652 7156 2822
 * formatBankCard('6225365271562822', '-') // 6225-3652-7156-2822
 */
export function formatBankCard(cardNumber: string | number, separator: string = ' '): string {
  const value = String(cardNumber).replace(/[^\d]/g, '')
  const parts = value.match(/[\d]{4}/g) || []

  return parts.join(separator)
}

/**
 * 格式化金额
 * @param amount 金额
 * @param options 配置选项
 * @returns 格式化后的金额
 * @example
 * formatAmount(1234567.89) // '1,234,567.89'
 * formatAmount(1234567.89, { prefix: '¥' }) // '¥1,234,567.89'
 * formatAmount(1234567.89, { prefix: '$', decimals: 0 }) // '$1,234,568'
 */
export function formatAmount(
  amount: number | string,
  options: {
    prefix?: string
    suffix?: string
    decimals?: number
    decimalSeparator?: string
    thousandsSeparator?: string
  } = {},
): string {
  if (amount === null || amount === undefined) {
    return String(amount)
  }

  const value = Number(amount)

  if (Number.isNaN(value)) {
    return String(amount)
  }

  const {
    prefix = '',
    suffix = '',
    decimals = 2,
    decimalSeparator = '.',
    thousandsSeparator = ',',
  } = options

  const fixed = value.toFixed(decimals)
  const [intPart, decimalPart = ''] = fixed.split('.')

  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator)

  return `${prefix}${formattedInt}${decimalPart ? decimalSeparator + decimalPart : ''}${suffix}`
}

/**
 * 格式化百分比
 * @param value 数值
 * @param decimals 小数位数
 * @returns 格式化后的百分比
 * @example
 * formatPercent(0.1234) // '12.34%'
 * formatPercent(0.1234, 1) // '12.3%'
 */
export function formatPercent(value: number, decimals: number = 2): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 'NaN%'
  }
  return `${(value * 100).toFixed(decimals)}%`
}
