//论坛相关
const util = require("../../util");
const logger = util.getLogger(__filename);
const boardService = require("../../service/board_service");
const userService = require("../../service/user_service");
const _ = require("lodash");
const moment = require("moment");
const sharp = require("sharp")
async function getBoardInfo(ctx, next) {


}
module.exports = {
    getBoardInfo,
}
