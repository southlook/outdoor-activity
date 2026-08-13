/**
 * API 接口封装层
 * 封装所有与云函数交互的接口调用
 */

const { request } = require('./request')

/**
 * 获取活动列表
 */
function getActivities(params = {}) {
  return request({
    url: 'getActivities',
    data: {
      category: params.category || '',
      keyword: params.keyword || '',
      page: params.page || 1,
      pageSize: params.pageSize || 10
    }
  })
}

/**
 * 获取活动详情
 */
function getActivityDetail(activityId) {
  return request({
    url: 'getActivityDetail',
    data: { activityId }
  })
}

/**
 * 发布活动
 */
function publishActivity(data) {
  return request({
    url: 'publishActivity',
    data
  })
}

/**
 * 报名活动
 */
function signupActivity(data) {
  return request({
    url: 'signupActivity',
    data
  })
}

/**
 * 取消报名
 */
function cancelSignup(activityId) {
  return request({
    url: 'cancelSignup',
    data: { activityId }
  })
}

/**
 * 获取我发布的活动
 */
function getMyActivities(page = 1) {
  return request({
    url: 'getMyActivities',
    data: { page }
  })
}

/**
 * 获取我报名的活动
 */
function getMySignups(page = 1) {
  return request({
    url: 'getMySignups',
    data: { page }
  })
}

/**
 * 删除我发布的活动
 */
function deleteActivity(activityId) {
  return request({
    url: 'deleteActivity',
    data: { activityId }
  })
}

module.exports = {
  getActivities,
  getActivityDetail,
  publishActivity,
  signupActivity,
  cancelSignup,
  getMyActivities,
  getMySignups,
  deleteActivity
}
