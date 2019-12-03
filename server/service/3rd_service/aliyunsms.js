const Core = require('@alicloud/pop-core');
const util = require('../../util');
const logger = util.getLogger(__filename);

const REG_TEMPLATECODE = "";
const PASS_TEMPLATECODE = "";
const SIGNNAME = "";
const REGIONID="cn-hangzhou";
let params = {
    "RegionId": REGIONID,
    "SignName": SIGNNAME
}


async function sendRegisterSms(phone,token) {
    const client = new Core({
        accessKeyId: "",
        accessKeySecret: "",
        endpoint: 'https://dysmsapi.aliyuncs.com',
        apiVersion: '2017-05-25'
    });
    logger.info("sendRegisterSms:",phone,token);
    params["TemplateCode"]=REG_TEMPLATECODE;
    params["PhoneNumbers"]=phone;
    params["TemplateParam"]=JSON.stringify({"code":token});
    try {
        const result=await client.request('SendSms', params, {method: 'POST'})
        logger.info(result);
        return true 
    } catch (error) {
        logger.error(error);
        return false;
        
    }
    
    

}

async function sendPasswordSms(phone,token) {
    const client = new Core({
        accessKeyId: "",
        accessKeySecret: "",
        endpoint: 'https://dysmsapi.aliyuncs.com',
        apiVersion: '2017-05-25'
    });
    logger.info("sendPasswordSms:",phone,token);
    params["TemplateCode"]=PASS_TEMPLATECODE;
    params["PhoneNumbers"]=phone;
    params["TemplateParam"]=JSON.stringify({"code":token});
    try {
        const result=await client.request('SendSms', params, {method: 'POST'})
        logger.info(result);
        return true;
    } catch (error) {
        logger.error(error);
        return false;
    }

}

module.exports={
    sendPasswordSms,
    sendRegisterSms
}