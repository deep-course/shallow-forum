//未登录首页
const util = require('../util');
const logger = util.getLogger(__filename);
const _=require("lodash");
const userService = require("../service/user_service");
const boardService=require('../service/board_service');
const homeController=module.exports = {

    async home  (ctx) {
       logger.debug("home:", ctx.request.query);
       let {page, sort } = ctx.request.query
       page = (!page || page < 1) ? 1 : page;
       const postlist = await boardService.getHomePostList( page, sort);
       if (postlist.length == 0) {
           ctx.body = util.retOk([]);
           return
       }
       let ids = [];
       _.forEach(postlist, function (item) {
           ids.push(item["user_id"]);
       });
       ids = _.uniq(ids);
   
       const userlist = await userService.getUserInfoByIds(ids);
       let userlistid = {};
       _.forEach(userlist, function (item) {
           userlistid[item["id"]] = item;
       });
       let retpostlist = [];
       _.forEach(postlist, function (item) {
           const postuser = userlistid[item["user_id"]]
           let post = _.pick(item, ["slug", "title", "pubtime", "image", "label", "lastcommenttime"]);
           post["username"] = postuser ? postuser["username"] : "未知用户";
           post["useravatar"] = postuser?postuser["avatar"]:"";
           retpostlist.push(post);
       });
       ctx.body = util.retOk(retpostlist);
    },



}
