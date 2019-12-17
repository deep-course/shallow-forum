const router = require('koa-router')()
const homeController=require("../controller/home")
const middleware = require('../middleware')
router.get('/home', 
middleware.getUser,
homeController.home);

module.exports=router
