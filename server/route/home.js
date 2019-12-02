const router = require('koa-router')()
const homeController=require("../controller/home")

router.get('/home', ret);

module.exports=router
function ret(ctx,next){
    ctx.body=
        {
            err: 0,
            msg: "ok"
        }
}