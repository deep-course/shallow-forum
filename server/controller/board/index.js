//论坛相关
const util = require("../../util");
const logger=util.getLogger(__filename);
const boardService = require("../../service/board_service");
const _ = require("lodash");
const moment = require("moment");

module.exports = {
    /**
     * 
     * @api {post} /board/newpost 发布新帖子
     * @apiName newpost
     * @apiGroup board
     * @apiVersion  1.0.0
     * @apiHeader (Response Headers) {String} token 认证的token
     * @apiSampleRequest /api/board/newpost
     * 
     * @apiParam  {String} title 帖子标题
     * @apiParam  {String} content 帖子内容
     * @apiParam  {String} tags 帖子tag
     * @apiParam  {Number} boardid 板块id
     * @apiParam  {Number} lableid 标签id
     * 
     * @apiParamExample  {type} Request-Example:
     * {
     *     property : value
     * }
     * 
     * 
     * @apiSuccessExample {type} Success-Response:
     * {
     *     property : value
     * }
     * 
     * 
     */
    newPost: async function (ctx, next) {
        //验证内容
        if (!await checkPostContent(ctx)) {
            return;
        }
        logger.debug("checkPostContent检测通过");
        logger.debug("newPost", ctx.state.newpost);
        const { newpost, user } = ctx.state;
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

        };
        const content = {
            type: "comment",
            content: newpost.content,
        };
        const tags = newpost.taglist;
        const postinfo = await boardService.addPost(post, content, tags);
        logger.debug("新建帖子返回:", postinfo)
        if (postinfo.id > 0) {
            ctx.body = util.retOk({ slug: postinfo.slug });
        }
        else {
            ctx.body = util.retError(3000, "发帖错误");
        }

    },
    /**
 * 
 * @api {post} /board/newlink 发布新链接
 * @apiName newlink
 * @apiGroup board
 * @apiVersion  1.0.0
 * @apiHeader (Response Headers) {String} token 认证的token
 * @apiSampleRequest /api/board/newlink
 * 
 * @apiParam  {String} title  链接标题
 * @apiParam  {String} content 链接内容
 * @apiParam  {String} tags 链接tag
 * @apiParam  {Number} boardid 板块id
 * @apiParam  {Number} lableid 标签id
 * @apiParam  {String} url 链接url
 * 
 * @apiParamExample  {type} Request-Example:
 * {
 *     property : value
 * }
 * 
 * 
 * @apiSuccessExample {type} Success-Response:
 * {
 *     property : value
 * }
 * 
 * 
 */
    newLink: async function (ctx, next) {
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

        };
        const content = {
            type: "link",
            content: newpost.content,
            url: newpost.url,
        };
        const tags = newpost.taglist;
        const linkinfo = await boardService.addPost(post, content, tags);
        logger.debug("新建链接返回:", linkinfo)
        if (linkinfo.id > 0) {
            ctx.body = util.retOk({ slug: linkinfo.slug });
        }
        else {
            ctx.body = util.retError(3000, "发帖错误");
        }

    },
    /**
     * 
     * @api {post} /board/newcomment 新建回复
     * @apiName newcomment
     * @apiGroup board
     * @apiVersion  1.0.0
     * 
     * @apiHeader (Response Headers) {String} token 认证的token
     * @apiSampleRequest /api/board/newcomment
     * 
     * 
     * 
     * @apiParam  {String} postslug 帖子slug
     * @apiParam {String} content 回复内容
     * 
     * 
     * @apiParamExample  {type} Request-Example:
     * {
     *     property : value
     * }
     * 
     * 
     * @apiSuccessExample {type} Success-Response:
     * {
     *     property : value
     * }
     * 
     * 
     */
    newComment: async function (ctx, next) {
        //验证内容
        if (!await checkCommentContent(ctx)) {
            return;
        }
        logger.debug("checkCommentContentContent检测通过");
        logger.debug("newComment", ctx.state.newcomment);
        const {newcomment,commentpost,user}=ctx.state;
        const now = moment();
        const comment={
            post_id:newcomment.postid,
            user_id:user.id,
            addtime:now.toDate(),
            type:"comment",
            content:newcomment.content,
            edittime:now.toDate(),
            edituser_id:0,
            ip:"",
            approve:1,
        };
       const commentinfo =await boardService.addComment(comment,commentpost);
       logger.debug("新回复返回:", commentinfo)
       if (commentinfo.id > 0) {
           ctx.body = util.retOk(commentinfo);
       }
       else {
           ctx.body = util.retError(3000, "回复错误");
       }

    },
getBoardInfo:async function(ctx, next){

    
},
getPostInfo:async function(ctx, next){
    //判断是否有帖子
    logger.debug(ctx.state)
    ctx.body=ctx.state

},

};




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
    const post=await boardService.getPostBySlug(postslug);
    logger.debug("post信息:",post);
    if(!post)
    {
        ctx.body = util.retError(2000, "未找到帖子");
        return false
    }
    if(post.lock)
    {
        ctx.body = util.retError(2000, "锁定，不能回复");
        return false
    }

    ctx.state.newcomment = {
        postid: post.id,
        content: content
    };
    ctx.state.commentpost=post;
    return true;
}
