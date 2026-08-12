const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { activityId } = event

  if (!activityId) {
    return { code: -1, message: '缺少活动ID' }
  }

  try {
    // 查找报名记录
    const signupRes = await db.collection('signups')
      .where({ activityId, userId: openid, status: 'confirmed' })
      .get()

    if (signupRes.data.length === 0) {
      return { code: -1, message: '未找到报名记录' }
    }

    const signup = signupRes.data[0]

    // 取消报名
    await db.collection('signups').doc(signup._id).update({
      data: {
        status: 'cancelled',
        updatedAt: db.serverDate()
      }
    })

    // 减少活动报名人数
    await db.collection('activities').doc(activityId).update({
      data: {
        currentParticipants: _.inc(-signup.participantCount),
        updatedAt: db.serverDate()
      }
    })

    return {
      code: 0,
      message: '取消报名成功'
    }
  } catch (err) {
    return { code: -1, message: '取消报名失败: ' + err.message }
  }
}
