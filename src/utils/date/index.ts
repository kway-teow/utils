/**
 * 处理时间参数，统一返回毫秒时间戳
 * @param date 日期对象、时间戳（秒或毫秒）或日期字符串
 * @returns 毫秒级时间戳或原始Date对象
 * @private
 */
function normalizeDate(date: Date | number | string): Date | number | string {
  if (date instanceof Date) return date

  // 处理字符串类型的数字
  if (typeof date === 'string' && /^[0-9]+$/.test(date)) {
    date = Number(date)
  }

  // 处理秒级时间戳（10位数字）转为毫秒级
  if (typeof date === 'number' && date.toString().length === 10) {
    return date * 1000
  }

  return date
}

/**
 * 格式化日期
 * @param date 日期对象或时间戳（支持毫秒级和秒级时间戳）
 * @param format 格式化模板，例如 'YYYY-MM-DD HH:mm:ss'
 * @param timezone 时区，例如 'Asia/Shanghai'。默认使用本地时区
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | number | string, format = 'YYYY-MM-DD', timezone?: string): string {
  if (date === null || date === undefined) return ''

  date = normalizeDate(date)
  const d = new Date(date)

  // 检查日期是否有效
  if (isNaN(d.getTime())) return ''

  let year: number, month: number, day: number, hours: number, minutes: number, seconds: number

  if (timezone) {
    const dateStr = d.toLocaleString('en-US', { timeZone: timezone })
    const tzDate = new Date(dateStr)
    year = tzDate.getFullYear()
    month = tzDate.getMonth() + 1
    day = tzDate.getDate()
    hours = tzDate.getHours()
    minutes = tzDate.getMinutes()
    seconds = tzDate.getSeconds()
  }
  else {
    year = d.getFullYear()
    month = d.getMonth() + 1
    day = d.getDate()
    hours = d.getHours()
    minutes = d.getMinutes()
    seconds = d.getSeconds()
  }

  return format
    .replace('YYYY', String(year))
    .replace('MM', String(month).padStart(2, '0'))
    .replace('DD', String(day).padStart(2, '0'))
    .replace('HH', String(hours).padStart(2, '0'))
    .replace('mm', String(minutes).padStart(2, '0'))
    .replace('ss', String(seconds).padStart(2, '0'))
}

/**
 * 获取相对时间描述
 * @param date 目标日期（支持毫秒级和秒级时间戳）
 * @param now 当前日期（可选）
 * @returns 相对时间描述
 */
export function getRelativeTime(date: Date | number | string, now = new Date()): string {
  if (date === null || date === undefined) return ''

  date = normalizeDate(date)
  const targetDate = new Date(date)

  // 检查日期是否有效
  if (isNaN(targetDate.getTime())) return ''

  const currentDate = new Date(now)
  const diff = currentDate.getTime() - targetDate.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 365) {
    return `${Math.floor(days / 365)}年前`
  }
  if (days > 30) {
    return `${Math.floor(days / 30)}个月前`
  }
  if (days > 0) {
    return `${days}天前`
  }
  if (hours > 0) {
    return `${hours}小时前`
  }
  if (minutes > 0) {
    return `${minutes}分钟前`
  }
  return '刚刚'
}

/**
 * 判断是否为同一天
 * @param date1 第一个日期（支持毫秒级和秒级时间戳）
 * @param date2 第二个日期（支持毫秒级和秒级时间戳）
 * @returns 是否为同一天
 */
export function isSameDay(date1: Date | number | string | null | undefined, date2: Date | number | string | null | undefined): boolean {
  if (date1 === null || date1 === undefined || date2 === null || date2 === undefined) return false

  date1 = normalizeDate(date1 as Date | number | string)
  date2 = normalizeDate(date2 as Date | number | string)

  const d1 = new Date(date1)
  const d2 = new Date(date2)

  // 检查日期是否有效
  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return false

  return (
    d1.getFullYear() === d2.getFullYear()
    && d1.getMonth() === d2.getMonth()
    && d1.getDate() === d2.getDate()
  )
}

/**
 * 获取当前日期
 * @returns 当前日期
 */
export function getCurrentDate(): string {
  return formatDate(new Date())
}

/**
 * 秒转为时分秒
 * @param format 格式化模板，例如 'HH:mm:ss'、'H:m:s'、'HH时mm分ss秒'
 * @returns 时分秒
 */
export function formatTime(duration: number, format = 'HH:mm:ss'): string {
  if (duration === null || duration === undefined) return ''
  if (typeof duration === 'string' && /^\d+$/.test(duration)) {
    duration = Number(duration)
  }
  if (Number.isNaN(duration)) return ''
  if (duration === Infinity) return ''
  if (duration === -Infinity) return ''
  if (duration > 86400) return ''
  const isNegative = duration < 0
  duration = Math.abs(Math.floor(duration))

  const hours = Math.floor(duration / 3600)
  const minutes = Math.floor((duration % 3600) / 60)
  const seconds = duration % 60

  const result = format
    .replace('HH', String(hours).padStart(2, '0'))
    .replace('H', String(hours))
    .replace('mm', String(minutes).padStart(2, '0'))
    .replace('m', String(minutes))
    .replace('ss', String(seconds).padStart(2, '0'))
    .replace('s', String(seconds))

  return isNegative ? `-${result}` : result
}
