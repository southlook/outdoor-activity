const { CATEGORIES } = require('../../utils/mock')
const { debounce } = require('../../utils/util')
const api = require('../../utils/api')
const app = getApp()

Page({
  data: {
    categories: CATEGORIES,
    currentCategory: 'all',
    keyword: '',
    activityList: [],
    loading: false,
    page: 1,
    pageSize: 10,
    hasMore: true,
    loadMoreStatus: 'hidden' // loading | noMore | hidden
  },

  onLoad() {
    this.loadActivities(true)
  },

  /**
   * 发布成功后回到首页自动刷新列表
   */
  onShow() {
    if (app.globalData.needRefreshIndex) {
      app.globalData.needRefreshIndex = false
      this.loadActivities(true)
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadActivities(true).then(() => {
      wx.stopPullDownRefresh()
    })
  },

  /**
   * 上拉加载更多
   */
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadActivities(false)
    }
  },

  /**
   * 加载活动列表
   * @param {boolean} refresh 是否刷新（重置页码）
   */
  loadActivities(refresh) {
    if (this.data.loading) return Promise.resolve()

    const page = refresh ? 1 : this.data.page
    this.setData({
      loading: true,
      loadMoreStatus: 'loading'
    })

    return api.getActivities({
      category: this.data.currentCategory,
      keyword: this.data.keyword,
      page: page,
      pageSize: this.data.pageSize
    }).then((res) => {
      const pageData = res.data || []
      const hasMore = res.hasMore || false

      this.setData({
        activityList: refresh ? pageData : [...this.data.activityList, ...pageData],
        page: page + 1,
        hasMore,
        loading: false,
        loadMoreStatus: hasMore ? 'hidden' : 'noMore'
      })
    }).catch((err) => {
      console.error('加载活动失败:', err)
      this.setData({
        loading: false,
        loadMoreStatus: 'hidden'
      })
    })
  },

  /**
   * 分类切换
   */
  onCategoryTap(e) {
    const id = e.currentTarget.dataset.id
    if (id === this.data.currentCategory) return
    this.setData({ currentCategory: id })
    this.loadActivities(true)
  },

  /**
   * 搜索输入（防抖）
   */
  onSearchInput: debounce(function (e) {
    // 防抖内部不做搜索，只在 confirm 时搜索
  }, 300),

  /**
   * 输入框值变化
   */
  onSearchInputChange(e) {
    this.setData({ keyword: e.detail.value })
  },

  /**
   * 确认搜索
   */
  onSearch(e) {
    this.setData({ keyword: e.detail.value })
    this.loadActivities(true)
  },

  /**
   * 清除搜索
   */
  onClearSearch() {
    this.setData({ keyword: '' })
    this.loadActivities(true)
  },

  /**
   * 跳转到发布页（发布已不在 tabBar，改用 navigateTo）
   */
  goPublish() {
    wx.navigateTo({
      url: '/pages/publish/publish'
    })
  },

  onShareAppMessage() {
    return {
      title: '野见山川 - 发现精彩户外活动',
      path: '/pages/index/index'
    }
  }
})
