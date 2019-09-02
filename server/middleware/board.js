const jwt = require('jsonwebtoken');
const {setting,env} = require('../config');
const util = require('../util');
const {promiseMysqlPool}=require('../db');
const logger=util.getLogger(__filename);
module.exports={
    //获取post相关信息,只获取信息
    post:async function(ctx,next){


        await next()
    },
 
    //查看权限，在controller后判断
    viewPost:async function (ctx,next){

    },
    //编辑权限，在编辑的controller前
    editPost:async function(ctx,next){

    },
    

}