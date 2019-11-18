const router = require('koa-router')()
const userController=require("../controller/user");
const middleware = require('../middleware')
/**
 * 
 * @api {get} /user/info 获取用户信息
 * @apiSampleRequest /api/user/info
 * @apiHeader (Response Headers) {String} token 认证的token
 * @apiName user/info
 * @apiGroup user
 * @apiVersion  1.0.0
 * 
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
router.get('/user/info',middleware.user,userController.info);
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
router.post('/login',userController.login);
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
router.get('/captcha',userController.captcha);
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
router.post('/sendsmscode',userController.smscode);
module.exports=router