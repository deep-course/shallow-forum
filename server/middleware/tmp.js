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
    if (_.isEmpty(post)) {
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
async function checkUploadFile(ctx) {
    logger.debug("checkUploadFile");
    let { mainimage, imagelist } = ctx.request.body;
    const {user}=ctx.state;
    imagelist = imagelist ? imagelist : [];
    if (mainimage) {
        //有主图，判断主图是否包含在列表中
        if (imagelist.indexOf(mainimage) >= 0) { }
        else {
            //不包含
            ctx.body = util.retError(-1, "图片匹对错误");
            return false;
        }

    }
    else {
        mainimage = "";
    }
    //判断图片是否在数据库中

    for (let index = 0; index < imagelist.length; index++) {
        const element = imagelist[index];
        const urlindb = await boardService.getImageInfo(element);
        if (_.isEmpty(urlindb)) {
            ctx.body = util.retError(-2, "只能使用已上传图片");
            return false;
        } else if (urlindb['user_id'] != user["id"]) {
            ctx.body = util.retError(-3, "只能使用自己的图片");
            return false;
        } else if (urlindb['post_id'] != 0 || urlindb['user_id']!=user['id']) {
            ctx.body = util.retError(-4, "只能使用新上传图片");
            return false;
        }
    }
    return true;

}

async function checkEditContent(ctx) {
    logger.debug("checkEditContent");
    if (!checkUser(ctx)) {
        return false;
    }
    //判断内容
    const { title, content,lableid} = ctx.request.body;
    if (!title || !content) {
        ctx.body = util.retError(2000, "标题，内容和类别不能为空");
        return false
    }
    if (title.length > 80) {
        ctx.body = util.retError(2000, "标题最多80个字");
        return false;
    }
    
    ctx.state.editpost = {
        title: title,
        content: content,
        lableid,lableid
    }
    return true;

};