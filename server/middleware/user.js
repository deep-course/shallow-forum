//用户中间件，获取用户的信息
const jwt = require('jsonwebtoken');
const { setting, env } = require('../config');
const util = require('../util');
const logger=util.getLogger(__filename);
const userService = require('../service/user_service');
const moment= require("moment");
const _=require("lodash");
const userMiddleware=module.exports = {
  //获取用户信息,只获取信息,存入到state中
  async user (ctx, next) {
    const data = util.verifyToken(ctx.header.token);
    logger.debug("middleware-user:", data);
    if (data) {
      //用户信息
      const currentUser = await userService.getUserById(data.id);
      if (currentUser && !_.isEmpty(currentUser)) {
        const hash = util.md5(`${currentUser.id}|${currentUser.password}`)
        //判断hash是否一致
        if (hash == data.hash && data.iat) {
          logger.debug("middleware-user:hash验证通过");
          //判断是否过期
          const tokenTime= moment.unix(data.iat);
          logger.debug("30天过期时间:",tokenTime.add(30, 'days'));
          if (tokenTime.add(30, 'days')>moment()) {
            //token未过期
            ctx.state.user = currentUser;
            //用户分组
            const userInGroup = await userService.getUserGroup(data.id);
            if (userInGroup&& !_.isEmpty(userInGroup)) {
              ctx.state.group = userInGroup;
            }
          }

        }
      }
    }
    await next()

  },
};