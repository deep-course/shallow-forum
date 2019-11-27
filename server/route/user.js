const router = require('koa-router')()
const userController = require("../controller/user");
const middleware = require('../middleware')
/**
 * 
 * @api {get} /user/info 获取用户信息
 * @apiSampleRequest /api/user/info
 * @apiName user/info
 * @apiGroup user
 * @apiVersion  1.0.0
 * @apiUse ReturnCode
 * @apiUse HeaderToken
 * 
 * 
 * 
 * 
 * @apiSuccessExample {json} Response:
 * {
 *     id : 用户id,
 *     username:用户名,
 *     lock:锁定状态,
 *     activate:激活状态
 *     
 * }
 * 
 * 
 */
router.get('/user/info', 
middleware.getUser,
userController.userInfo);
/**
 * 
 * @api {post} /register 用户注册
 * @apiSampleRequest /api/register
 * @apiName register
 * @apiGroup user
 * @apiVersion  1.0.0
 * @apiUse ReturnCode
 * @apiDescription 发送手机验证码，每次请求都会清空验证码的session
 * 
 * @apiParam  {String} phone 电话
 * @apiParam  {String} username 用户名
 * @apiParam  {String} password 密码
 * @apiParam  {String} token 密码
 * 
 * 
 */
router.post('/register', userController.register);
/**
     * 
     * @api {post} /login 用户登录
     * @apiSampleRequest /api/login
     * @apiName login
     * @apiGroup user
     * @apiVersion  1.0.0
     * 
     * 
     * @apiParam  {String} username 用户名
     * @apiParam  {String} password 密码
     * 
     * @apiParamExample  {string} Request
     *  usernamename：tant
     *  password：123456
     * 
     * @apiUse ReturnCode
     * @apiSuccessExample {json} Response
     {
        "err": 0,
        "msg": "ok",
        "data": {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaGFzaCI6IjkyYmUyNWQwNDBjOGE0YWRjN2FkM2Y1NWIwNjk4M2Y4IiwiaWF0IjoxNTU3MTI3ODg4fQ.TUwuPu9PFeRxMStLa8jedtuigWwGXzZxER2H1XCfb0k"
        }
    }
     * 
     * 
     */
router.post('/login', userController.login);
/**
 * 
 * @api {get} /captcha 获取验证码
 * @apiSampleRequest /api/captcha
 * @apiName captcha
 * @apiGroup user
 * @apiVersion  1.0.0
 * @apiDescription 返回验证码的svg图，session时效5分钟
 * 
 */
router.get('/captcha', userController.captcha);
/**
 * 
 * @api {post} /sendsmscode 发送手机验证码
 * @apiSampleRequest /api/sendsmscode
 * @apiName sendsmscode
 * @apiGroup user
 * @apiVersion  1.0.0
 * @apiUse ReturnCode
 * @apiDescription 发送手机验证码，每次请求都会清空验证码的session
 * 
 * @apiParam  {String} phone 电话
 * @apiParam  {String} captcha 验证码
 * 
 * 
 * 
 */
router.post('/sendsmscode', userController.smscode);
/**
 * 
 * @api {post} /resetpassword 找回密码
 * @apiSampleRequest /api/resetpassword
 * @apiName resetpassword
 * @apiGroup user
 * @apiVersion  1.0.0
 * @apiUse ReturnCode
 * @apiDescription 通过手机找回密码，会清空session
 * 
 * @apiParam  {String} phone 电话
 * @apiParam  {String} captcha 验证码
 * 
 * 
 * 
 */
router.post('/resetpassword', userController.resetPassword);
/**
 * 
 * @api {post} /resetpassword2 找回密码
 * @apiSampleRequest /api/resetpassword2
 * @apiName resetpassword2
 * @apiGroup user
 * @apiVersion  1.0.0
 * @apiUse ReturnCode
 * @apiDescription 提交token，修改密码
 *
 * @apiParam  {String} phone 手机号 
 * @apiParam  {String} token 短信验证码
 * @apiParam  {String} password 修改的密码
 * 
 * 
 * 
 */
router.post('/resetpassword2', userController.resetPassword2);
/**
 * 
 * @api {get} /user/detail 获取用户信息
 * @apiSampleRequest /api/user/detail
 * @apiName user/detail
 * @apiGroup user-todo
 * @apiVersion  1.0.0
 * @apiUse ReturnCode
 * @apiUse HeaderToken
 * @apiDescription 获取用户详细信息
 * 
 * 
 * 
 */
router.get('/user/detail', ret);
/**
 * 
 * @api {post} /user/updatepassword 更新密码
 * @apiSampleRequest /api/user/updatepassword
 * @apiName user/updatepassword
 * @apiGroup user
 * @apiVersion  1.0.0
 * @apiUse ReturnCode
 * @apiUse HeaderToken
 * @apiDescription 更新密码，更新完成密码要求用户重新登录
 * @apiParam  {String} oldpass 旧密码
 * @apiParam  {String} newpass 新密码
 * 
 * 
 * 
 */
router.post('/user/updatepassword', 
middleware.getUser,
middleware.checkUser,
userController.changePassword
);
/**
 * 
 * @api {post} /user/updatedetail 更新用户信息
 * @apiSampleRequest /api/user/updatedetail
 * @apiName user/updatedetail
 * @apiGroup user-todo
 * @apiVersion  1.0.0
 * @apiUse ReturnCode
 * @apiUse HeaderToken
 * @apiDescription 更新用户详细信息
 * 以KV的形式更新
 * 
 * 
 * 
 */
router.post('/user/updatedetail', ret);
/**
 * 
 * @api {get} /user/home 用户首页列表
 * @apiSampleRequest /api/user/home
 * @apiName user/home
 * @apiGroup user
 * @apiVersion  1.0.0
 * @apiUse ReturnCode
 * @apiDescription 用户首页的列表
 * 用户发帖，用户点赞
 * 
 * @apiParam  {String} userslug 用户的slug
 * @apiParam  {String} page 分页
 * @apiParam  {String} type post发帖，up点赞
 * 
 */
router.get('/user/home', userController.getHomeList);
/**
 * 
 * @api {get} /user/homeinfo 用户首页信息
 * @apiSampleRequest /api/user/homeinfo
 * @apiName user/homeinfo
 * @apiGroup user
 * @apiVersion  1.0.0
 * @apiUse ReturnCode
 * @apiDescription 用户首页的信息
 * 个人说明
 * 
 * 个人关注加入时间等
 * 
 * @apiParam  {String} userslug 用户的slug
 * @apiParam  {String} type info用户详细信息，activity用户活动数（点赞总数，发帖数，加入时间等）
 * 
 */
router.get('/user/homeinfo', userController.getHomeUser);

module.exports = router
function ret(ctx,next){
    ctx.body=
        {
            err: 0,
            msg: "ok"
        }
}