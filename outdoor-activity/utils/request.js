/**
 * 网络请求封装
 */

const BASE_URL = '' // 云开发环境下不需要

/**
 * 通用请求方法
 */
function request(options) {
  return new Promise((resolve, reject) => {
    const { url, method = 'GET', data = {}, header = {} } = options

    wx.showLoading({ title: '加载中...', mask: true })

    wx.cloud.callFunction({
      name: url,
      data: data,
      success(res) {
        wx.hideLoading()
        if (res.result && res.result.code === 0) {
          resolve(res.result)
        } else {
          const errMsg = (res.result && res.result.message) || '请求失败'
          wx.showToast({ title: errMsg, icon: 'none' })
          reject(res.result || { code: -1, message: errMsg })
        }
      },
      fail(err) {
        wx.hideLoading()
        wx.showToast({ title: '网络异常，请重试', icon: 'none' })
        reject(err)
      }
    })
  })
}

/**
 * 上传文件到云存储
 */
function uploadFile(filePath, cloudPath) {
  return new Promise((resolve, reject) => {
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: filePath,
      success(res) {
        resolve(res.fileID)
      },
      fail(err) {
        wx.showToast({ title: '上传失败', icon: 'none' })
        reject(err)
      }
    })
  })
}

/**
 * 批量将云存储 fileID 转换为临时 https 链接
 * 非 cloud:// 开头的地址原样保留；转换失败时返回空映射，调用方回退原地址
 * @param {string[]} fileList 文件ID/URL 混合数组
 * @returns {Promise<Object>} fileID -> tempFileURL 映射
 */
function resolveCloudFiles(fileList) {
  const cloudIDs = (fileList || []).filter((f) => f && f.indexOf('cloud://') === 0)
  if (cloudIDs.length === 0) return Promise.resolve({})

  return new Promise((resolve) => {
    wx.cloud.getTempFileURL({
      fileList: cloudIDs,
      success(res) {
        const map = {}
          ; (res.fileList || []).forEach((item) => {
            if (item.tempFileURL) map[item.fileID] = item.tempFileURL
          })
        resolve(map)
      },
      fail() {
        resolve({})
      }
    })
  })
}

module.exports = {
  request,
  uploadFile,
  resolveCloudFiles
}
