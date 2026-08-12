const { formatTime, getActivityStatus } = require('../../utils/util')
const { resolveCloudFiles } = require('../../utils/request')

const CATEGORY_MAP = {
  hiking: '徒步',
  camping: '露营',
  cycling: '骑行',
  climbing: '登山',
  rafting: '溯溪',
  skiing: '滑雪'
}

const DEFAULT_COVER = '/images/placeholders/default-avatar.png'

Component({
  properties: {
    activity: {
      type: Object,
      value: {}
    },
    // 是否显示删除按钮（仅“我发布的活动”页开启）
    showDelete: {
      type: Boolean,
      value: false
    }
  },

  observers: {
    'activity': function (activity) {
      if (!activity || !activity._id) return
      const statusInfo = getActivityStatus(activity)
      const categoryName = CATEGORY_MAP[activity.category] || '其他'
      const timeText = formatTime(activity.startTime, 'MM-DD') + ' ~ ' + formatTime(activity.endTime, 'MM-DD')
      this.setData({
        statusInfo,
        categoryName,
        timeText,
        coverSrc: activity.coverImage || DEFAULT_COVER
      })

      // 云存储 fileID 先转临时 https 链接再渲染，避免封面空白
      if (activity.coverImage && activity.coverImage.indexOf('cloud://') === 0) {
        resolveCloudFiles([activity.coverImage]).then((map) => {
          const url = map[activity.coverImage]
          // 防止异步返回时卡片已复用为其他活动
          if (url && this.data.activity && this.data.activity._id === activity._id) {
            this.setData({ coverSrc: url })
          }
        })
      }
    }
  },

  data: {
    statusInfo: { text: '报名中', type: 'green' },
    categoryName: '',
    timeText: '',
    coverSrc: ''
  },

  methods: {
    onTap() {
      const id = this.properties.activity._id
      wx.navigateTo({
        url: `/pages/detail/detail?id=${id}`
      })
    },

    /**
     * 封面加载失败时回退占位图
     */
    onCoverError() {
      this.setData({ coverSrc: DEFAULT_COVER })
    },

    /**
     * 删除活动，阻止冒泡到卡片点击
     */
    onDelete() {
      this.triggerEvent('delete', { id: this.properties.activity._id })
    }
  }
})
