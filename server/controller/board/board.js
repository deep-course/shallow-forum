//论坛相关
const util = require("../../util");
const logger = util.getLogger(__filename);
const _=require('lodash');
const boardService=require("../../service/board_service");
async function getBoardInfo(ctx, next) {


}
async function getBoardSetting(ctx) {
    const taglistindb = await boardService.getBuildInTagList();
    let taglist=[];
    taglistindb.forEach(element => {
        _.unset(element,"id")
        taglist.push(element);
        
    });
    logger.debug(taglist);
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
