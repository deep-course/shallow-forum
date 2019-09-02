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
            await userService.updateUserActionTime(currentuser.id)
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
}
