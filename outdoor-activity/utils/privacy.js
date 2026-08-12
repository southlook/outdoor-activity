/**
 * 隐私授权模块
 * 基于微信官方隐私保护机制（__usePrivacyCheck__），
 * 在调用隐私相关接口前，确保用户已主动同意《隐私政策》。
 */

const app = getApp()

/**
 * 确保用户已同意隐私政策
 * - 已同意：直接 resolve
 * - 未同意：由 app.js 触发 privacy-popup 弹窗，用户点击同意后 resolve，拒绝则 reject
 * @returns {Promise} 同意时 resolve，拒绝时 reject
 */
function ensurePrivacy() {
    return new Promise((resolve, reject) => {
        // 基础库版本过低不支持隐私机制时直接放行
        if (!wx.requirePrivacyAuthorize) {
            resolve()
            return
        }

        wx.requirePrivacyAuthorize({
            success() {
                // 用户此前已同意过隐私政策
                resolve()
            },
            fail() {
                // 需要弹窗征得用户同意，结果由 app.handlePrivacyResult 分发
                app.addPrivacyCallback({ resolve, reject })
            }
        })
    })
}

/**
 * 查看隐私政策：优先打开微信官方隐私协议页，失败时降级到本地协议页
 */
function openPrivacyContract() {
    wx.openPrivacyContract({
        fail() {
            wx.navigateTo({ url: '/pages/agreement/agreement?type=privacy' })
        }
    })
}

module.exports = {
    ensurePrivacy,
    openPrivacyContract
}
