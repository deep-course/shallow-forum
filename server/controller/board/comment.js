const util = require("../../util");
const logger = util.getLogger(__filename);
const boardService = require("../../service/board_service");
const userService = require("../../service/user_service");
const _ = require("lodash");
const moment = require("moment");

async function editComment(ctx, next) {
    const { editcomment } = ctx.state;
    editcomment["edittime"] = moment().toDate();
    const result = await boardService.updateComment(editcomment);
    if (result) {
        ctx.body = util.retOk();

    } else {
        ctx.body = util.retError(1000, "修改失败");
    }

}
async function deleteComment(ctx, next) {
    logger.debug("deleteComment", ctx.state);
    const { commentid } = ctx.request.body;
    const { currentuser } = ctx.state;
    //判断comment是否存在
    const comment = await boardService.getCommentById(commentid);
    logger.debug("comment信息:", comment);
    if (!comment || _.isEmpty(comment)) {
        ctx.body = util.retError(2000, "未找到回复");
        return;
    }
    if (comment["type"] != "comment") {
        ctx.body = util.retError(2000, "不能删除");
        return;
    }
    if (comment["user_id"] != currentuser["id"]) {
        ctx.body = util.retError(2000, "不能删除");
        return;
    }
    const result = await boardService.deleteComment(commentid);
    if (result) {
        ctx.body = util.retOk();

    }
    else {
        ctx.body - util.retError(1000, "删除错误");
    }

}
async function getCommentList(ctx, next) {
    logger.debug("getCommentList", ctx.state);
    let { page } = ctx.request.body;
    page = (!page || page < 1) ? 1 : page;
    const { post } = ctx.state;
    if (!post || _.isEmpty(post) || post["deleted"] == 1) {
        ctx.body = util.retError(1000, "未找到");
        return;
    }
    const commentlist = await boardService.getCommentListByPostId(post["id"], page);
    if (commentlist.length==0){
        ctx.body=util.retOk([]);
        return;
    }
    let ids = [];
    _.forEach(commentlist, function (item) {
        ids.push(item["user_id"]);
        ids.push(item["edituser_id"])
    });

    //获取用户信息
    const userlist = await userService.getUserInfoByIds(ids);
    let userlistid = {};
    _.forEach(userlist, function (item) {
        userlistid[item["id"]] = item;
    });
    const retcommentlist = _.map(commentlist, function (item) {
        const commentuser = userlistid[item["user_id"]];
        const edituser = userlistid[item["edituser_id"]];
        let newitem = {
            id:item["id"],
            content: item["content"],
            username: commentuser ? commentuser["username"] : "未知用户",
            addtime:item["addtime"],
            useravatar:commentuser ? commentuser["avatar"] : "",
        };
        if (item["edituser_id"]!=0){
            newitem["edituser"]={
                username:edituser ? edituser["username"] : "未知用户",
                edittime:item["edittime"]
            }
        }
        return newitem;
    });

    ctx.body = util.retOk(retcommentlist);

}
module.exports = {
    editComment,
    deleteComment,
    getCommentList
}