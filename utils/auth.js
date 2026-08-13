/**
 * 登录鉴权模块
 */

const app = getApp()

/**
 * 执行微信登录流程
 */
function login(params = {}) {
  return new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'login',
      data: {
        nickName: params.nickName || '',
        avatarUrl: params.avatarUrl || ''
      },
      success(res) {
        if (res.result && res.result.openid) {
          const openid = res.result.openid
          app.globalData.openid = openid
          wx.setStorageSync('openid', openid)
          resolve(res.result)
        } else {
          reject(new Error('登录失败'))
        }
      },
      fail(err) {
        reject(err)
      }
    })
  })
}

/**
 * 检查是否已登录
 */
function checkLogin() {
  return !!app.globalData.openid
}

/**
 * 需要登录时跳转到登录页
 */
function requireLogin(callback) {
  if (checkLogin()) {
    callback && callback()
  } else {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  }
}

/**
 * 是否为管理员/认证发布者
 */
function isAdmin() {
  return !!(app.globalData.userInfo && app.globalData.userInfo.role === 'admin')
}

/**
 * 退出登录
 */
function logout() {
  app.clearLoginInfo()
}

module.exports = {
  login,
  checkLogin,
  requireLogin,
  isAdmin,
  logout
}
