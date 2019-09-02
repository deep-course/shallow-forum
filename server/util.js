const crypto = require('crypto');
const log4js = require('log4js');
const jwt = require('jsonwebtoken');
const uuidv1 = require('uuid/v1');
const url = require('url');
const { setting, env } = require('./config');
const logger=log4js.getLogger("util");
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
    getLogger: function(name){
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
    }


}