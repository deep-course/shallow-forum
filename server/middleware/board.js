const jwt = require('jsonwebtoken');
const { setting, env } = require('../config');
const util = require('../util');
const boardService = require("../service/board_service");
const userService = require("../service/user_service");
const _ = require("lodash")
const logger = util.getLogger(__filename);

async function getPost(ctx, next) {
    logger.debug("getPost");
    let postslug = "";
    if (ctx.params && ctx.params.postslug) {
        //优先params
        postslug = ctx.params.postslug;

    } else if (ctx.query && ctx.query.postslug) {
        //其次get
        postslug = ctx.query.postslug;

    }
    else if (ctx.request.body && ctx.request.body.postslug) {
        //最后post
        postslug = ctx.request.body.postslug;
    }
    logger.debug("slug:", postslug)
    if (postslug) {
        const post = await boardService.getPostBySlug(postslug)
        if (post && !_.isEmpty(post)) {
            ctx.state.post = post;
        }
    }

    await next();
}
async function getBoard(ctx, next) {
    let boardslug = "";
    if (ctx.params && ctx.params.boardslug) {
        //优先params
        postslug = ctx.params.boardslug;

    } else if (ctx.query && ctx.query.boardslug) {
        //其次get
        postslug = ctx.query.boardslug;

    }
    else if (ctx.body && ctx.body.boardslug) {
        //最后post
        postslug = ctx.body.boardslug;
    }
    if (boardslug) {
        ctx.state.board = await boardService.getBoardBySlug(boardslug)
    }
    await next();
}
async function getPostDetail(ctx, next) {
    const { post } = ctx.state;
    const { user_id, comment_id } = post;
    let postuser = await userService.getUserById(user_id);
    //发帖用户
    if (!postuser || _.isEmpty(postuser)) {
        ctx.body = util.retError(-10, "获取帖子信息错误");
        return;
    }
    ctx.state.postuser = postuser;
    //发帖内容
    const comment = await boardService.getCommentById(comment_id);
    if (!comment || _.isEmpty(comment)) {
        ctx.body = util.retError(-11, "获取帖子内容错误");
        return;
    }
    ctx.state.comment = comment;
    //编辑用户
    if (comment['edituser_id'] > 0) {
        const edituser = await userService.getUserById(comment['edituser_id']);
        if (!edituser || _.isEmpty(edituser)) {
            ctx.body = util.retError(-12, "获取帖子内容错误");
            return;
        }
        ctx.state.edituser = edituser;
    }
    await next();

}
async function checkEditPost(ctx, next) {
    logger.debug("checkEditPost:", ctx.state);
    const { post, currentuser } = ctx.state;
    if (!post) {
        ctx.body = util.retError(-20, "未找到信息")
        return;
    }
    if (comment["type"] != "post") {
        ctx.body = util.retError(-21, "不支持修改")
        return;
    }
    //判断权限
    if (post["user_id"] != currentuser["id"]) {
        ctx.body = util.retError(-22, "没有编辑权限")
        return;
    }
    //判断内容
    const { title, content, lableid, mainimage, imagelist } = ctx.request.body;
    if (!title || !content) {
        ctx.body = util.retError(-23, "标题，内容和类别不能为空");
        return;
    }
    if (title.length > 80) {
        ctx.body = util.retError(-24, "标题最多80个字");
        return;
    }
    ctx.state.editpost = {
        slug: post["slug"],
        title: title,
        content: content,
        comment_id: post["comment_id"],
        lableid: lableid || 0

    }

    //检查图片
    //上传图片必须带postid，所以不会有postid=0的情况
    if (mainimage) {
        //有主图，判断主图是否包含在列表中
        if (imagelist && imagelist.indexOf(mainimage) >= 0) {
            ctx.state.editpost.mainimage = mainimage;
        }
        else {
            //不包含
            ctx.body = util.retError(-30, "图片匹对错误");
            return;
        }

    }
    else {
        ctx.state.editpost.mainimage = "";
    }

    if (imagelist) {
        //判断图片是否在数据库中
        for (let index = 0; index < imagelist.length; index++) {
            const element = imagelist[index];
            const urlindb = await boardService.getImageInfo(element);
            if (_.isEmpty(urlindb)) {
                ctx.body = util.retError(-32, "只能使用已上传图片");
                return;
            } else if (urlindb['post_id'] != post["id"]) {
                ctx.body = util.retError(-34, "只能使用本贴图片");
                return;
            }
        }
        ctx.state.imagelist = imagelist;
    }
    else {
        ctx.state.imagelist = [];
    }

    await next()
}
async function checkAddPost(ctx, next) {
    logger.debug("addPost:", ctx.state);
    //TODO:添加权限判断


    //判断内容
    const { title, content, tags, boardid, lableid, url, mainimage, imagelist } = ctx.request.body;
    if (!title || !content) {
        ctx.body = util.retError(-20, "标题，内容和类别不能为空");
        return;
    }
    if (title.length > 80) {
        ctx.body = util.retError(-21, "标题最多80个字");
        return;
    }
    if (!tags) {
        ctx.body = util.retError(-22, "请选择至少1个标签");
        return;
    }
    const taglist = tags.split(",");
    if (taglist.length > 2) {
        ctx.body = util.retError(-23, "最多只能选择2个标签");
        return;
    }
    const tagsindb = await boardService.getTagListByName(taglist);
    if (tagsindb.length != taglist.length) {
        logger.debug(`tag数与数据库不符:${tagsindb.length}-${taglist.length}`);
        ctx.body = util.retError(-24, "tag数量不符");
        return;
    }
    ctx.state.newpost = {
        title: title,
        content: content,
        taglist: tagsindb,
        boardid: boardid || 0,
        lableid: lableid || 0,
        url: url,
    }
    //验证图片
    //ctx.state= imagelist ? imagelist : [];
    if (mainimage) {
        //有主图，判断主图是否包含在列表中
        if (imagelist && imagelist.indexOf(mainimage) >= 0) {
            ctx.state.newpost.mainimage = mainimage;
        }
        else {
            //不包含
            ctx.body = util.retError(-30, "图片匹对错误");
            return;
        }

    }
    else {
        ctx.state.newpost.mainimage = "";
    }

    if (imagelist) {
        //判断图片是否在数据库中
        for (let index = 0; index < imagelist.length; index++) {
            const element = imagelist[index];
            const urlindb = await boardService.getImageInfo(element);
            if (_.isEmpty(urlindb)) {
                ctx.body = util.retError(-32, "只能使用已上传图片");
                return;
            } else if (urlindb['user_id'] != currentuser["id"]) {
                ctx.body = util.retError(-33, "只能使用自己的图片");
                return;
            } else if (urlindb['post_id'] != 0 || urlindb['user_id'] != currentuser['id']) {
                ctx.body = util.retError(-34, "只能使用新上传图片");
                return;
            }
        }
        ctx.state.imagelist = imagelist;
    }
    else {
        ctx.state.imagelist = [];
    }
    await next()
}
async function checkAddComment(ctx, next) {
    logger.debug("checkAddComment:", ctx.state);
    const { post } = ctx.state;
    //TODO:添加权限判断

    //判断内容
    const { content } = ctx.request.body;
    if (!content) {
        ctx.body = util.retError(2000, "回复内容不能为空");
        return false
    }
    //判断用户post是否存在和post的状态

    logger.debug("post信息:", post);
    if (!post || _.isEmpty(post)) {
        ctx.body = util.retError(2000, "未找到帖子");
        return false
    }
    if (post.lock) {
        ctx.body = util.retError(2000, "锁定，不能回复");
        return false
    }

    ctx.state.newcomment = {
        postid: post.id,
        content: content
    };
    await next();
}

async function checkEditComment(ctx, next) {
    logger.debug("checkEditComment:", ctx.state);
    //TODO:添加权限判断

    //判断内容
    const { content, commentid } = ctx.request.body;
    const { currentuser } = ctx.state;
    if (!content) {
        ctx.body = util.retError(2000, "回复内容不能为空");
        return;
    }
    //判断comment是否存在
    const comment = await boardService.getCommentById(commentid);
    logger.debug("comment信息:", comment);
    if (!comment || _.isEmpty(comment)) {
        ctx.body = util.retError(2000, "未找到回复");
        return;
    }
    if (comment["type"] != "comment") {
        ctx.body = util.retError(2000, "不能编辑");
        return;
    }
    if (comment["user_id"] != currentuser["id"]) {
        ctx.body = util.retError(2000, "不能编辑");
        return;
    }

    ctx.state.editcomment = {
        id: comment["id"],
        content: content,
        edituser: currentuser["id"],
    };
    await next();
}
module.exports = {
    //从请求中获取post信息存入到state中
    getPost,

    //在getPost之后，获取post的的详细信息
    //认为getPost后ctx.state.post信息正确
    //controller只做权限和是否显示和显示内容的整理
    getPostDetail,

    //添加新的post时的判断
    //在user和getpost之后
    //1、解析请求信息，验证
    //2、发帖权限的判断
    //3、图片整理，保证ctx.state中为验证后的格式
    checkAddPost,

    //修改post时判断
    //在user和getpost之后
    //1、解析请求信息，验证
    //2、根据user，当前post编辑权限的判断
    //3、图片整理，保证ctx.state中为验证后的格式
    //4、图片验证还包括删除后的判断
    checkEditPost,

    //添加comment时判断
    //在user和getpost之后
    //1、解析请求信息，验证
    //2、根据当前post和user做权限的判断
    checkAddComment,

    //添加comment时判断
    //在user和getpost之后
    //1、解析请求信息，验证
    //2、根据当前post，当前的comment和user做权限的判断
    checkEditComment,
}