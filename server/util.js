const crypto = require('crypto');
const log4js = require('log4js');
const jwt = require('jsonwebtoken');
const uuidv1 = require('uuid/v1');
const url = require('url');
const { setting, env } = require('./config');
const logger = log4js.getLogger("util");
const fs = require('fs');
const rootPath = process.cwd();
const util = module.exports = {
    //hash相关
    hash(str, algorithm) {
        const alg = crypto.createHash(algorithm);
        return alg.update(str).digest('hex');
    },
    md5(str) {
        return this.hash(str, 'md5');
    },
    sha256(str) {
        return this.hash(str, 'sha256');
    },
    //返回格式统一
    retOk(data) {
        return {
            err: 0,
            msg: "ok",
            data: data,
        }
    },
    retError(err, msg) {
        return {
            err: err,
            msg: msg,
        }
    },
    //登陆认证的封装
    getToken(data) {
        logger.debug("getToken:", data)
        return jwt.sign(data, setting.token.secret);//{ expiresIn: '2h' }
    },
    verifyToken(str) {
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
    getUuid() {
        const uuid = uuidv1();
        //替换中划线 
        return uuid.replace(/-/g, "");
    },
    //日志
    getLogger(name) {
        name = name.replace(rootPath, "");
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
    parseUrl(str) {
        return url.parse(str);
    },
    //生成随机字符串
    randomString(length, chars = false) {
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
    checkPhone(phone) {
        if ((/^1(3|4|5|6|7|8|9)\d{9}$/.test(phone))) {
            return true;
        }
        else {
            return false;
        }
    },
    //判断用户名,只能包含数字，字母和中文字
    checkUsername(username) {
        if (/[a-zA-Z0-9\u4e00-\u9fa5]+/.test(username)) {
            return true;
        } else {
            return false;
        }

    },
    //获取客户端IP
    //ctx.req
    getClientIP(req) {
        return req.headers['x-sf-ip'] || // 反向代理传递的数据头
            req.connection.remoteAddress || // 判断 connection 的远程 IP
            req.socket.remoteAddress || // 判断后端的 socket 的 IP
            req.connection.socket.remoteAddress;
    },
    //获取文件的md5
    getFileMd5(filepath){
        const  buffer = fs.readFileSync(filepath);
        return this.hash(buffer,"md5");
    },
    getUserAvatar(id){
        return util.md5("avatar-"+id)+".png";

    }

}