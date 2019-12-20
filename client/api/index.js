import http from '../utils/http'
const basePreixUrl = ''

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
export const getHomeList = (filter) => http.get('/api/home', filter, getToken())

/** board */

// 获取论坛设置
export const getBoardSet = () => http.get('/api/board/boardsetting')

// 上传图片附件
export const boardUploadImg = basePreixUrl + '/api/board/uploadattachments'

// 删除图片附件
export const boardDeleteImg = params => http.post('/api/board/removeattachments', params, getToken())

// 发帖子
export const publishNewPost = params => http.post('/api/board/newpost', params, getToken())

// 帖子详情
export const getBoardDetail = params => http.get('/api/board/getpost', params, getToken())

// 帖子列表
export const getPostList = params => http.get('/api/board/postlist', params, getToken())

//回复列表
export const getCommentlist = params => http.get('/api/board/commentlist', params, getToken())

//新建回复
export const addNewComment = params => http.post('/api/board/newcomment', params, getToken())
