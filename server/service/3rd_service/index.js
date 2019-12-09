
const util = require('../../util');
const logger = util.getLogger(__filename);
const fs = require("fs");
const path = require("path");
const config = require("../../config");
const sms = require("./" + config.setting.sms);
const fileStorage = require("./" + config.setting.file);
logger.info("Load 3rd SMS:", config.setting.sms);
logger.info("Load 3rd file storage:", config.setting.sms);
//掉用第三方接口发送短信，返回是否成功
async function sendRegisterSms(phone, token) {
    logger.debug("sendRegisterSms:", token);
    return await sms.sendRegisterSms(phone, token);

}

async function sendPasswordSms(phone, token) {
    logger.debug("sendPasswordSms:", token);
    return await sms.sendPasswordSms(phone, token);
}
//掉用第三方接口保存文件
async function saveFile(filepath, filename) {
    logger.debug("saveFile:", filepath, filename);
    try {
        if (typeof fileStorage.put === "function") {
            //第三方服务上传文件
            return fileStorage.put(filepath, filename);
        }
        else {
            //默认存本地
            //const savepath = path.join(process.cwd(), "upload", filename);
            //fs.renameSync(filepath, savepath);
            //return "/" + filename;
            return "";
        }

    } catch (error) {
        logger.error("saveFile error", error);
        return "";
    }


}
//掉用第三方接口删除文件
async function deleteFile(filepath) {
    logger.debug("deleteFile:", filepath);

    try {
        if (typeof fileStorage.put === "function") {
            //第三方服务删除
            return await fileStorage.del(filepath);
        }
        else {
            //默认本地删除
            //const localpath = path.join(process.cwd(), filepath);
            //logger.debug(localpath);
            //if (fs.existsSync(localpath)) {
            //    fs.unlinkSync(localpath);
            //}
            return false;
        }
    } catch (error) {
        logger.error("deleteFile error: ", error);
        return false;
    }

}

module.exports = {
    sendPasswordSms,
    sendRegisterSms,
    saveFile,
    deleteFile
}