//未登录首页
const moment = require('moment');
const svgCaptcha = require('svg-captcha')
const util = require('../util');
const userService = require('../service/user_service');
const _3rdService = require('../service/3rd_service');


module.exports = {
    /**
 * 
 * @api {get} /home  获取论坛首页的帖子列表
 * @apiSampleRequest /api/home
 * @apiName home
 * @apiGroup home
 * @apiVersion  1.0.0
 * @apiDescription 
 * 获取首页帖子列表
 * 这是第二列
 * 
 * @apiUse ReturnCode
 */
    home: async function (ctx) {
        ctx.body = 'home'
    },



}
