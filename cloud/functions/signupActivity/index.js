const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { activityId, userName, phone, emergencyContact, emergencyPhone, participantCount } = event

  if (!activityId || !userName || !phone) {
    return { code: -1, message: '请填写必要的报名信息' }
  }

  try {
    // 获取活动信息
    const activityRes = await db.collection('activities').doc(activityId).get()
    const activity = activityRes.data

    // 检查活动状态
    if (activity.status !== 'open') {
      return { code: -1, message: '该活动已关闭报名' }
    }

    // 检查人数
    const count = Number(participantCount) || 1
    if (activity.currentParticipants + count > activity.maxParticipants) {
      return { code: -1, message: '报名人数已满' }
    }

    // 检查是否已报名
    const existingSignup = await db.collection('signups')
      .where({ activityId, userId: openid, status: 'confirmed' })
      .get()

    if (existingSignup.data.length > 0) {
      return { code: -1, message: '您已报名过该活动' }
    }

    // 获取用户头像
    let userAvatar = ''
    try {
      const userRes = await db.collection('users').doc(openid).get()
      userAvatar = userRes.data.avatarUrl || ''
    } catch (e) {}

    // 创建报名记录
    await db.collection('signups').add({
      data: {
        activityId,
        userId: openid,
        userName,
        userAvatar,
        phone,
        emergencyContact: emergencyContact || '',
        emergencyPhone: emergencyPhone || '',
        participantCount: count,
        totalFee: (activity.fee || 0) * count,
        status: 'confirmed',
        createdAt: db.serverDate()
      }
    })

    // 更新活动报名人数
    await db.collection('activities').doc(activityId).update({
      data: {
        currentParticipants: _.inc(count),
        updatedAt: db.serverDate()
      }
    })

    return {
      code: 0,
      message: '报名成功'
    }
  } catch (err) {
    return { code: -1, message: '报名失败: ' + err.message }
  }
}
