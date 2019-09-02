//未登录首页
const moment = require('moment');
const util = require('../util');
const userService = require('../service/user_service');



module.exports = {
    /**
 * 
 * @api {get} /home  获取论坛首页的帖子列表
 * @apiSampleRequest /api/home
 * @apiName home
 * @apiGroup home
 * @apiVersion  1.0.0
 * 
 * 
 * @apiSuccess (200) {type} name description
 * 
 * @apiParamExample  {type} Request-Example:
 * {
 *     property : value
 * }
 * 
 * 
 * @apiSuccessExample {type} Success-Response:
 * {
 *     property : value
 * }
 * 
 * 
 */
    home: async function (ctx) {
        ctx.body = 'home'
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
     * 
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
            await userService.updateUserLoginTime(user.id);

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
     * 
     * 
     * @apiParam  {String} paramName description
     * 
     * @apiSuccess (200) {type} name description
     * 
     * @apiParamExample  {type} Request-Example:
     * {
     *     property : value
     * }
     * 
     * 
     * @apiSuccessExample {type} Success-Response:
     * {
     *     property : value
     * }
     * 
     * 
     */
    register: async function (ctx) {
        ctx.body = ctx.request.body;
        //console.log(ctx.query)
    },
    logout: async function (ctx) {

    },
    resetPassword: async function (ctx) {

    },


}
