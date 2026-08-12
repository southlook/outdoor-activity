/**
 * 隐私授权弹窗组件
 * 当调用隐私接口且用户尚未同意《隐私政策》时展示，
 * 由用户自主阅读后选择同意或拒绝，不做默认同意。
 */
const app = getApp()
const { openPrivacyContract } = require('../../utils/privacy')

Component({
    data: {
        show: false
    },

    lifetimes: {
        attached() {
            // 监听 app 的隐私弹窗显示通知
            this.removePrivacyListener = app.addPrivacyListener((show) => {
                this.setData({ show })
            })
        },
        detached() {
            this.removePrivacyListener && this.removePrivacyListener()
        }
    },

    methods: {
        /**
         * 空方法，用于阻止弹窗下层页面滚动穿透
         */
        noop() { },

        /**
         * 查看《隐私政策》
         */
        onViewContract() {
            openPrivacyContract()
        },

        /**
         * 用户主动点击同意
         * 注意：按钮必须使用 open-type="agreePrivacyAuthorization"，
         * 微信才会记录用户的同意行为
         */
        onAgree() {
            app.handlePrivacyResult(true)
        },

        /**
         * 用户拒绝，关闭弹窗并中断对应业务流程
         */
        onDisagree() {
            app.handlePrivacyResult(false)
        }
    }
})
