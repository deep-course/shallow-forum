//路由文件，先用一个后面在分
const util=require('./util')
const router = require('koa-router')({prefix: '/api'})
const middleware = require('./middleware')
//const controller=require('./controller')
const u= require('./service/user_service')

//状态
const status=require('./controller/status')
router.get('/status',status.status);
router.get('/ping',status.ping);
  
//首页
const homeController=require("./controller/home")
router.get('/home', homeController.home);


//用户相关
const userController=require("./controller/user");
router.get('/user/info',middleware.user,userController.info);
router.post('/register', userController.register);
router.post('/login',userController.login);
router.get('/captcha',userController.captcha);
router.post('/sendsmscode',userController.smscode);

//board相关
const boardController=require("./controller/board");
router.post('/board/newpost',middleware.user,boardController.newPost);
router.post('/board/newlink',middleware.user,boardController.newLink);
router.post('/board/newcomment',middleware.user,boardController.newComment);
router.get('/board/getpost/:postslug',middleware.user,middleware.post,boardController.getPostInfo);

//测试
router.get('/test',async function(ctx){
    //ctx.body=ctx.session;
    const token=await u.getTokenByPhone('18612733663')
    //console.log(token)
    ctx.body=token;
});
//测试


module.exports=router;