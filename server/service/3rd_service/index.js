
const util = require('../../util');
const logger = util.getLogger(__filename);
const fs = require("fs");
const path = require("path");

//掉用第三方接口发送短信，返回是否成功
async function sendSms(phone, text) {
    logger.debug("sendSms:", text);
    return true;
}
//掉用第三方接口保存文件
async function saveFile(filepath, filename) {
    logger.debug("saveFile:", filepath, filename);
    const savepath = path.join(process.cwd(), "upload", filename);
    try {
        fs.renameSync(filepath, savepath);
        return "/upload/" + filename;
    } catch (error) {
        logger.error("saveFile error", error);
        return "";
    }


}
//掉用第三方接口删除文件
async function deleteFile(filepath) {
    logger.debug("deleteFile:", filepath);
    const localpath = path.join(process.cwd(), filepath);
    logger.debug(localpath);
    try {
        if (fs.existsSync(localpath)) {
            fs.unlinkSync(localpath);
        }
        return true;
    } catch (error) {
        logger.error("deleteFile error: ", error);
        return false;
    }

}

module.exports = {
    sendSms,
    saveFile,
    deleteFile
}