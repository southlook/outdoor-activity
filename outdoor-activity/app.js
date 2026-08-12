// app.js
App({
  globalData: {
    userInfo: null,
    openid: null,
    isLogin: false
  },

  // 隐私弹窗显示状态监听器列表
  privacyListeners: [],
  // 等待隐私授权结果的回调队列
  privacyCallbacks: [],
  // 微信框架回传的 resolve 函数
  privacyResolve: null,

  onLaunch() {
    // 初始化云开发环境
    if (wx.cloud) {
      wx.cloud.init({
        env: 'outdoor-activity-d6e3bfuf9864f64', // 实际的云开发环境ID
        traceUser: true
      })
    }

    // 初始化微信官方隐私保护机制
    this.initPrivacyCheck()

    // 检查登录态
    this.checkLoginStatus()
  },

  /**
   * 初始化隐私保护检查（官方隐私合规机制）
   * 当调用隐私接口且用户尚未同意时，微信会触发该回调，
   * 由 privacy-popup 弹窗组件展示授权弹窗，用户主动同意后才继续。
   */
  initPrivacyCheck() {
    if (wx.onNeedPrivacyAuthorization) {
      wx.onNeedPrivacyAuthorization((resolve) => {
        this.privacyResolve = resolve
        this.notifyPrivacyPopup(true)
      })
    }
  },

  /**
   * 注册隐私弹窗显示状态监听，返回取消监听函数
   */
  addPrivacyListener(callback) {
    this.privacyListeners.push(callback)
    return () => {
      const index = this.privacyListeners.indexOf(callback)
      if (index > -1) this.privacyListeners.splice(index, 1)
    }
  },

  /**
   * 通知所有 privacy-popup 组件显示/隐藏
   */
  notifyPrivacyPopup(show) {
    this.privacyListeners.forEach((cb) => cb(show))
  },

  /**
   * 登记一次等待隐私授权结果的业务回调
   */
  addPrivacyCallback(callbacks) {
    this.privacyCallbacks.push(callbacks)
  },

  /**
   * 处理用户对隐私弹窗的选择
   * @param {boolean} agreed 用户是否点击同意
   */
  handlePrivacyResult(agreed) {
    const callbacks = this.privacyCallbacks
    this.privacyCallbacks = []
    this.notifyPrivacyPopup(false)

    if (agreed) {
      if (this.privacyResolve) {
        // 告知微信框架用户已同意，id 需与弹窗同意按钮一致
        this.privacyResolve({ event: 'agree', buttonId: 'agree-btn' })
        this.privacyResolve = null
      }
      callbacks.forEach((c) => c.resolve())
    } else {
      callbacks.forEach((c) => c.reject(new Error('用户不同意隐私政策')))
    }
  },

  /**
   * 检查本地缓存中的登录状态
   */
  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo')
    const openid = wx.getStorageSync('openid')
    if (userInfo && openid) {
      this.globalData.userInfo = userInfo
      this.globalData.openid = openid
      this.globalData.isLogin = true
    }
  },

  /**
   * 设置登录信息
   */
  setLoginInfo(userInfo, openid) {
    this.globalData.userInfo = userInfo
    this.globalData.openid = openid
    this.globalData.isLogin = true
    wx.setStorageSync('userInfo', userInfo)
    wx.setStorageSync('openid', openid)
  },

  /**
   * 清除登录信息
   */
  clearLoginInfo() {
    this.globalData.userInfo = null
    this.globalData.openid = null
    this.globalData.isLogin = false
    wx.removeStorageSync('userInfo')
    wx.removeStorageSync('openid')
  }
})
