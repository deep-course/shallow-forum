const util = require("../../util");
const logger = util.getLogger(__filename);
const boardService = require("../../service/board_service");
const userService = require("../../service/user_service");
const _ = require("lodash");
const moment = require("moment");
const sharp = require("sharp")
async function uploadAttachment(ctx, next) {
    logger.debug('uploadAttachments')
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
    const { currentuser, post } = ctx.state;
    //判断post是否是用户发帖
    let postid = 0;
    if (post) {
        if (post["user_id"] != currentuser["id"]) {
            ctx.body = util.retError(-3, "参数错误");
            return;
        }
        postid = post["id"]
    }
    const fileurl = await boardService.saveFile(file.path, format, currentuser["id"], postid);
    if (fileurl && !_.isEmpty(fileurl)) {
        ctx.body = util.retOk({ url: fileurl });

    }
    else {
        ctx.body = util.retError(-4, "文件上传错误");
    }


}

async function showAttachment(ctx, next) {
    logger.debug('showattachments')
    //验证用户

    const { currentuser, post } = ctx.state;
    //判断post是否是用户发帖
    let postid = 0;
    if (post) {
        if (post["user_id"] != currentuser["id"]) {
            ctx.body = util.retError(-3, "参数错误");
            return;
        }
        postid = post["id"]
    }
    const filelist = await boardService.getAllFile(currentuser["id"], postid);
    ctx.body = util.retOk(filelist);

}
async function removeAttachment(ctx, next) {
    logger.debug('removeattachments')
    //验证用户
    const { fileurl } = ctx.request.body;
    const { currentuser } = ctx.state;
    if (fileurl) {
        const imageinfo = await boardService.getImageInfo(fileurl);
        if (_.isEmpty(imageinfo)) {
            ctx.body = util.retError(-2, "未找到文件");
        } else {
            if (currentuser["id"] == imageinfo["user_id"]) {
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
module.exports = {
    uploadAttachment,
    showAttachment,
    removeAttachment
}