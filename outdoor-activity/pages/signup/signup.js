const { isValidPhone } = require('../../utils/util')
const { resolveCloudFiles } = require('../../utils/request')
const api = require('../../utils/api')

Page({
  data: {
    activityId: '',
    activityTitle: '',
    fee: 0,
    maxCount: 5,
    agreed: false,
    submitting: false,
    totalFee: 0,
    groupQrCodeUrl: '',
    showGroupModal: false,
    form: {
      name: '',
      phone: '',
      count: 1,
      emergencyContact: '',
      emergencyPhone: '',
      remark: ''
    }
  },

  onLoad(options) {
    const fee = Number(options.fee) || 0
    this.setData({
      activityId: options.id,
      activityTitle: decodeURIComponent(options.title || ''),
      fee: fee,
      totalFee: fee
    })

    // 拉取活动详情以获取群二维码，fileID 需转临时 https 链接以便渲染
    if (options.id) {
      api.getActivityDetail(options.id)
        .then((res) => {
          const qrFileId = (res.data && res.data.groupQrCode) || ''
          if (!qrFileId) return
          resolveCloudFiles([qrFileId]).then((map) => {
            const url = map[qrFileId] || qrFileId
            this.setData({ groupQrCodeUrl: url })
          })
        })
        .catch(() => { })
    }
  },

  /**
   * 表单输入
   */
  onInput(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    const form = { ...this.data.form, [field]: value }
    const totalFee = form.count * this.data.fee
    this.setData({ form, totalFee })
  },

  /**
   * 人数增加
   */
  onIncrease() {
    if (this.data.form.count >= this.data.maxCount) return
    const count = this.data.form.count + 1
    const form = { ...this.data.form, count }
    this.setData({
      form,
      totalFee: count * this.data.fee
    })
  },

  /**
   * 人数减少
   */
  onDecrease() {
    if (this.data.form.count <= 1) return
    const count = this.data.form.count - 1
    const form = { ...this.data.form, count }
    this.setData({
      form,
      totalFee: count * this.data.fee
    })
  },

  /**
   * 切换同意状态
   */
  toggleAgree() {
    this.setData({ agreed: !this.data.agreed })
  },

  /**
   * 表单校验
   */
  validateForm() {
    const { form } = this.data
    if (!form.name.trim()) {
      wx.showToast({ title: '请输入报名人姓名', icon: 'none' })
      return false
    }
    if (!isValidPhone(form.phone)) {
      wx.showToast({ title: '请输入正确的手机号码', icon: 'none' })
      return false
    }
    if (!form.emergencyContact.trim()) {
      wx.showToast({ title: '请输入紧急联系人', icon: 'none' })
      return false
    }
    if (!isValidPhone(form.emergencyPhone)) {
      wx.showToast({ title: '请输入正确的紧急联系电话', icon: 'none' })
      return false
    }
    if (!this.data.agreed) {
      wx.showToast({ title: '请先同意报名须知', icon: 'none' })
      return false
    }
    return true
  },

  /**
   * 提交报名
   */
  onSubmit() {
    if (!this.validateForm()) return
    if (this.data.submitting) return

    this.setData({ submitting: true })

    const { form, activityId, activityTitle, totalFee } = this.data

    api.signupActivity({
      activityId: activityId,
      userName: form.name,
      phone: form.phone,
      emergencyContact: form.emergencyContact,
      emergencyPhone: form.emergencyPhone,
      participantCount: form.count
    }).then(() => {
      this.setData({ submitting: false })
      // 报名成功后弹出群二维码/提示，不再直接返回
      this.setData({ showGroupModal: true })
    }).catch((err) => {
      this.setData({ submitting: false })
      console.error('报名失败:', err)
    })
  },

  /**
   * 关闭报名成功弹层，返回上一页
   */
  onCloseGroupModal() {
    this.setData({ showGroupModal: false })
    wx.navigateBack()
  }
})
