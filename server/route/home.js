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
 * 使用getpost过滤
 * @apiUse ReturnCode
 * @apiUse HeaderToken
 */
router.get('/home', ret);

module.exports=router
function ret(ctx,next){
    ctx.body=
        {
            err: 0,
            msg: "ok"
        }
}