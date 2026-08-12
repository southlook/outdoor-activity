const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  const {
    title, category, coverImage, images, startTime, endTime,
    location, fee, feeDescription, maxParticipants,
    description, itinerary, notices, groupQrCode
  } = event

  // 基础校验
  if (!title || !category || !startTime || !endTime || !location || !description) {
    return { code: -1, message: '请填写必要的活动信息' }
  }

  // 服务端权限校验：仅 admin 可发布
  let publisherName = '匿名用户'
  let publisherAvatar = ''
  let userRole = 'user'
  try {
    const userRes = await db.collection('users').doc(openid).get()
    publisherName = userRes.data.nickName || publisherName
    publisherAvatar = userRes.data.avatarUrl || publisherAvatar
    userRole = userRes.data.role || 'user'
  } catch (e) {
    // 用户信息获取失败使用默认值
  }
  if (userRole !== 'admin') {
    return { code: -1, message: '无发布权限' }
  }

  try {
    const result = await db.collection('activities').add({
      data: {
        title,
        category,
        coverImage: coverImage || '',
        images: images || [],
        startTime,
        endTime,
        location: location || {},
        fee: Number(fee) || 0,
        feeDescription: feeDescription || '',
        maxParticipants: Number(maxParticipants) || 30,
        currentParticipants: 0,
        description,
        itinerary: itinerary || '',
        notices: notices || '',
        groupQrCode: groupQrCode || '',
        status: 'open',
        publisherId: openid,
        publisherName,
        publisherAvatar,
        participants: [],
        createdAt: db.serverDate(),
        updatedAt: db.serverDate()
      }
    })

    return {
      code: 0,
      message: '发布成功',
      activityId: result._id
    }
  } catch (err) {
    return { code: -1, message: '发布失败: ' + err.message }
  }
}
