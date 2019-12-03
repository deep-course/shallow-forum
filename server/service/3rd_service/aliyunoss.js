
const util = require('../../util');
const logger = util.getLogger(__filename);
const OSS = require('ali-oss');
const url = require('url')
const OSS_SETTING={
    region: 'oss-cn-beijing',
    accessKeyId: '',
    accessKeySecret: '',
    bucket: ''
};
async function put(local, oss) {
    const client = new OSS(OSS_SETTING);
    try {
        const result = await client.put(oss, local);
        return result.url;
    } catch (error) {
        logger.error('OSS put err:', error);
    }
}
async function del(oss) {
    const client = new OSS(OSS_SETTING);
    try {
        const osspath=url.parse(oss);
        const result = await client.delete(osspath.path);
        logger.debug(result);
        return true;
    } catch (error) {
        logger.error('OSS del err:', error);
    }
}
module.exports = {
    put,
    del,
}