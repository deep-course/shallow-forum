const util = require("../../util");
const logger = util.getLogger(__filename);
const boardService = require("../../service/board_service");
const userService = require("../../service/user_service");
const _ = require("lodash");
const moment = require("moment");
const sharp = require("sharp")

async function newPost(ctx, next) {
    //验证内容
    if (!await checkPostContent(ctx)) {
        return;
    }
    logger.debug("checkPostContent检测通过");
    logger.debug("newPost", ctx.state.newpost);
    const { newpost, user } = ctx.state;
    //检测图片
    if (!await checkUploadFile(ctx)) {
        return;
    }
    const { mainimage, imagelist } = ctx.request.body;
    const now = moment();
    const post = {
        title: newpost.title,
        pubtime: now.toDate(),
        user_id: user.id,
        comment_id: 0,
        label: newpost.lableid,
        approve: 1,
        lock: 0,
        sticky: 0,
        board_id: newpost.boardid,
        image: mainimage ? mainimage : "",
        deleted: 0

    };
    const content = {
        type: "post",
        content: newpost.content,
        approve: 1,
        ip: util.getClientIP(ctx.req),
        deleted: 0
    };
    const tags = newpost.taglist;
    const postinfo = await boardService.addPost(post, content, tags, imagelist);
    logger.debug("新建帖子返回:", postinfo)
    if (!_.isEmpty(postinfo) && postinfo.id > 0) {
        ctx.body = util.retOk({ slug: postinfo.slug });
    }
    else {
        ctx.body = util.retError(3000, "发帖错误");
    }

}
async function newLink(ctx, next) {
    //验证内容
    if (!await checkPostContent(ctx)) {
        return;
    }
    logger.debug("checkPostContent检测通过");
    logger.debug("newLink", ctx.state.newpost);
    const { newpost, user } = ctx.state;
    if (!newpost.url) {
        ctx.body = util.retError(2000, "链接不能为空");
        return false;
    }
    const objurl = util.parseUrl(newpost.url);
    logger.debug(objurl);
    if (!objurl.hostname) {
        ctx.body = util.retError(2000, "链接格式不正确");
        return false;
    }
    if (newpost.content.length > 140) {
        ctx.body = util.retError(2000, "链接介绍最多140字");
        return false;
    }
    const now = moment();
    const post = {
        title: newpost.title,
        pubtime: now.toDate(),
        user_id: user.id,
        comment_id: 0,
        label: newpost.lableid,
        approve: 1,
        lock: 0,
        sticky: 0,
        board_id: newpost.boardid,
        image: "",
        deleted: 0

    };
    const content = {
        type: "link",
        content: newpost.content,
        url: newpost.url,
        approve: 1,
        ip: util.getClientIP(ctx.req),
        deleted: 0
    };
    const tags = newpost.taglist;
    const linkinfo = await boardService.addPost(post, content, tags, []);
    logger.debug("新建链接返回:", linkinfo)
    if (!_.isEmpty(linkinfo) && linkinfo.id > 0) {
        ctx.body = util.retOk({ slug: linkinfo.slug });
    }
    else {
        ctx.body = util.retError(3000, "发帖错误");
    }

}
async function getPostInfo(ctx, next) {
    //判断是否有帖子
    logger.debug(ctx.state)
    let { post } = ctx.state;
    const { user_id, comment_id } = post;
    let user = await userService.getUserById(user_id);
    //发帖用户
    if (!user || _.isEmpty(user)) {
        ctx.body = util.retError(-1, "获取帖子信息错误");
        return;
    }
    //发帖内容
    let comment = await boardService.getCommentById(comment_id);
    if (!comment || _.isEmpty(comment)) {
        ctx.body = util.retError(-2, "获取帖子内容错误");
        return;
    }
    //编辑用户
    if (comment['edituser_id'] > 0) {
        const edituser = await userService.getUserById(comment['edituser_id']);
        if (!edituser || _.isEmpty(edituser)) {
            ctx.body = util.retError(-3, "获取帖子内容错误");
            return;
        }
        comment["edituser"] = edituser['username'];
    } else {
        comment["edituser"] = "";
    }
    post["comment"] = comment;
    post["user"] = user;
    ctx.state.post = post;
    await next();


}
async function editPost(ctx, next) {
    ctx.body=util.retOk();
    return;
    logger.debug("editPost", ctx.state);
    //验证内容
    if (!await checkEditContent(ctx)) {
        return;
    }
    //验证图片
    if (!await checkUploadFile(ctx)){
        return;
    }
    const { mainimage, imagelist } = ctx.request.body;
    const {editpost}=ctx.state;
    const now = moment();
    const post = {
        title: editpost.title,
        comment_id: 0,
        label: editpost.lableid,
        image: mainimage ? mainimage : ""

    };
    const content = {
        type: "post",
        content: editpost.content,
        ip: util.getClientIP(ctx.req),
        edittime:now.toDate(),
        edituser_id:user["id"]
    };
    const tags = newpost.taglist;
    const postinfo = await boardService.editPost(post, content, tags, imagelist);
    logger.debug("新建帖子返回:", postinfo)
    if (!_.isEmpty(postinfo) && postinfo.id > 0) {
        ctx.body = util.retOk({ slug: postinfo.slug });
    }
    else {
        ctx.body = util.retError(3000, "发帖错误");
    }



}
module.exports={
    newPost,
    newLink,
    getPostInfo,
    editPost
};