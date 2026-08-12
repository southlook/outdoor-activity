const { CATEGORIES } = require('../../utils/mock')
const { checkLogin, isAdmin } = require('../../utils/auth')
const { ensurePrivacy } = require('../../utils/privacy')
const { formatTime } = require('../../utils/util')
const { uploadFile } = require('../../utils/request')
const api = require('../../utils/api')
const app = getApp()

Page({
  data: {
    categories: CATEGORIES.filter(c => c.id !== 'all'),
    today: formatTime(new Date(), 'YYYY-MM-DD'),
    publishing: false,
    imageList: [],
    groupQrCode: '',
    form: {
      title: '',
      category: '',
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      locationName: '',
      locationAddress: '',
      latitude: 0,
      longitude: 0,
      fee: '',
      maxParticipants: '',
      feeDescription: '',
      description: '',
      itinerary: '',
      notices: ''
    }
  },

  onLoad() {
    // 双重拦截：未登录或未授权管理员角色均无法进入发布页
    if (!checkLogin()) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再发布活动',
        confirmText: '去登录',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({ url: '/pages/login/login' })
          }
        }
      })
      return
    }
    if (!isAdmin()) {
      wx.showModal({
        title: '提示',
        content: '发布功能仅对认证发布者开放',
        showCancel: false,
        success() {
          wx.navigateBack()
        }
      })
    }
  },

  /**
   * 通用表单输入
   */
  onInput(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({ [`form.${field}`]: value })
  },

  /**
   * 选择分类
   */
  onSelectCategory(e) {
    this.setData({ 'form.category': e.currentTarget.dataset.id })
  },

  /**
   * 日期时间选择
   */
  onStartDateChange(e) {
    this.setData({ 'form.startDate': e.detail.value })
  },
  onStartTimeChange(e) {
    this.setData({ 'form.startTime': e.detail.value })
  },
  onEndDateChange(e) {
    this.setData({ 'form.endDate': e.detail.value })
  },
  onEndTimeChange(e) {
    this.setData({ 'form.endTime': e.detail.value })
  },

  /**
   * 选择图片
   * 调用相册/相机属于隐私接口，需先取得用户对隐私政策的同意
   */
  onChooseImage() {
    const remain = 9 - this.data.imageList.length
    ensurePrivacy()
      .then(() => {
        wx.chooseMedia({
          count: remain,
          mediaType: ['image'],
          sourceType: ['album', 'camera'],
          success: (res) => {
            const newImages = res.tempFiles.map(f => f.tempFilePath)
            this.setData({
              imageList: [...this.data.imageList, ...newImages]
            })
          }
        })
      })
      .catch(() => {
        wx.showToast({ title: '需同意隐私政策才能选择图片', icon: 'none' })
      })
  },

  /**
   * 预览图片
   */
  previewImage(e) {
    const index = e.currentTarget.dataset.index
    wx.previewImage({
      current: this.data.imageList[index],
      urls: this.data.imageList
    })
  },

  /**
   * 删除图片
   */
  onDeleteImage(e) {
    const index = e.currentTarget.dataset.index
    const list = [...this.data.imageList]
    list.splice(index, 1)
    this.setData({ imageList: list })
  },

  /**
   * 选择活动群二维码图片（单张）
   */
  onChooseGroupQr() {
    ensurePrivacy()
      .then(() => {
        wx.chooseMedia({
          count: 1,
          mediaType: ['image'],
          sourceType: ['album', 'camera'],
          success: (res) => {
            const path = res.tempFiles[0].tempFilePath
            this.setData({ groupQrCode: path })
          }
        })
      })
      .catch(() => {
        wx.showToast({ title: '需同意隐私政策才能选择图片', icon: 'none' })
      })
  },

  /**
   * 删除群二维码
   */
  onDeleteGroupQr() {
    this.setData({ groupQrCode: '' })
  },

  /**
   * 预览群二维码
   */
  previewGroupQr() {
    if (!this.data.groupQrCode) return
    wx.previewImage({
      current: this.data.groupQrCode,
      urls: [this.data.groupQrCode]
    })
  },

  /**
   * 表单校验
   */
  validateForm() {
    const { form } = this.data
    if (!form.title.trim()) {
      wx.showToast({ title: '请输入活动标题', icon: 'none' }); return false
    }
    if (!form.category) {
      wx.showToast({ title: '请选择活动分类', icon: 'none' }); return false
    }
    if (!form.startDate) {
      wx.showToast({ title: '请选择出发日期', icon: 'none' }); return false
    }
    if (!form.endDate) {
      wx.showToast({ title: '请选择结束日期', icon: 'none' }); return false
    }
    if (new Date(form.endDate) < new Date(form.startDate)) {
      wx.showToast({ title: '结束日期不能早于出发日期', icon: 'none' }); return false
    }
    if (!form.locationName.trim()) {
      wx.showToast({ title: '请输入活动地点', icon: 'none' }); return false
    }
    if (!form.fee || Number(form.fee) < 0) {
      wx.showToast({ title: '请输入正确的费用', icon: 'none' }); return false
    }
    if (!form.maxParticipants || Number(form.maxParticipants) < 2) {
      wx.showToast({ title: '人数上限至少为2人', icon: 'none' }); return false
    }
    if (!form.description.trim()) {
      wx.showToast({ title: '请填写活动介绍', icon: 'none' }); return false
    }
    if (this.data.imageList.length === 0) {
      wx.showToast({ title: '请至少上传一张活动图片', icon: 'none' }); return false
    }
    return true
  },

  /**
   * 发布活动
   */
  onPublish() {
    if (!this.validateForm()) return
    if (this.data.publishing) return

    this.setData({ publishing: true })

    const { form, imageList } = this.data

    // 先上传图片到云存储，再发布活动
    const uploadPromises = imageList.map((filePath, index) => {
      const ext = filePath.split('.').pop()
      const cloudPath = `activities/${Date.now()}_${index}.${ext}`
      return uploadFile(filePath, cloudPath)
    })

    Promise.all(uploadPromises)
      .then((fileIDs) => {
        const coverImage = fileIDs[0] || ''
        const images = fileIDs.slice(1)

        // 上传群二维码（若已选择）
        let qrPromise = Promise.resolve('')
        if (this.data.groupQrCode) {
          const ext = this.data.groupQrCode.split('.').pop()
          const qrCloudPath = `activities/qrcode_${Date.now()}.${ext}`
          qrPromise = uploadFile(this.data.groupQrCode, qrCloudPath)
        }
        return qrPromise.then((groupQrCode) => ({
          coverImage,
          images,
          groupQrCode
        }))
      })
      .then(({ coverImage, images, groupQrCode }) => {
        return api.publishActivity({
          title: form.title,
          category: form.category,
          coverImage: coverImage,
          images: images,
          startTime: `${form.startDate}T${form.startTime || '08:00'}:00`,
          endTime: `${form.endDate}T${form.endTime || '18:00'}:00`,
          location: {
            name: form.locationName,
            address: form.locationAddress,
            latitude: form.latitude,
            longitude: form.longitude
          },
          fee: Number(form.fee),
          feeDescription: form.feeDescription,
          maxParticipants: Number(form.maxParticipants),
          description: form.description,
          itinerary: form.itinerary,
          notices: form.notices,
          groupQrCode: groupQrCode
        })
      })
      .then(() => {
        this.setData({ publishing: false })
        // 标记首页需要刷新，回到发现页时重新拉取列表
        app.globalData.needRefreshIndex = true
        wx.showModal({
          title: '发布成功',
          content: '你的活动已成功发布！',
          showCancel: false,
          success: () => {
            this.setData({
              form: {
                title: '', category: '', startDate: '', startTime: '',
                endDate: '', endTime: '', locationName: '', locationAddress: '',
                latitude: 0, longitude: 0, fee: '', maxParticipants: '',
                feeDescription: '', description: '', itinerary: '', notices: ''
              },
              imageList: [],
              groupQrCode: ''
            })
          }
        })
      })
      .catch((err) => {
        this.setData({ publishing: false })
        console.error('发布失败:', err)
      })
  }
})
