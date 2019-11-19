//论坛相关
const util = require("../../util");
const logger = util.getLogger(__filename);
const boardService = require("../../service/board_service");
const _ = require("lodash");
const moment = require("moment");
const sharp = require("sharp")
const boardController = module.exports = {
    async newPost(ctx, next) {
        //验证内容
        if (!await checkPostContent(ctx)) {
            return;
        }
        logger.debug("checkPostContent检测通过");
        logger.debug("newPost", ctx.state.newpost);
        const { newpost, user } = ctx.state;
        let { mainimage, imagelist } = ctx.request.body;
        logger.debug("检测图片");
        imagelist = imagelist ? imagelist : [];
        if (mainimage) {
            //有主图，判断主图是否包含在列表中
            if (imagelist.indexOf(mainimage) >= 0) { }
            else {
                //不包含
                ctx.body = util.retError(-1, "图片匹对错误");
                return;
            }

        }
        else{
            mainimage="";
        }
        //判断图片是否在数据库中

        for (let index = 0; index < imagelist.length; index++) {
            const element = imagelist[index];
            const urlindb = await boardService.getImageInfo(element);
            if (_.isEmpty(urlindb)) {
                ctx.body = util.retError(-2, "只能使用已上传图片");
                return;
            } else if (urlindb['user_id'] != user["id"]) {
                ctx.body = util.retError(-3, "只能使用自己的图片");
                return;
            } else if (urlindb['post_id'] != 0) {
                ctx.body = util.retError(-4, "只能使用新上传图片");
                return;
            }
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
            image: mainimage,
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
        if (postinfo.id > 0) {
            ctx.body = util.retOk({ slug: postinfo.slug });
        }
        else {
            ctx.body = util.retError(3000, "发帖错误");
        }

    },

    async newLink(ctx, next) {
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
        if (linkinfo.id > 0) {
            ctx.body = util.retOk({ slug: linkinfo.slug });
        }
        else {
            ctx.body = util.retError(3000, "发帖错误");
        }

    },

    async newComment(ctx, next) {
        //验证内容
        if (!await checkCommentContent(ctx)) {
            return;
        }
        logger.debug("checkCommentContentContent检测通过");
        logger.debug("newComment", ctx.state.newcomment);
        const { newcomment, commentpost, user } = ctx.state;
        const now = moment();
        const comment = {
            post_id: newcomment.postid,
            user_id: user.id,
            addtime: now.toDate(),
            type: "comment",
            content: newcomment.content,
            edittime: now.toDate(),
            edituser_id: 0,
            ip: util.getClientIP(ctx.req),
            approve: 1,
            deleted: 0
        };
        const commentinfo = await boardService.addComment(comment, commentpost);
        logger.debug("新回复返回:", commentinfo)
        if (commentinfo.id > 0) {
            ctx.body = util.retOk(commentinfo);
        }
        else {
            ctx.body = util.retError(3000, "回复错误");
        }

    },
    async getBoardInfo(ctx, next) {


    },
    async getPostInfo(ctx, next) {
        //判断是否有帖子
        logger.debug(ctx.state)
        ctx.body = ctx.state

    },
    async uploadAttachments(ctx, next) {
        logger.debug('uploadAttachments')
        //验证用户
        if (!checkUser(ctx)) {
            return;
        }

        const file = ctx.request.files.file;
        if (!file) {
            ctx.body = util.retError(-1, "未找到文件");
            return;
        }
        let format = "";
        try {
            const metadata = await sharp(file.path).metadata();
            logger.debug("format: ", metadata.format)
            format = metadata.format;

        } catch (error) {
            logger.error("upload error: ", error);
            ctx.body = util.retError(-2, "format error");
            return;
        }
        const { user, post } = ctx.state;
        //判断post是否是用户发帖
        let postid = 0;
        if (post) {
            if (post["user_id"] != user["id"]) {
                ctx.body = util.retError(-3, "参数错误");
                return;
            }
            postid = post["id"]
        }
        const fileurl = await boardService.saveFile(file.path, format, user["id"], postid);
        if (fileurl) {
            ctx.body = util.retOk({ url: fileurl });

        }
        else {
            ctx.body = util.retError(-4, "文件上传错误");
        }


    },
    async showattachments(ctx, next) {
        logger.debug('showattachments')
        //验证用户
        if (!checkUser(ctx)) {
            return;
        }
        const { user, post } = ctx.state;
        //判断post是否是用户发帖
        let postid = 0;
        if (post) {
            if (post["user_id"] != user["id"]) {
                ctx.body = util.retError(-3, "参数错误");
                return;
            }
            postid = post["id"]
        }
        const filelist = await boardService.getAllFile(user["id"], postid);
        ctx.body = util.retOk(filelist);

    },
    async removeattachments(ctx, next) {
        logger.debug('removeattachments')
        //验证用户
        if (!checkUser(ctx)) {
            return;
        }
        const { fileurl } = ctx.request.body;
        const { user } = ctx.state;
        if (fileurl) {
            const imageinfo = await boardService.getImageInfo(fileurl);
            if (_.isEmpty(imageinfo)) {
                ctx.body = util.retError(-2, "未找到文件");
            } else {
                if (user["id"] == imageinfo["user_id"]) {
                    const result = await boardService.deleteFile(imageinfo);
                    if (result) {
                        ctx.body = util.retOk();
                    } else {
                        ctx.body = util.retError(-3, "删除错误");
                    }


                }
                else {
                    ctx.body = util.retError(-2, "文件不正确");
                }

            }

        }
        else {
            ctx.body = util.retError(-1, "参数不正确");

        }

    }

};



//---------------------------------------------------------
//检测post需要的数据，如果正确返回post信息，错误返回false
async function checkPostContent(ctx) {
    logger.debug("checkPostContent");
    if (!checkUser(ctx)) {
        return false;
    }
    //判断内容
    const { title, content, tags, boardid, lableid, url } = ctx.request.body;
    if (!title || !content) {
        ctx.body = util.retError(2000, "标题，内容和类别不能为空");
        return false
    }
    if (title.length > 80) {
        ctx.body = util.retError(2000, "标题最多80个字");
        return false;
    }
    if (!tags) {
        ctx.body = util.retError(2000, "请选择至少1个标签");
        return false;
    }
    const taglist = tags.split(",");
    if (taglist.length > 2) {
        ctx.body = util.retError(2000, "最多只能选择2个标签");
        return false;
    }
    const tagsindb = await boardService.getTagListByName(taglist);
    if (tagsindb.length != taglist.length) {
        logger.debug(`tag数与数据库不符:${tagsindb.length}-${taglist.length}`);
        ctx.body = util.retError(2000, "tag数与数据库不符");
        return false;
    }
    ctx.state.newpost = {
        title: title,
        content: content,
        taglist: tagsindb,
        boardid: boardid || 0,
        lableid: lableid || 0,
        url: url,
    }
    return true;

};
//判断用户
function checkUser(ctx) {
    logger.debug("checkUser", ctx.state);

    const { user } = ctx.state;
    if (user) {
        if (!user.activate) {
            ctx.body = util.retError(2000, "用户未激活");
            return false;
        }
        if (user.lock) {
            ctx.body = util.retError(2000, "用户已锁定");
            return false;
        }
    } else {
        ctx.body = util.retError(2000, "用户未登录");
        return false;
    }
    return true;
};
//检测comment需要的数据，如果正确返回post信息，错误返回false
async function checkCommentContent(ctx) {
    logger.debug("checkCommentContent");
    if (!checkUser(ctx)) {
        return false;
    }
    //判断内容
    const { content, postslug } = ctx.request.body;
    if (!content) {
        ctx.body = util.retError(2000, "回复内容不能为空");
        return false
    }
    if (!postslug) {
        ctx.body = util.retError(2000, "回复帖子id错误");
        return false
    }
    //判断用户post是否存在和post的状态
    const post = await boardService.getPostBySlug(postslug);
    logger.debug("post信息:", post);
    if (!post) {
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
    ctx.state.commentpost = post;
    return true;
}