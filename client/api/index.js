import http from '../utils/http'
const basePreixUrl = 'http://103.61.38.127'

function getToken () {
  try {
    return {
      token: localStorage['token'] || '' 
    }
  } catch (e) {
    return {
      token: ''
    }
  }
}

/** user */

// 登录
export const login = params => http.post('/api/login', params, getToken())

// 获取验证码
export const getCaptcha = basePreixUrl + '/api/captcha'

// 注册
export const register = params => http.post('/api/register', params)

// 注册发送手机验证码
export const sendSms = params => http.post('/api/sendsmscode', params)

// 忘记密码发送手机验证码
export const resetSendSms = params => http.post('/api/resetpassword', params)

// 重置密码
export const resetPassword = params => http.post('/api/resetpassword2', params)

// 获取用户信息
export const getUserInfo = () => http.get('/api/user/info', {}, getToken())

// 获取用户详细信息
export const getUserInfoDetail = () => http.get('/api/user/detail', {}, getToken())

// 更新用户信息
export const updateUserInfoDetail = params => http.post('/api/user/updatedetail', params, getToken())

// 上传用户头像
export const uploadAvatar = basePreixUrl + '/api/user/uploadavatar'

// 更新密码
export const updatePassword = params => http.post('/api/user/updatepassword', params, getToken())

/** home */

// 首页列表
export const getHomeList = () => http.get('/api/home', {}, getToken())

/** board */
export const getBoardSet = () => http.get('/api/board/boardsetting')