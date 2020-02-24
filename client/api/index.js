import http from '../utils/http'
import { getToken } from '@utils/cookie';
import getConfig from 'next/config'
//获取配置
const isServer=typeof window === "undefined"
const config=isServer?getConfig().serverRuntimeConfig:getConfig().publicRuntimeConfig
const {basePreixUrl}=config
/** user */

// 登录
export const login = params => http.post(basePreixUrl+'/api/login', params)

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
export const getUserInfo = (cookies={}) => http.get(basePreixUrl+'/api/user/info', {}, getToken(cookies))

// 获取用户详细信息
export const getUserInfoDetail = (cookies={}) => http.get(basePreixUrl+'/api/user/detail', {}, getToken(cookies))

// 更新用户信息
export const updateUserInfoDetail = (params,cookies={}) => http.post(basePreixUrl+'/api/user/updatedetail', params, getToken(cookies))

// 上传用户头像
export const uploadAvatar = basePreixUrl+'/api/user/uploadavatar'

// 更新密码
export const updatePassword = (params,cookies={}) => http.post(basePreixUrl+'/api/user/updatepassword', params, getToken(cookies))

/** home */

// 首页列表
//添加一个token参数
export const getHomeList = (filter,cookies={}) => {
    //console.log(cookies);
    return http.get(basePreixUrl+'/api/home', filter, getToken(cookies))
}

/** board */

// 显示图片列表
export const getImgList = (params, cookies={}) => http.get(basePreixUrl+'/api/board/showattachments', params, getToken(cookies))

// 获取论坛设置
export const getBoardSet = (cookies={}) => http.get(basePreixUrl+'/api/board/boardsetting',{},getToken(cookies))

// 上传图片附件
export const boardUploadImg =  basePreixUrl+'/api/board/uploadattachments'

// 删除图片附件
export const boardDeleteImg = (params,cookies={}) => http.post(basePreixUrl+'/api/board/removeattachments', params, getToken(cookies))

// 发帖子
export const publishNewPost = (params,cookies={}) => http.post(basePreixUrl+'/api/board/newpost', params, getToken(cookies))

//编辑帖子
export const editpost = (params,cookies={}) => http.post(basePreixUrl+'/api/board/editpost', params, getToken(cookies))

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
export const addNewComment = (params,cookies={}) => http.post(basePreixUrl+'/api/board/newcomment', params, getToken(cookies))

export const userHomeList= (params,cookies={}) => http.get(basePreixUrl+'/api/user/home',params, getToken(cookies))
export const userHomeInfo= (params,cookies={}) => http.get(basePreixUrl+'/api/user/homeinfo',params, getToken(cookies))