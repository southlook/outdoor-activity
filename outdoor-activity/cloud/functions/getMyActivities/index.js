const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { page = 1, pageSize = 10 } = event

  try {
    const skip = (page - 1) * pageSize

    const countRes = await db.collection('activities')
      .where({ publisherId: openid })
      .count()

    const result = await db.collection('activities')
      .where({ publisherId: openid })
      .orderBy('createdAt', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()

    return {
      code: 0,
      data: result.data,
      total: countRes.total,
      page,
      hasMore: skip + result.data.length < countRes.total
    }
  } catch (err) {
    return { code: -1, message: '获取失败: ' + err.message }
  }
}
