const util = require("../../util");
const logger = util.getLogger(__filename);
const _ = require("lodash");
const moment = require("moment");
const userService = require('../../service/user_service');
const boardService = require('../../service/board_service');
const _3rdService=require('../../service/3rd_service');
const svgCaptcha = require('svg-captcha');

async function login(ctx) {
    const { username, password } = ctx.request.body;
    const user = await userService.getUserByName(username);
    if (user && util.sha256(password) == user.password) {
        const hash = util.md5(`${user.id}|${user.password}`);
        let ret = util.getToken({
            id: user.id,
            hash: hash
        });
        logger.debug("hash:", hash);
        if (user['lock'] == 1) {
            ctx.body = util.retError(-1, "用户已锁定")
            return;
        }
        ctx.body = util.retOk({
            token: ret,
        });
        //更新用户登录状态
        await userService.updateUserLoginTime(user.id, util.getClientIP(ctx.req));

    }
    else {
        ctx.body = util.retError(1000, "用户名或密码不正确");
    }
}

async function register(ctx) {
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
    const tokenindb = await userService.getTokenByPhone(phone, "sms");

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
    const iid = await userService.insertUser(phone, username, password, util.getClientIP(ctx.req))
    if (iid) {
        ctx.body = util.retOk({ id: iid });

    }
    else {
        ctx.body = util.retError(-10, "用户注册错误")
    }




}

async function captcha(ctx) {
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
}

async function smscode(ctx) {
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
        const token = captchacode ? captchacode.token : await userService.genSmsToken(phone, 'sms');

        if (token) {
            //发送
            const text = `您正在注册验证，验证码 ${token}，请在30分钟提交，切勿将验证码泄露于他人。`;
            const sendresult = await _3rdService.sendRegisterSms(phone, token);
            if (sendresult) {
                ctx.body = util.retOk({});
            }
            else {
                ctx.body = util.retOk(3, "验证码发送错误，请稍后再试");
            }
        }
        else {
            ctx.body = util.retError(2, "生成短信验证码错误");
        }


    }
    else {
        ctx.body = util.retError(-2, "验证码错误");
    }


}
async function resetPassword(ctx) {
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
            const captchacode = await userService.genSmsToken
        }
        else {
            ctx.body = util.retError(1, "用户不存在");
            return;
        }
        //查找token中是否未失效，未失效不生成验证码直接使用
        const captchacode = await userService.getTokenByPhone(phone, "password");
        const token = captchacode ? captchacode.token : await userService.genSmsToken(phone, "password");

        if (token) {
            //发送 
            //const text = `您正在进行找回密码的操作，验证码 ${token}，请在30分钟提交，切勿将验证码泄露于他人。`;
            const sendresult = await _3rdService.sendPasswordSms(phone, token );
            if (sendresult) {
                ctx.body = util.retOk({});
            }
            else {
                ctx.body = util.retOk(3, "验证码发送错误，请稍后再试");
            }
        }
        else {
            ctx.body = util.retError(2, "生成短信验证码错误");
        }


    }
    else {
        ctx.body = util.retError(-2, "验证码错误");
    }
}
async function resetPassword2(ctx) {
    const { phone, token, password } = ctx.request.body;
    const tokenindb = await userService.getTokenByPhone(phone, "password");
    if (token == tokenindb) {
        const user = await userService.getUserByPhone(phone);
        if (!user || _.isEmpty(user)) {
            ctx.body = util.retError(2000, "用户错误");
        }
        else {
            await userService.changePassword(user["id"], util.sha256(password));
            ctx.body = util.retOk();
        }


    }
    else {
        ctx.body = util.retError(1000, "验证码错误");

    }

}
async function getHomeUser(ctx) {
    let { userslug, type } = ctx.request.query;
    let user = await userService.getUserBySlug(userslug);
    logger.debug(user);
    if (!user || _.isEmpty(user)) {
        ctx.body = util.retError(1000, "未找到用户")
        return;
    }
    user["avatar"]=util.getUseravatar(user["id"]);
    if (type == "info") {
        ctx.body = util.retOk(_.pick(user, [
            "slug",
            "username",
            "jointime",
            "bio",
            "avatar"
        ]));
    }
    else if (type == "activity") {
        logger.debug(user);
        const activity = await userService.getUserActivityById(user["id"]);
        logger.debug(activity);
        ctx.body = util.retOk(_.pick(activity, [
            "lastactiontime",
            "postcount",
            "commentcount",
        ]));
    }
    else {
        ctx.body = util.retError(2000, "错误的参数");
    }
}
async function getHomeList(ctx) {
    let { userslug, type,page } = ctx.request.query;
    page = (!page || page < 1) ? 1 : page;
    const user = await userService.getUserBySlug(userslug);
    logger.debug(user);
    let postlist = [];
    if (!user || _.isEmpty(user)) {
        ctx.body = util.retError(1000, "未找到用户")
        return;
    }
    if (type == "post") {
        postlist = await boardService.getPostListByUserId(user["id"],page);

    }
    else if (type == "up") {
        postlist = await boardService.getPostListByUserUp(user["id"],page);


    }
    else {
        ctx.body=util.retError(2000,"参数错误");
    }
    if (postlist.length==0)
    {
        ctx.body=util.retOk([]);
        return;
    }
    let ids = [];
    ids = _.uniq(ids);
    _.forEach(postlist, function (item) {
        ids.push(item["user_id"]);
    });
    const userlist=await userService.getUserInfoByIds(ids);
    let userlistid = {};
    _.forEach(userlist, function (item) {
        userlistid[item["id"]] = item;
    });
    let retpostlist=[];
    _.forEach(postlist,function(item){
        const postuser=userlistid[item["user_id"]]
        let post=_.pick(item,["slug","title","pubtime","image","label","lastcommenttime"]);
        post["username"]=postuser ? postuser["username"] : "未知用户",
        post["useravatar"]=postuser ?  util.getUseravatar(postuser["id"]) : "",
        retpostlist.push(post);
    });
    ctx.body = util.retOk(retpostlist);
}
module.exports = {
    login,
    register,
    captcha,
    smscode,
    resetPassword,
    resetPassword2,
    getHomeUser,
    getHomeList
}