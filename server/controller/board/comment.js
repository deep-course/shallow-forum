const util = require("../../util");
const logger = util.getLogger(__filename);
const boardService = require("../../service/board_service");
const userService = require("../../service/user_service");
const _ = require("lodash");
const moment = require("moment");

function editComment(ctx, next) {
    const { editcomment } = ctx.state;
    editcomment["edittime"] = moment().toDate();
    const result = boardService.updateComment(editcomment);
    if (result) {
        ctx.body = util.retOk();

    } else {
        ctx.body = util.retError(1000, "修改失败");
    }

}
module.exports = {
    editComment,
}