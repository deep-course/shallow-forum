'use strict'
const { promiseMysqlPool } = require("../db");
const util = require("../util");
const logger=util.getLogger(__filename);
module.exports.up = async function (next) {
  logger.info("init");
  promiseMysqlPool.query("show tables;");
  next()
}

module.exports.down = function (next) {
  next()
}
