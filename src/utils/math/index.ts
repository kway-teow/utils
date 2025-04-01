/**
 * 精确加法
 * @param a 第一个数值
 * @param b 第二个数值
 * @returns 精确的加法结果
 */
export const add = (a: number | string | undefined, b: number | string | undefined): number => {
  if (a === undefined || b === undefined) return 0

  const num1 = Number(a)
  const num2 = Number(b)

  if (isNaN(num1) || isNaN(num2)) return 0

  const num1Digits = (num1.toString().split('.')[1] || '').length
  const num2Digits = (num2.toString().split('.')[1] || '').length
  const multiplier = Math.pow(10, Math.max(num1Digits, num2Digits))

  return Math.round(num1 * multiplier + num2 * multiplier) / multiplier
}

/**
 * 精确减法
 * @param a 被减数
 * @param b 减数
 * @returns 精确的减法结果
 */
export const subtract = (a: number | string | undefined, b: number | string | undefined): number => {
  if (a === undefined || b === undefined) return 0

  const num1 = Number(a)
  const num2 = Number(b)

  if (isNaN(num1) || isNaN(num2)) return 0

  const num1Digits = (num1.toString().split('.')[1] || '').length
  const num2Digits = (num2.toString().split('.')[1] || '').length
  const multiplier = Math.pow(10, Math.max(num1Digits, num2Digits))

  return Math.round(num1 * multiplier - num2 * multiplier) / multiplier
}

/**
 * 精确乘法
 * @param a 第一个因数
 * @param b 第二个因数
 * @returns 精确的乘法结果
 */
export const multiply = (a: number | string | undefined, b: number | string | undefined): number => {
  if (a === undefined || b === undefined) return 0

  const num1 = Number(a)
  const num2 = Number(b)

  if (isNaN(num1) || isNaN(num2)) return 0

  const num1String = num1.toString()
  const num2String = num2.toString()

  const num1Digits = (num1String.split('.')[1] || '').length
  const num2Digits = (num2String.split('.')[1] || '').length

  const multiplier = Math.pow(10, num1Digits + num2Digits)

  return Number(num1String.replace('.', '')) * Number(num2String.replace('.', '')) / multiplier
}

/**
 * 精确除法
 * @param a 被除数
 * @param b 除数
 * @param decimals 小数点后位数，默认为2
 * @returns 精确的除法结果
 */
export const divide = (a: number | string | undefined, b: number | string | undefined, decimals: number = 2): number => {
  if (a === undefined || b === undefined) return 0

  const num1 = Number(a)
  const num2 = Number(b)

  if (isNaN(num1) || isNaN(num2) || num2 === 0) return 0

  const result = num1 / num2
  const multiplier = Math.pow(10, decimals)

  return Math.round(result * multiplier) / multiplier
}

/**
 * 对数值进行四舍五入
 * @param num 需要四舍五入的数值
 * @param decimals 小数点后位数，默认为0
 * @returns 四舍五入后的结果
 */
export const round = (num: number | string | undefined, decimals: number = 0): number => {
  if (num === undefined) return 0

  const number = Number(num)

  if (isNaN(number)) return 0

  const multiplier = Math.pow(10, decimals)
  return Math.round(number * multiplier) / multiplier
}

/**
 * 格式化为货币形式
 * @param amount 金额
 * @param currencyCode 货币代码，默认为"CNY"
 * @param locale 本地化设置，默认为"zh-CN"
 * @param decimals 小数点后位数，默认为2
 * @returns 格式化后的货币字符串
 */
export const formatCurrency = (
  amount: number | string | undefined,
  currencyCode: string = 'CNY',
  locale: string = 'zh-CN',
  decimals: number = 2,
): string => {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })

  if (amount === undefined) return formatter.format(0)

  const number = Number(amount)

  if (isNaN(number)) return formatter.format(0)

  return formatter.format(number)
}

/**
 * 生成指定范围内的随机整数
 * @param min 最小值（包含），默认为0
 * @param max 最大值（包含），默认为100
 * @returns 指定范围内的随机整数
 */
export const randomInt = (min: number = 0, max: number = 100): number => {
  if (typeof min !== 'number' || typeof max !== 'number' || isNaN(min) || isNaN(max)) {
    return 0
  }

  if (min > max) {
    [min, max] = [max, min]
  }

  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * 生成指定范围内的随机浮点数
 * @param min 最小值（包含），默认为0
 * @param max 最大值（包含），默认为1
 * @param decimals 小数点后位数，默认为2
 * @returns 指定范围内的随机浮点数
 */
export const randomFloat = (min: number = 0, max: number = 1, decimals: number = 2): number => {
  if (typeof min !== 'number' || typeof max !== 'number' || typeof decimals !== 'number'
    || isNaN(min) || isNaN(max) || isNaN(decimals)) {
    return 0
  }

  if (min > max) {
    [min, max] = [max, min]
  }

  const random = Math.random() * (max - min) + min
  const multiplier = Math.pow(10, decimals)
  return Math.round(random * multiplier) / multiplier
}

/**
 * 生成UUID v4
 * @returns UUID v4字符串
 */
export const uuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * 生成指定长度的随机字符串
 * @param length 字符串长度，默认为16
 * @param chars 可选字符集，默认为字母和数字
 * @returns 指定长度的随机字符串
 */
export const randomString = (length: number = 16, chars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string => {
  if (typeof length !== 'number' || length <= 0) {
    return ''
  }

  if (typeof chars !== 'string' || chars.length === 0) {
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  }

  let result = ''
  const charsLength = chars.length

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charsLength))
  }

  return result
}

/**
 * 从数组中随机选择一个元素
 * @param array 数组
 * @returns 随机选择的元素，如果数组为空或不是数组则返回undefined
 */
export const randomElement = <T>(array: T[] | readonly T[] | undefined): T | undefined => {
  if (!array || !Array.isArray(array) || array.length === 0) {
    return undefined
  }

  return array[Math.floor(Math.random() * array.length)]
}

/**
 * 从数组中随机选择多个不重复的元素
 * @param array 数组
 * @param count 选择的元素数量，默认为1
 * @returns 随机选择的元素数组
 */
export const randomElements = <T>(array: T[] | readonly T[] | undefined, count: number = 1): T[] => {
  if (!array || !Array.isArray(array) || array.length === 0) {
    return []
  }

  if (typeof count !== 'number' || count <= 0) {
    return []
  }

  // 如果请求的数量大于数组长度，返回打乱后的整个数组
  if (count >= array.length) {
    return shuffle([...array])
  }

  const result: T[] = []
  const copied = [...array]

  for (let i = 0; i < count; i++) {
    const index = Math.floor(Math.random() * copied.length)
    result.push(copied[index])
    copied.splice(index, 1)
  }

  return result
}

/**
 * 随机打乱数组元素顺序（Fisher-Yates洗牌算法）
 * @param array 要打乱的数组
 * @returns 打乱后的新数组，原数组不变
 */
export const shuffle = <T>(array: T[] | readonly T[] | undefined): T[] => {
  if (!array || !Array.isArray(array)) {
    return []
  }

  // 确保创建一个新数组而不是修改原数组
  const result = [...array]

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }

  return result
}
