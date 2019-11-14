//需要登陆后才可以使用
const util = require("../../util");
const logger=util.getLogger(__filename);
const _ = require("lodash");
const moment=require("moment");
const userService = require('../../service/user_service');
module.exports = {
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
 *     property : value
 * }
 * 
 * 
 */
    info:async function (ctx, next) {
        logger.debug("state:",ctx.state);
        let ret = {
        }
        const {user:currentuser,group}=ctx.state;
        if (currentuser)
        {
            const userindb=await userService.getUserById(currentuser.id);
            if (userindb)
            {
            ret.user=_.pick(currentuser, ["id", "username", "lock", "activate"]);
            ret.group=group;
            await userService.updateUserActionTime(currentuser.id,util.getClientIP(ctx.req));
            let token=util.getToken({
                id: currentuser.id,
                hash:util.md5(`${currentuser.id}|${currentuser.password}`)
            });
            logger.debug("user-info:",token);
            ctx.set("X-SetToken",token);
            }
        }

        ctx.body = util.retOk(ret);
    },
    refreshToken(ctx, next) {

    },
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
    login: async function (ctx) {
        const { username, password } = ctx.request.body;
        const user = await userService.getUserByName(username);
        if (user && util.sha256(password) == user.password) {
            let ret = util.getToken({
                id: user.id,
                hash: util.md5(`${user.id}|${user.password}`)
            });
            ctx.body = util.retOk({
                token: ret,
            });
            //更新用户登录状态
            await userService.updateUserLoginTime(user.id,util.getClientIP(ctx));

        }
        else {
            ctx.body = util.retError(1000, "用户名或密码不正确");
        }
    },
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
    register: async function (ctx) {
        const { token, phone, username, password } = ctx.request.body;
        //ctx.body=ctx.request.body;

        if (!util.checkPhone(phone)) {
            ctx.body = util.retError(-1, "手机格式不正确");
            return;
        }
        if (!util.checkUsername(username) || username.length > 8) {
            ctx.body = util.retError(-2, "用户名只能包含数字，字母和中文，长度不能超过8个");
            return; phone
        }
        const tokenindb = await userService.getTokenByPhone(phone);

        if (!tokenindb) {
            ctx.body = util.retError(-30, "验证码不匹配");
            return;
        }
        if (tokenindb.token != token) {
            ctx.body = util.retError(-31, "验证码不匹配");
            return;
        }

        const phoneindb = await userService.getUserByPhone(phone);
        if (phoneindb) {
            ctx.body = util.retError(-4, "手机号已存在");
            return;
        }
        const usernameindb = await userService.getUserByName(username);
        if (usernameindb) {
            ctx.body = util.retError(-5, "用户名已存在");
            return;
        }
        const iid = await userService.insertUser(phone, username, password,util.getClientIP(ctx.req))
        if (iid) {
            ctx.body = util.retOk({ id: iid });

        }
        else {
            ctx.body = util.retError(-10, "用户注册错误")
        }




    },
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
    captcha: async function (ctx) {
        const captcha = svgCaptcha.create({
            size: 5,
            noise: 0,
            charPreset: '0123456789',
            color: true,
            background: '#f0f0f0',
            fontSize: 30,
            width: 100,
            height: 40
        });
        ctx.session.captcha = captcha.text
        ctx.response.type = 'image/svg+xml';
        ctx.body = captcha.data;
    },
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
    smscode: async function (ctx) {
        const { captcha: captchaInput, phone } = ctx.request.body;
        const { captcha: captchaSession } = ctx.session;
        if (!util.checkPhone(phone)) {
            ctx.body = util.retError(-1, "手机格式不正确");
            return;

        }
        //清除session信息
        delete ctx.session.captcha
        if (captchaSession && captchaInput == captchaSession) {
            //查找用户是否已经注册
            const user = await userService.getUserByPhone(phone);
            if (user) {
                ctx.body = util.retError(1, "用户手机已存在");
                return;
            }
            //查找token中是否未失效，未失效不生成验证码直接使用
            const captchacode = await userService.getTokenByPhone(phone);
            const token = captchacode ? captchacode.token : await userService.genSmsToken(phone)

            if (token) {
                //发送
                await _3rdService.sendSms(token, phone);
                ctx.body = util.retOk({});
            }
            else {
                ctx.body = util.retError(2, "生成短信验证码错误");
            }

            
        }
        else {
            ctx.body = util.retError(-2, "验证码错误");
        }


    },
    logout: async function (ctx) {

    },
    resetPassword: async function (ctx) {

    },
}
