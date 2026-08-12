const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    // 查询用户是否已存在
    const userRes = await db.collection('users').where({ _id: openid }).get()

    if (userRes.data.length === 0) {
      // 新用户 - 创建用户记录，默认普通用户角色
      await db.collection('users').add({
        data: {
          _id: openid,
          nickName: event.nickName || '',
          avatarUrl: event.avatarUrl || '',
          phone: event.phone || '',
          role: 'user',
          createdAt: db.serverDate(),
          updatedAt: db.serverDate()
        }
      })
    } else if (event.nickName) {
      // 已有用户 - 更新信息
      await db.collection('users').doc(openid).update({
        data: {
          nickName: event.nickName,
          avatarUrl: event.avatarUrl || userRes.data[0].avatarUrl,
          updatedAt: db.serverDate()
        }
      })
    }

    // 统一返回角色信息，缺省视为普通用户
    const existingUser = userRes.data[0]
    const userInfo = existingUser
      ? { ...existingUser, role: existingUser.role || 'user' }
      : { nickName: event.nickName, avatarUrl: event.avatarUrl, role: 'user' }

    return {
      code: 0,
      message: '登录成功',
      openid: openid,
      userInfo
    }
  } catch (err) {
    return { code: -1, message: '登录失败: ' + err.message }
  }
}
