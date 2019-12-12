const util = require("../../util");
const logger = util.getLogger(__filename);
const boardService = require("../../service/board_service");
const userService = require("../../service/user_service");
const _ = require("lodash");
const moment = require("moment");
const sharp = require("sharp")

async function newPost(ctx, next) {
    logger.debug("newPost", ctx.state);
    const { newpost, imagelist, currentuser } = ctx.state;
    const now = moment();
    const post = {
        title: newpost.title,
        pubtime: now.toDate(),
        user_id: currentuser.id,
        comment_id: 0,
        label: newpost.lableid,
        approve: 1,
        lock: 0,
        sticky: 0,
        board_id: newpost.boardid,
        image: newpost.mainimage,
        deleted: 0,
        type:"post"

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

    logger.debug("newLink", ctx.state);
    const { newpost, currentuser } = ctx.state;
    if (!newpost.url) {
        ctx.body = util.retError(2000, "链接不能为空");
        return;
    }
    const objurl = util.parseUrl(newpost.url);
    logger.debug(objurl);
    if (!objurl.hostname) {
        ctx.body = util.retError(2000, "链接格式不正确");
        return;
    }
    if (newpost.content.length > 140) {
        ctx.body = util.retError(2000, "链接介绍最多140字");
        return;
    }
    const now = moment();
    const post = {
        title: newpost.title,
        pubtime: now.toDate(),
        user_id: currentuser.id,
        comment_id: 0,
        label: newpost.lableid,
        approve: 1,
        lock: 0,
        sticky: 0,
        board_id: newpost.boardid,
        image: "",
        deleted: 0,
        type:"link"

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
async function showPost(ctx, next) {
    logger.debug("showPost:", ctx.state)
    //TODO：增加权限管理和管理员管理
    const { currentuser, post, postuser, comment, edituser,posttags } = ctx.state
    let retpost = _.pick(post, ["slug", "title", "pubtime", "label", "sticky", "lock", "image"]);
    //删帖不显示
    if (post['deleted'] == 1) {
        ctx.body = util.retError(10, '无法找到内容');
        return;
    }
    //账号锁定不显示
    if (currentuser && currentuser['lock'] == 1) {
        ctx.body = util.retError(11, '用户已锁定');
        return;
    }
    retpost["comment"] = comment;
    retpost['comment'] = _.pick(comment, ['addtime', 'type', 'content']);
    //是否被编辑过
    if (edituser) {
        retpost['comment']['edituser'] = edituser["username"];
        retpost['comment']['edittime'] = comment["edittime"];
    }
    retpost['user'] = _.pick(postuser, ['username', 'lock', 'activate', 'avatar']);
    retpost['tags']=[];
    posttags.forEach(element => {
        _.unset(element,"id")
        retpost['tags'].push(element);
    });
    ctx.body = util.retOk(retpost);


}
async function editPost(ctx, next) {
    logger.debug("editPost:", ctx.state);
    //ctx.body = util.retOk(ctx.state);
    //return;
    const { imagelist } = ctx.request.body;
    const { editpost, currentuser } = ctx.state;
    const now = moment();
    const post = {
        slug: editpost.slug,
        title: editpost.title,
        label: editpost.lableid,
        image: editpost.mainimage,

    };
    const content = {
        content: editpost.content,
        edittime: now.toDate(),
        edituser_id: currentuser["id"],
        comment_id: editpost.comment_id
    };
    const result = await boardService.editPost(post, content, imagelist);
    logger.debug("修改帖子返回:", postinfo)
    if (result) {
        ctx.body = util.retOk();
    }
    else {
        ctx.body = util.retError(3000, "修改错误");
    }



}
async function deletePost(ctx, next) {
    logger.debug("deletePost:", ctx.state);
    const { currentuser, post } = ctx.state;
    if (!post || _.isEmpty(post)) {
        ctx.body = util.retError(1000, "未找到");
        return;
    }
    if (post["user_id"] != currentuser["id"]) {
        ctx.body = util.retError(2000, "无法删除");
        return;
    }
    const result = await boardService.deletePost(post["id"]);
    if (result) {
        ctx.body = util.retOk();
    }
    else {
        ctx.body = util.retError(3000, "删除错误");
    }
}
async function upPost(ctx, next) {
    logger.debug("upPost:", ctx.state);
    const { currentuser, post } = ctx.state;
    if (!post || _.isEmpty(post)) {
        ctx.body = util.retError(1000, "未找到");
        return;
    }
    const upindb = await boardService.checkUpHistory(post["id"], currentuser["id"]);
    logger.debug(upindb);
    if (upindb) {
        ctx.body = util.retError(1000, "已顶过");
        return;
    }
    const result = await boardService.upPost(post["id"], currentuser["id"]);
    if (result) {
        ctx.body = util.retOk();
    }
    else {
        ctx.body = util.retError(3000, "成功");
    }


}
async function getPostList(ctx, next) {
    logger.debug("getPostList:", ctx.request.query);
    let { tag, page, sort } = ctx.request.query
    const tags=_.split(tag,",");
    if (tags.length>2)
    {
        ctx.body = util.retError(1000, "tag错误");
        return;
    }
    const taginfo = await boardService.getTagListByName(tags);
    if (taginfo.length != 1) {
        ctx.body = util.retError(2000, "tag未找到");
        return;
    }
    page = (!page || page < 1) ? 1 : page;
    const postlist = await boardService.getPostListbyTagId(taginfo[0]["id"], page, sort);
    if (postlist.length == 0) {
        ctx.body = util.retOk([]);
        return
    }
    let ids = [];
    _.forEach(postlist, function (item) {
        ids.push(item["user_id"]);
    });
    ids = _.uniq(ids);

    const userlist = await userService.getUserInfoByIds(ids);
    let userlistid = {};
    _.forEach(userlist, function (item) {
        userlistid[item["id"]] = item;
    });
    let retpostlist = [];
    _.forEach(postlist, function (item) {
        const postuser = userlistid[item["user_id"]]
        let post = _.pick(item, ["slug", "title", "pubtime", "image", "label", "lastcommenttime"]);
        post["username"] = postuser ? postuser["username"] : "未知用户";
        post["useravatar"] = postuser?postuser["avatar"]:"";
        retpostlist.push(post);
    });
    ctx.body = util.retOk(retpostlist);


}

module.exports = {
    newPost,
    newLink,
    showPost,
    editPost,
    deletePost,
    upPost,
    getPostList,
};