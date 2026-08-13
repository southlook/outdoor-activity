const api = require('../../utils/api')

Page({
  data: {
    activityList: [],
    loading: true
  },

  onLoad() {
    this.loadData()
  },

  onShow() {
    this.loadData()
  },

  loadData() {
    this.setData({ loading: true })

    api.getMyActivities()
      .then((res) => {
        this.setData({
          activityList: res.data || [],
          loading: false
        })
      })
      .catch((err) => {
        console.error('加载失败:', err)
        this.setData({ loading: false })
      })
  },

  goPublish() {
    wx.navigateTo({ url: '/pages/publish/publish' })
  },

  /**
   * 删除活动：二次确认后调用云函数删除并刷新列表
   */
  onDeleteActivity(e) {
    const activityId = e.detail.id
    wx.showModal({
      title: '删除活动',
      content: '删除后该活动及报名记录将被清理，且不可恢复，确定删除吗？',
      confirmText: '删除',
      confirmColor: '#E74C3C',
      success: (res) => {
        if (!res.confirm) return
        api.deleteActivity(activityId)
          .then(() => {
            wx.showToast({ title: '已删除', icon: 'success' })
            this.loadData()
          })
          .catch((err) => {
            console.error('删除失败:', err)
          })
      }
    })
  }
})
