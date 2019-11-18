const router = require('koa-router')()
const homeController=require("../controller/home")
/**
 * 
 * @api {get} /home  首页帖子列表
 * @apiSampleRequest /api/home
 * @apiName home
 * @apiGroup home
 * @apiVersion  1.0.0
 * @apiDescription 
 * 获取首页帖子列表
 * 这个只是首页的，其他的列表和条件筛选在board里面
 * 
 * @apiUse ReturnCode
 */
router.get('/home', homeController.home);

module.exports=router