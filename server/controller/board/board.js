//论坛相关
const util = require("../../util");
const logger = util.getLogger(__filename);
const _ = require("lodash");
const moment = require("moment");
const sharp = require("sharp");
const _3rdService=require("../../service/3rd_service");
const fs = require("fs");
const path=require("path");
async function getBoardInfo(ctx, next) {


}
async function getBoardSetting(ctx) {
    let taglist = {};
    taglist["test"]="测试tag";
    taglist["tag1"]="测试1";

    let laballist={};
    laballist[0]="无";
    laballist[1]="提问";
    laballist[2]="已解决";

    ctx.body = util.retOk({
        taglist,
        laballist
    });
}
async function uploadAvatar(ctx){
    logger.debug('uploadAvatar')
    const file = ctx.request.files.file;
    const { currentuser} = ctx.state;
    if (!file) {
        ctx.body = util.retError(-1, "未找到文件");
        return;
    }
    let format = "";
    const newfilename=util.md5("avatar-"+currentuser["id"])+".png";
    const tempfilepath=path.join(process.cwd(), "upload", newfilename);
    logger.debug(tempfilepath);
    try {
        const metadata = await sharp(file.path).metadata();
        logger.debug("format: ", metadata.format)
        format = metadata.format;
        if (format.length>0 && format!="png" ){
            await sharp(file.path).png().resize(100,100).toFile(tempfilepath);
        }else
        {
            fs.copyFileSync(file.path,tempfilepath);
        }

    } catch (error) {
        logger.error("upload error: ", error);
        ctx.body = util.retError(-2, "format error");
        return;
    }
    
    try {
        const url=await _3rdService.saveFile(tempfilepath,"avatar/"+newfilename); 
        ctx.body=util.retOk({url});
    } catch (error) {
        logger.error("uploadAvatar error:",error)
        ctx.body=util.error(-1,"头像上传错误");
    }
    finally{
        if (fs.existsSync(tempfilepath))
        {
            fs.unlinkSync(tempfilepath)
        }
    }
    
    
}
module.exports = {
    getBoardInfo,
    getBoardSetting,
    uploadAvatar
}
