import http from '../utils/http'

/** [登录相关] */

// 登录
export const login = params => http.post('/api/login', params)

// 获取验证码
export const getCaptcha = '/api/captcha'

// 获取用户信息
export const getUserInfo = () => http.get('/api/user/info')

// 注册
export const register = params => http.post('/api/register', params)

// 发送手机验证码
export const sendSms = params => http.post('/api/sendsmscode', params)

