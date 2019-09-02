//通过路径创建controller对象

/**
* @apiDefine user 用户
*/
/**
* @apiDefine home 首页
*/
/**
* @apiDefine board 论坛
*/


const util = require('../util');
const fs=require('fs');
module.exports=function(path){
    return require('./'+path);
        console.log(path);
}
