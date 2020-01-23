const fs = require('fs');
const url = require('url');
const util = require('../../util');
const logger = util.getLogger(__filename);
const AWS = require('aws-sdk');
const ID = '';
const SECRET = '';
const BUCKET_NAME = '';
const REGION='';
const DOMAIN='';

async function put(local, aws) {
    const s3 = new AWS.S3({
        accessKeyId: ID,
        secretAccessKey: SECRET,
        region: REGION
    });
    try {
        const fileContent = fs.readFileSync(local);
        let extn = aws.split('.').pop().toLowerCase();
        let contentType = 'application/octet-stream';
        if (extn == 'png' || extn == 'jpg' || extn == 'gif'||extn == 'jpeg') 
            contentType = "image/" + extn;
        const params = {
            Bucket: BUCKET_NAME,
            Key: aws,
            Body: fileContent,
            ContentType: contentType,
            //ACL: 'public-read'
            
        };
        const result = await s3.upload(params).promise();
        logger.debug(result);
        if (DOMAIN.length>0)
        {
            return DOMAIN+result.key;
        }
        else
        {
            return result.Location;
        }
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
