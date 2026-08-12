/**
 * 通用工具函数
 */

/**
 * 格式化日期时间
 * @param {Date|string|number} date 日期对象、字符串或时间戳
 * @param {string} fmt 格式模板，如 'YYYY-MM-DD HH:mm'
 * @returns {string}
 */
function formatTime(date, fmt = 'YYYY-MM-DD HH:mm') {
  if (!date) return ''
  if (typeof date === 'string' || typeof date === 'number') {
    date = new Date(date)
  }
  const map = {
    'YYYY': date.getFullYear(),
    'MM': String(date.getMonth() + 1).padStart(2, '0'),
    'DD': String(date.getDate()).padStart(2, '0'),
    'HH': String(date.getHours()).padStart(2, '0'),
    'mm': String(date.getMinutes()).padStart(2, '0'),
    'ss': String(date.getSeconds()).padStart(2, '0')
  }
  let result = fmt
  Object.keys(map).forEach(key => {
    result = result.replace(key, map[key])
  })
  return result
}

/**
 * 格式化价格为 ¥xxx
 */
function formatPrice(price) {
  if (price === 0 || price === undefined || price === null) return '免费'
  return '¥' + Number(price).toFixed(0)
}

/**
 * 计算两个日期之间的天数差
 */
function daysBetween(start, end) {
  const s = new Date(start)
  const e = new Date(end)
  return Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1
}

/**
 * 获取活动状态
 */
function getActivityStatus(activity) {
  const now = new Date().getTime()
  const endTime = new Date(activity.endTime).getTime()
  if (now > endTime) return { text: '已结束', type: 'gray' }
  if (activity.currentParticipants >= activity.maxParticipants) {
    return { text: '已满员', type: 'red' }
  }
  return { text: '报名中', type: 'green' }
}

/**
 * 获取相对时间描述
 */
function getRelativeTime(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) return '刚刚'
  if (diff < hour) return Math.floor(diff / minute) + '分钟前'
  if (diff < day) return Math.floor(diff / hour) + '小时前'
  if (diff < 7 * day) return Math.floor(diff / day) + '天前'
  return formatTime(date, 'MM-DD')
}

/**
 * 防抖函数
 */
function debounce(fn, delay = 300) {
  let timer = null
  return function (...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn.apply(this, args), delay)
  }
}

/**
 * 手机号校验
 */
function isValidPhone(phone) {
  return /^1[3-9]\d{9}$/.test(phone)
}

/**
 * 生成简单的唯一ID
 */
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
}

module.exports = {
  formatTime,
  formatPrice,
  daysBetween,
  getActivityStatus,
  getRelativeTime,
  debounce,
  isValidPhone,
  generateId
}
