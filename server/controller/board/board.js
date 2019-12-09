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

module.exports = {
    getBoardInfo,
    getBoardSetting
}
