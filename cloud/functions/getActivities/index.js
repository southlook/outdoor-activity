const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event) => {
  const { category, keyword, page = 1, pageSize = 10 } = event

  try {
    let query = db.collection('activities')

    // 构建查询条件
    const conditions = []

    if (category && category !== 'all') {
      conditions.push({ category: category })
    }

    if (keyword) {
      conditions.push(_.or([
        { title: db.RegExp({ regexp: keyword, options: 'i' }) },
        { 'location.name': db.RegExp({ regexp: keyword, options: 'i' }) }
      ]))
    }

    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : _.and(conditions))
    }

    // 查询总数
    const countRes = await query.count()
    const total = countRes.total

    // 分页查询
    const skip = (page - 1) * pageSize
    const result = await query
      .orderBy('createdAt', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get()

    return {
      code: 0,
      data: result.data,
      total: total,
      page: page,
      hasMore: skip + result.data.length < total
    }
  } catch (err) {
    return { code: -1, message: '获取活动列表失败: ' + err.message }
  }
}
