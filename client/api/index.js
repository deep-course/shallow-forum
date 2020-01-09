import http from '../utils/http'
import { getToken } from '@utils/cookie';
const basePreixUrl = 'http://localhost:3000'

/** user */

// 登录
export const login = params => http.post(basePreixUrl+'/api/login', params, getToken())

// 获取验证码
export const getCaptcha =  basePreixUrl+'/api/captcha'

// 注册
export const register = params => http.post(basePreixUrl+'/api/register', params)

// 注册发送手机验证码
export const sendSms = params => http.post(basePreixUrl+'/api/sendsmscode', params)

// 忘记密码发送手机验证码
export const resetSendSms = params => http.post(basePreixUrl+'/api/resetpassword', params)

// 重置密码
export const resetPassword = params => http.post(basePreixUrl+'/api/resetpassword2', params)

// 获取用户信息
export const getUserInfo = () => http.get(basePreixUrl+'/api/user/info', {}, getToken())

// 获取用户详细信息
export const getUserInfoDetail = () => http.get(basePreixUrl+'/api/user/detail', {}, getToken())

// 更新用户信息
export const updateUserInfoDetail = params => http.post(basePreixUrl+'/api/user/updatedetail', params, getToken())

// 上传用户头像
export const uploadAvatar = basePreixUrl+'/api/user/uploadavatar'

// 更新密码
export const updatePassword = params => http.post(basePreixUrl+'/api/user/updatepassword', params, getToken())

/** home */

// 首页列表
//添加一个token参数
export const getHomeList = (filter,cookies={}) => {
    //console.log(cookies);
    return http.get(basePreixUrl+'/api/home', filter, getToken(cookies))
  
}

/** board */

// 获取论坛设置
export const getBoardSet = () => http.get(basePreixUrl+'/api/board/boardsetting')

// 上传图片附件
export const boardUploadImg =  basePreixUrl+'/api/board/uploadattachments'

// 删除图片附件
export const boardDeleteImg = params => http.post(basePreixUrl+'/api/board/removeattachments', params, getToken())

// 发帖子
export const publishNewPost = params => http.post(basePreixUrl+'/api/board/newpost', params, getToken())

// 帖子详情
export const getPostDetail = (params,cookies={}) => 
{
    return http.get(basePreixUrl+'/api/board/getpost', params, getToken(cookies))
}

// 帖子列表
export const getPostList = (params,cookies={}) => 
{
 
    return http.get(basePreixUrl+'/api/board/postlist', params, getToken(cookies))
}

//回复列表
export const getCommentlist = (params,cookies={}) => http.get(basePreixUrl+'/api/board/commentlist', params, getToken(cookies))

//新建回复
export const addNewComment = params => http.post(basePreixUrl+'/api/board/newcomment', params, getToken())

export const userHomeList= params => http.get(basePreixUrl+'/api/user/home',params)
export const userHomeInfo= parms => http.get(basePreixUrl+'/api/user/homeinfo',parms)