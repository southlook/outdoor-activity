# 野见山川 - 户外活动小程序

一款基于微信小程序的户外活动平台，用户可以发现、发布和报名各类户外活动。

## 功能特性

- **活动发现**：浏览附近及推荐的户外活动，支持分类筛选与分页加载
- **活动发布**：创建户外活动，设置时间、地点、人数、费用等信息
- **活动报名**：一键报名参与感兴趣的活动，支持取消报名
- **个人中心**：查看我发布的活动和我报名的活动
- **角色权限**：区分活动发布者与参与者，支持活动管理等操作
- **隐私合规**：集成微信官方隐私保护机制，符合平台合规要求

## 技术栈

- **前端**：微信小程序原生开发（WXML / WXSS / JS）
- **后端**：微信云开发（CloudBase）
- **云函数**：Node.js
- **基础库版本**：3.3.4

## 项目结构

```
outdoor-activity/
├── cloud/functions/        # 云函数
│   ├── login/              # 用户登录
│   ├── getActivities/      # 获取活动列表
│   ├── getActivityDetail/  # 获取活动详情
│   ├── publishActivity/    # 发布活动
│   ├── deleteActivity/     # 删除活动
│   ├── signupActivity/     # 报名活动
│   ├── cancelSignup/       # 取消报名
│   ├── getMyActivities/    # 我发布的活动
│   └── getMySignups/       # 我报名的活动
├── pages/                  # 页面
│   ├── index/              # 首页 - 活动列表
│   ├── detail/             # 活动详情
│   ├── publish/            # 发布活动
│   ├── signup/             # 报名页
│   ├── user-center/        # 个人中心
│   ├── my-activities/      # 我发布的活动
│   ├── my-signups/         # 我报名的活动
│   ├── login/              # 登录页
│   └── agreement/          # 用户协议
├── components/             # 公共组件
│   ├── activity-card/      # 活动卡片
│   ├── empty-state/        # 空状态提示
│   ├── load-more/          # 加载更多
│   └── privacy-popup/      # 隐私协议弹窗
├── utils/                  # 工具模块
│   ├── api.js              # 接口定义
│   ├── request.js          # 请求封装
│   ├── auth.js             # 登录鉴权
│   ├── privacy.js          # 隐私合规
│   └── mock.js             # Mock 数据
└── styles/                 # 公共样式
    ├── common.wxss
    └── variables.wxss
```

## 开发指南

### 环境准备

1. 安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 导入项目时选择 `outdoor-activity` 目录
3. 在 `project.config.json` 中替换为你自己的 AppID

### 云开发配置

1. 在微信开发者工具中开通云开发
2. 修改 `app.js` 中的云环境 ID：
   ```js
   wx.cloud.init({
     env: '你的云环境ID',
     traceUser: true
   })
   ```
3. 上传所有云函数

### 运行项目

在微信开发者工具中点击「编译」即可预览运行。
