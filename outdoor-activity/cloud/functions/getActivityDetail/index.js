const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const { activityId } = event

  if (!activityId) {
    return { code: -1, message: '缺少活动ID' }
  }

  try {
    // 获取活动详情
    const activityRes = await db.collection('activities').doc(activityId).get()
    const activity = activityRes.data

    // 获取报名用户列表
    const signupsRes = await db.collection('signups')
      .where({ activityId: activityId, status: 'confirmed' })
      .field({ userId: true, userName: true, userAvatar: true })
      .limit(50)
      .get()

    activity.participants = signupsRes.data

    return {
      code: 0,
      data: activity
    }
  } catch (err) {
    return { code: -1, message: '获取活动详情失败: ' + err.message }
  }
}
