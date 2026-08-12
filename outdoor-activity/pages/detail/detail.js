const api = require('../../utils/api')
const { formatTime, getActivityStatus } = require('../../utils/util')
const { resolveCloudFiles } = require('../../utils/request')
const { checkLogin } = require('../../utils/auth')

Page({
  data: {
    activity: null,
    allImages: [],
    statusInfo: { text: '报名中', type: 'green' },
    startTimeText: '',
    endTimeText: '',
    isFavorite: false,
    loading: true,
    isEntryPage: false
  },

  onLoad(options) {
    const id = options.id
    if (!id) {
      // 公众号文章跳转或外部链接无 id 时，兜底回首页
      wx.showToast({ title: '活动不存在', icon: 'none' })
      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' })
      }, 600)
      return
    }

    // 判断是否为公众号文章等外部渠道的直接落地页（无返回栈）
    const pages = getCurrentPages()
    this.setData({ isEntryPage: pages.length === 1 })

    this.loadDetail(id)
  },

  /**
   * 直接落地页时返回首页
   */
  goHome() {
    wx.switchTab({ url: '/pages/index/index' })
  },

  /**
   * 加载活动详情
   */
  loadDetail(id) {
    this.setData({ loading: true })

    api.getActivityDetail(id)
      .then((res) => {
        const activity = res.data
        const statusInfo = getActivityStatus(activity)
        const startTimeText = formatTime(activity.startTime, 'YYYY-MM-DD HH:mm')
        const endTimeText = formatTime(activity.endTime, 'YYYY-MM-DD HH:mm')

        // 合并封面和详情图
        const allImages = [activity.coverImage, ...(activity.images || [])]

        // 云存储 fileID 转临时 https 链接，保证轮播与预览可正常加载
        resolveCloudFiles(allImages).then((map) => {
          if (this.data.activity && this.data.activity._id === activity._id) {
            this.setData({
              allImages: allImages.map((url) => map[url] || url)
            })
          }
        })

        // 检查收藏状态
        const favorites = wx.getStorageSync('favorites') || []
        const isFavorite = favorites.includes(id)

        this.setData({
          activity,
          allImages,
          statusInfo,
          startTimeText,
          endTimeText,
          isFavorite,
          loading: false
        })
      })
      .catch((err) => {
        console.error('加载详情失败:', err)
        this.setData({ loading: false })
        wx.showToast({ title: '加载失败', icon: 'none' })
      })
  },

  /**
   * 预览图片
   */
  previewImage(e) {
    const url = e.currentTarget.dataset.url
    wx.previewImage({
      current: url,
      urls: this.data.allImages
    })
  },

  /**
   * 打开地图导航
   */
  openLocation() {
    const loc = this.data.activity.location
    wx.openLocation({
      latitude: loc.latitude,
      longitude: loc.longitude,
      name: loc.name,
      address: loc.address,
      scale: 15
    })
  },

  /**
   * 切换收藏状态
   */
  onToggleFavorite() {
    let favorites = wx.getStorageSync('favorites') || []
    const id = this.data.activity._id

    if (this.data.isFavorite) {
      favorites = favorites.filter(fid => fid !== id)
      wx.showToast({ title: '已取消收藏', icon: 'none' })
    } else {
      favorites.push(id)
      wx.showToast({ title: '已收藏', icon: 'success' })
    }

    wx.setStorageSync('favorites', favorites)
    this.setData({ isFavorite: !this.data.isFavorite })
  },

  /**
   * 立即报名
   */
  onSignup() {
    if (!checkLogin()) {
      wx.navigateTo({ url: '/pages/login/login' })
      return
    }

    const id = this.data.activity._id
    const fee = this.data.activity.fee
    const title = this.data.activity.title
    wx.navigateTo({
      url: `/pages/signup/signup?id=${id}&fee=${fee}&title=${encodeURIComponent(title)}`
    })
  },

  /**
   * 分享
   */
  onShare() {
    // 微信分享由 onShareAppMessage 处理
  },

  onShareAppMessage() {
    const activity = this.data.activity
    return {
      title: activity ? activity.title : '野见山川',
      path: `/pages/detail/detail?id=${activity ? activity._id : ''}`,
      imageUrl: activity ? activity.coverImage : ''
    }
  }
})
