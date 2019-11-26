'use strict'
const {promiseMysqlPool } = require("../db");
const util = require("../util");
const logger = util.getLogger(__filename);
module.exports.up = async function (next) {
  logger.info("insert user_user");
  await promiseMysqlPool.query("INSERT INTO `user_user` \
 (`id`, `slug`,`username`, `email`, `phone`, `activate`, `password`, `jointime`, `bio`, `lock`, `ip`) VALUES \
(1, 'tant','tant', 'dc@deep-course.com', '13800138000', 1, '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2019-05-01 10:00:00', '', 0, '');")
  logger.info("insert user_activity");
  await promiseMysqlPool.query("INSERT INTO `user_activity` \
(`user_id`, `lastactiontime`, `lastlogintime`, `logincount`, `postcount`, `commentcount`, `lastvisitip`) VALUES \
(1, '2019-05-08 16:28:14', '2019-11-13 14:39:44', 6, 8, 0, '');");
  logger.info("insert user_group");
  await promiseMysqlPool.query("INSERT INTO `user_group` (`id`, `name`, `color`) VALUES \
	(1, '管理员', ''), \
	(2, '版主', ''), \
	(3, '嘉宾', '');");
  logger.info("insert board_tag");
  await promiseMysqlPool.query("INSERT INTO `board_tag` \
  (`id`, `name`, `type`, `slug`, `info`, `color`) VALUES \
	(1, '测试tag', 'main', 'test', '测试的tag', ''), \
	(2, '子tag', 'sub', 'tag1', '目前没有区分子tag', '');");
  logger.info("insert board_tagactivity");
  await promiseMysqlPool.query("INSERT INTO `board_tagactivity` \
   (`tag_id`, `lastdposttime`, `lastcommenttime`, `lastpost_id`, `lastcommentpost_id`, `postcount`) VALUES \
	(1, '2019-05-08 15:25:29', '2019-05-08 15:25:29', 3, 0, 4), \
  (2, '2019-05-08 15:50:42', '2019-05-08 15:50:42', 7, 0, 6);");
  logger.info("initdata done");
  //next()
}

module.exports.down = function (next) {
  next()
}
