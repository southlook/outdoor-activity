const app = getApp()
const { login } = require('../../utils/auth')
const { ensurePrivacy } = require('../../utils/privacy')

Page({
  data: {
    avatarUrl: '',
    nickName: '',
    // 协议勾选状态，默认不勾选，由用户主动选择
    agreed: false
  },

  /**
   * 选择头像回调
   */
  onChooseAvatar(e) {
    this.setData({ avatarUrl: e.detail.avatarUrl })
  },

  /**
   * 昵称输入
   */
  onNickNameInput(e) {
    this.setData({ nickName: e.detail.value })
  },

  /**
   * 昵称失焦（微信新版获取昵称方式）
   */
  onNickNameBlur(e) {
    if (e.detail.value) {
      this.setData({ nickName: e.detail.value })
    }
  },

  /**
   * 勾选/取消勾选协议
   */
  onToggleAgree() {
    this.setData({ agreed: !this.data.agreed })
  },

  /**
   * 查看《用户服务协议》
   */
  goUserAgreement() {
    wx.navigateTo({ url: '/pages/agreement/agreement?type=user' })
  },

  /**
   * 查看《隐私政策》
   */
  goPrivacyPolicy() {
    wx.navigateTo({ url: '/pages/agreement/agreement?type=privacy' })
  },

  /**
   * 登录
   */
  onLogin() {
    const { avatarUrl, nickName, agreed } = this.data

    // 未主动勾选协议时不得登录，引导用户阅读协议
    if (!agreed) {
      wx.showModal({
        title: '温馨提示',
        content: '请先阅读并同意《用户服务协议》和《隐私政策》',
        confirmText: '去查看',
        cancelText: '不同意',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/agreement/agreement?type=privacy' })
          }
        }
      })
      return
    }

    if (!nickName.trim()) {
      wx.showToast({ title: '请输入昵称', icon: 'none' })
      return
    }

    wx.showLoading({ title: '登录中...' })

    // 登录涉及收集个人信息，先完成微信官方隐私授权
    ensurePrivacy()
      .then(() => login({ nickName, avatarUrl }))
      .then((res) => {
        const userInfo = {
          nickName: nickName,
          avatarUrl: avatarUrl || (res.userInfo && res.userInfo.avatarUrl) || '',
          role: (res.userInfo && res.userInfo.role) || 'user'
        }
        app.setLoginInfo(userInfo, res.openid)

        wx.hideLoading()
        wx.showToast({ title: '登录成功', icon: 'success' })

        setTimeout(() => {
          wx.navigateBack()
        }, 800)
      })
      .catch((err) => {
        wx.hideLoading()
        // 用户拒绝隐私授权时提示，而非登录失败
        if (err && err.message === '用户不同意隐私政策') {
          wx.showToast({ title: '需同意隐私政策才能登录', icon: 'none' })
          return
        }
        wx.showToast({ title: '登录失败，请重试', icon: 'none' })
        console.error('登录失败:', err)
      })
  },

  /**
   * 跳过登录
   */
  onSkip() {
    wx.navigateBack()
  }
})
