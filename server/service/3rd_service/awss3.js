const fs = require('fs');
const url = require('url');
const util = require('../../util');
const logger = util.getLogger(__filename);
const AWS = require('aws-sdk');
const ID = '';
const SECRET = '';
const BUCKET_NAME = '';
const REGION='';


async function put(local, aws) {
    const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET,
        region: REGION
    });
    try {
        const fileContent = fs.readFileSync(local);
        const params = {
            Bucket: BUCKET_NAME,
            Key: aws,
            Body: fileContent
            //ACL: 'public-read'
        };
        const result = await s3.upload(params).promise();
        logger.debug(result);
        return result.Location;
    } catch (error) {
        logger.error('aws upload err:', error);
        return "";
    }
}
async function del(aws) {
    const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET,
        region: REGION
    });
    try {
        const aswpath=url.parse(aws);
        const awsurl=aswpath.path.substring(1);
        const params = {
            Bucket: BUCKET_NAME,
            Key: awsurl,
        };
        logger.debug(params);

        const result = await s3.deleteObject(params).promise();
        logger.debug(result);
        return true
    } catch (error) {
        logger.error('aws del err:', error);
        return false;
    }
}
module.exports = {
    put,
    del,
}