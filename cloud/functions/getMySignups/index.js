const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { page = 1, pageSize = 10 } = event

  try {
    const skip = (page - 1) * pageSize

    // 获取报名记录
    const signupsRes = await db.collection('signups')
      .where({ userId: openid, status: 'confirmed' })
      .orderBy('createdAt', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()

    // 批量获取关联的活动信息
    const activityIds = [...new Set(signupsRes.data.map(s => s.activityId))]
    let activitiesMap = {}

    if (activityIds.length > 0) {
      // 云数据库批量查询限制20条，分批获取
      const batchSize = 20
      for (let i = 0; i < activityIds.length; i += batchSize) {
        const batch = activityIds.slice(i, i + batchSize)
        const actRes = await db.collection('activities')
          .where({ _id: db.command.in(batch) })
          .get()
        actRes.data.forEach(a => { activitiesMap[a._id] = a })
      }
    }

    // 合并数据
    const list = signupsRes.data.map(signup => ({
      ...signup,
      activity: activitiesMap[signup.activityId] || null
    }))

    const countRes = await db.collection('signups')
      .where({ userId: openid, status: 'confirmed' })
      .count()

    return {
      code: 0,
      data: list,
      total: countRes.total,
      page,
      hasMore: skip + list.length < countRes.total
    }
  } catch (err) {
    return { code: -1, message: '获取失败: ' + err.message }
  }
}
