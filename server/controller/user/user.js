const util = require("../../util");
const logger = util.getLogger(__filename);
const _ = require("lodash");
const moment = require("moment");
const userService = require('../../service/user_service');


async function userInfo(ctx, next) {
    logger.debug("state:", ctx.state);
    let ret = {
    }
    const { user: currentuser, group } = ctx.state;
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

module.exports = {
    userInfo,
}