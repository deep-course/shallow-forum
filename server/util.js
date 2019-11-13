/**
 * @apiDefine ReturnCode
 * @apiSuccess (成功) {Number} err 0表示成功
 * @apiSuccess (成功) {String} msg 成功永远返回ok
 * @apiSuccess (成功) {Object} data 服务器端返回结果
 * @apiError (失败) {Number} err err不为0表示失败
 * @apiError (失败) {String} msg 失败的错误信息 
 * @apiError (失败) {Object} data 没有data项

 */
const crypto = require('crypto');
const log4js = require('log4js');
const jwt = require('jsonwebtoken');
const uuidv1 = require('uuid/v1');
const url = require('url');
const { setting, env } = require('./config');
const logger = log4js.getLogger("util");
module.exports = {
    //hash相关
    hash: function (str, algorithm) {
        const alg = crypto.createHash(algorithm);
        return alg.update(str).digest('hex');
    },
    md5: function (str) {
        return this.hash(str, 'md5');
    },
    sha256: function (str) {
        return this.hash(str, 'sha256');
    },
    //返回格式统一
    retOk: function (data) {
        return {
            err: 0,
            msg: "ok",
            data: data,
        }
    },
    retError: function (err, msg) {
        return {
            err: err,
            msg: msg,
        }
    },
    //登陆认证的封装
    getToken: function (data) {
        logger.debug("getToken:", data)
        return jwt.sign(data, setting.token.secret);//{ expiresIn: '2h' }
    },
    verifyToken: function (str) {
        try {
            logger.debug("verifyToken:", str)
            if (str && str.length > 0) {
                return jwt.verify(str, setting.token.secret);
            }
            else {
                return null;
            }
        } catch (error) {
            logger.error("verifyToken:", error)
            return null;
        }

    },
    //生成uuid
    getUuid: function () {
        const uuid = uuidv1();
        //替换中划线 
        return uuid.replace(/-/g, "");
    },
    //日志
    getLogger: function (name) {
        const logger = log4js.getLogger(name);
        if (env == "production") {
            logger.level = log4js.levels.INFO;
        }
        else {
            logger.level = log4js.levels.ALL;
        }

        return logger;

    },
    //url
    parseUrl: function (str) {
        return url.parse(str);
    },
    //生成随机字符串
    randomString: function (length, chars = false) {
        let rString = '0123456789'
        if (chars) {
            rString = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
        }
        var result = '';
        for (var i = length; i > 0; --i)
            result += rString[Math.floor(Math.random() * rString.length)];
        return result;
    },
    //验证手机号
    checkPhone: function (phone) {
        if ((/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))) {
            return true;
        }
        else {
            return false;
        }
    },
    //判断用户名,只能包含数字，字母和中文字
    checkUsername: function (username) {
        if (/[a-zA-Z0-9\u4e00-\u9fa5]+/.test(username)) {
            return true;
        } else {
            return false;
        }

    },




}