const { formatTime } = require('../../utils/util')
const api = require('../../utils/api')

Page({
  data: {
    signupList: [],
    loading: true
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    this.setData({ loading: true })

    api.getMySignups()
      .then((res) => {
        const list = (res.data || []).map(item => ({
          activityId: item.activityId,
          activityTitle: item.activity ? item.activity.title : '',
          name: item.userName,
          count: item.participantCount,
          totalFee: item.totalFee,
          signupTimeText: formatTime(item.createdAt, 'YYYY-MM-DD HH:mm')
        }))
        this.setData({
          signupList: list,
          loading: false
        })
      })
      .catch((err) => {
        console.error('加载失败:', err)
        this.setData({ loading: false })
      })
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  },

  goDiscover() {
    wx.switchTab({ url: '/pages/index/index' })
  }
})
