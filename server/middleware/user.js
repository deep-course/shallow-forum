//用户中间件，获取用户的信息
const jwt = require('jsonwebtoken');
const { setting, env } = require('../config');
const util = require('../util');
const logger = util.getLogger(__filename);
const userService = require('../service/user_service');
const moment = require("moment");
const _ = require("lodash");
async function getUser(ctx, next) {
  const data = util.verifyToken(ctx.header.token);
  logger.debug("middleware-user:", data);
  if (data) {
    //用户信息
    let currentUser = await userService.getUserById(data.id);
    if (currentUser && !_.isEmpty(currentUser)) {
      const hash = util.md5(`${currentUser.id}|${currentUser.password}`);
      //判断hash是否一致
      logger.warn(hash,data);
      if (hash == data.hash && data.iat) {
        logger.debug("middleware-user:hash验证通过");
        //判断是否过期
        const tokenTime = moment.unix(data.iat);
        logger.debug("30天过期时间:", tokenTime.add(30, 'days'));
        if (tokenTime.add(30, 'days') > moment()) {
          //token未过期
          //设置用户头像
          ctx.state.currentuser = currentUser;
          //用户分组,取最小的组，id小权限大，但是0 为普通用户
          const userInGroup = await userService.getUserGroup(data.id);
          let group={
            id:0,
            name:"普通用户",
            color:""
          };

          if (userInGroup && !_.isEmpty(userInGroup)) {
           const userGroup =_.sortBy(userInGroup,(item)=>{
              return item.id;
            });
            group=userGroup[0];       
          }
          ctx.state.group = group;
          //获取用户board
          const userInBoard = await userService.getUserBoard(data.id);
          let boards=[];
          userInBoard.forEach(element => {
            boards.push(element["id"]);
          });
          if (boards.length==0){
            boards.push(0);
          }
          ctx.state.board = boards;

        }

      }
    }
  }
  await next()

}
async function checkUser(ctx, next) {
    const { currentuser } = ctx.state;
    if (!currentuser || _.isEmpty(currentuser)) {
        ctx.body = util.retError(-11, "请先登录")
        return;
    }
    if (currentuser['lock'] == 1) {
        ctx.body = util.retError(-12, "用户已被锁定")
        return;
    }
    await next();
}
module.exports = {
  //从header中获取相应的token并且判断
  //如果登录正常，用户信息保存到ctx.state.user中
  getUser,
  //判断ctx.state.user中的信息确定用户是否登录
  //并判断用户状态，lock状态的不算登录
  checkUser,

};