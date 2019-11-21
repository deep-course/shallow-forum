const util = require("../../util");
const logger = util.getLogger(__filename);
const boardService = require("../../service/board_service");
const userService = require("../../service/user_service");
const _ = require("lodash");
const moment = require("moment");
const sharp = require("sharp")

async function newComment(ctx, next) {

    logger.debug("newComment", ctx.state.newcomment);
    const { newcomment, currentuser,post } = ctx.state;
    const now = moment();
    const comment = {
        post_id: newcomment.postid,
        user_id: currentuser.id,
        addtime: now.toDate(),
        type: "comment",
        content: newcomment.content,
        edittime: now.toDate(),
        edituser_id: 0,
        ip: util.getClientIP(ctx.req),
        approve: 1,
        deleted: 0
    };
    const commentinfo = await boardService.addComment(comment, post);
    logger.debug("新回复返回:", commentinfo)
    if (!_.isEmpty(commentinfo) && commentinfo.id > 0) {
        ctx.body = util.retOk(commentinfo);
    }
    else {
        ctx.body = util.retError(3000, "回复错误");
    }

}

module.exports={
    newComment,
}