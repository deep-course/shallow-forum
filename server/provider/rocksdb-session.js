const level = require('level-rocksdb');
const util = require('../util');
const logger = util.getLogger(__filename);
const path=require('path');
const db = level(path.join(__dirname,'../session'));
logger.info("session provider: rocksdb");
async function get(key) {
    try {
        const value = await db.get(key);
        return value;
    } catch (error) {
        logger.debug("未找到session:",error);
    }
    return "";

}
async function put(key, value) {
    try {
        await db.put(key, value);
        return true;
    } catch (error) {
        logger.error("插入错误");
        return false;
    }


}
module.exports = {
    put,
    get
}