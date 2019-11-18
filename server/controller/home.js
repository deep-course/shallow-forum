//未登录首页
const moment = require('moment');
const svgCaptcha = require('svg-captcha')
const util = require('../util');
const userService = require('../service/user_service');
const _3rdService = require('../service/3rd_service');


module.exports = {

    home: async function (ctx) {
        ctx.body = 'home'
    },



}
