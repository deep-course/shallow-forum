const util = require("../../util");
const logger = util.getLogger(__filename);
const _ = require("lodash");
const moment = require("moment");
const userService = require('../../service/user_service');


async function userInfo(ctx, next) {
    logger.debug("state:", ctx.state);
    let ret = {
    }
    const { currentuser, group } = ctx.state;
    if (currentuser) {
        const userindb = await userService.getUserById(currentuser.id);
        if (userindb) {
            ret.user = _.pick(currentuser, ["id", "username", "lock", "activate"]);
            ret.group = group;
            await userService.updateUserActionTime(currentuser.id, util.getClientIP(ctx.req));
            let token = util.getToken({
                id: currentuser.id,
                hash: util.md5(`${currentuser.id}|${currentuser.password}`)
            });
            logger.debug("user-info:", token);
            ctx.set("X-SetToken", token);
        }
    }

    ctx.body = util.retOk(ret);
}
async function changePassword(ctx) {
    const { currentuser } = ctx.state;
    const { oldpass, newpass } = ctx.request.body;
    if (util.sha256(oldpass) != currentuser.password) {
        ctx.body = util.retError(1000, "密码不正确");
        return;

    }
    await userService.changePassword(currentuser["id"],util.sha256(newpass));
    ctx.body=util.retOk();
}
async function getUserDetail(ctx){
    const { currentuser } = ctx.state;
    const bio=currentuser["bio"];
    //const result= await userService.getUserInfoById(currentuser["id"]);
    const userinfo={
        bio
    };
    ctx.body=util.retOk(userinfo);
}
async function updateUserDetail(ctx){
    const { currentuser } = ctx.state;
    const {bio}= ctx.request.body
    await userService.updateUserBio(currentuser["id"],bio);
    ctx.body=util.retOk();
}
module.exports = {
    userInfo,
    changePassword,
    getUserDetail,
    updateUserDetail,
}