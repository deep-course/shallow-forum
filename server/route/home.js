const router = require('koa-router')()
const homeController=require("../controller/home")

router.get('/home', homeController.home);

module.exports=router
