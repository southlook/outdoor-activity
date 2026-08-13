const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event) => {
    const wxContext = cloud.getWXContext()
    const openid = wxContext.OPENID
    const { activityId } = event

    if (!activityId) {
        return { code: -1, message: '缺少活动ID' }
    }

    try {
        // 查询活动，校验是否为发布者本人
        const activityRes = await db.collection('activities').doc(activityId).get()
        const activity = activityRes.data
        if (!activity) {
            return { code: -1, message: '活动不存在' }
        }
        if (activity.publisherId !== openid) {
            return { code: -1, message: '无权删除该活动' }
        }

        // 删除活动记录
        await db.collection('activities').doc(activityId).remove()

        // 级联清理该活动的报名记录（云函数内 remove 需逐条删除）
        let removedSignups = 0
        let batch
        do {
            const res = await db.collection('signups')
                .where({ activityId })
                .limit(100)
                .get()
            batch = res.data
            for (const signup of batch) {
                await db.collection('signups').doc(signup._id).remove()
                removedSignups++
            }
        } while (batch.length === 100)

        // 清理云存储中的活动图片
        const fileIDs = [activity.coverImage, ...(activity.images || [])]
            .filter((id) => id && id.indexOf('cloud://') === 0)
        if (fileIDs.length > 0) {
            try {
                await cloud.deleteFile({ fileList: fileIDs })
            } catch (e) {
                // 文件删除失败不影响活动删除结果
            }
        }

        return { code: 0, message: '删除成功', removedSignups }
    } catch (err) {
        return { code: -1, message: '删除失败: ' + err.message }
    }
}
