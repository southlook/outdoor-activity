const app = getApp()
const { logout, checkLogin, isAdmin } = require('../../utils/auth')
const api = require('../../utils/api')

Page({
  data: {
    userInfo: null,
    isLogin: false,
    isAdmin: false,
    openid: '',
    stats: {
      published: 0,
      signups: 0,
      favorites: 0
    }
  },

  onShow() {
    this.refreshUserInfo()
  },

  /**
   * 刷新用户信息
   */
  refreshUserInfo() {
    const isLogin = checkLogin()
    const userInfo = app.globalData.userInfo || {}
    const openid = app.globalData.openid || ''

    this.setData({
      isLogin,
      isAdmin: isAdmin(),
      userInfo,
      openid: openid.substring(0, 8) + '...'
    })

    if (!isLogin) return

    // 通过云函数获取统计数据
    const favorites = wx.getStorageSync('favorites') || []
    Promise.all([
      api.getMyActivities().catch(() => ({ data: [] })),
      api.getMySignups().catch(() => ({ data: [] }))
    ]).then(([actRes, sigRes]) => {
      this.setData({
        stats: {
          published: (actRes.data || []).length,
          signups: (sigRes.data || []).length,
          favorites: favorites.length
        }
      })
    })
  },

  /**
   * 跳转登录
   */
  goLogin() {
    if (!this.data.isLogin) {
      wx.navigateTo({ url: '/pages/login/login' })
    }
  },

  /**
   * 跳转发布页（仅管理员可见入口）
   */
  goPublish() {
    if (!checkLogin()) {
      wx.navigateTo({ url: '/pages/login/login' })
      return
    }
    wx.navigateTo({ url: '/pages/publish/publish' })
  },

  /**
   * 我发布的活动
   */
  goMyActivities() {
    if (!checkLogin()) {
      wx.navigateTo({ url: '/pages/login/login' })
      return
    }
    wx.navigateTo({ url: '/pages/my-activities/my-activities' })
  },

  /**
   * 我报名的活动
   */
  goMySignups() {
    if (!checkLogin()) {
      wx.navigateTo({ url: '/pages/login/login' })
      return
    }
    wx.navigateTo({ url: '/pages/my-signups/my-signups' })
  },

  /**
   * 我的收藏
   */
  goFavorites() {
    if (!checkLogin()) {
      wx.navigateTo({ url: '/pages/login/login' })
      return
    }
    wx.showToast({ title: '收藏功能开发中', icon: 'none' })
  },

  /**
   * 意见反馈
   */
  onFeedback() {
    wx.showToast({ title: '反馈功能开发中', icon: 'none' })
  },

  /**
   * 关于我们
   */
  onAbout() {
    wx.showModal({
      title: '野见山川',
      content: '版本 1.0.0\n\n让户外活动更美好，发现身边的户外精彩。',
      showCancel: false
    })
  },

  /**
   * 查看用户服务协议
   */
  goUserAgreement() {
    wx.navigateTo({ url: '/pages/agreement/agreement?type=user' })
  },

  /**
   * 查看隐私政策
   */
  goPrivacyPolicy() {
    wx.navigateTo({ url: '/pages/agreement/agreement?type=privacy' })
  },

  /**
   * 退出登录
   */
  onLogout() {
    wx.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          logout()
          this.refreshUserInfo()
          wx.showToast({ title: '已退出登录', icon: 'success' })
        }
      }
    })
  }
})
