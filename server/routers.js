//路由文件，先用一个后面在分
const router = require('koa-router')({prefix: '/api'})
const middleware = require('./middleware')
//const controller=require('./controller')

//状态
const status=require('./controller/status')
router.get('/status',status.status);
router.get('/ping',status.ping);
  
//首页
const homeController=require("./controller/home")
router.get('/home', homeController.home);

router.post('/register', homeController.register);

router.post('/login',homeController.login);
//用户相关
const userController=require("./controller/user")
router.get('/user/info',middleware.user,userController.info);

//board相关
const boardController=require("./controller/board");
router.post('/board/newpost',middleware.user,boardController.newPost);
router.post('/board/newlink',middleware.user,boardController.newLink);
router.post('/board/newcomment',middleware.user,boardController.newComment);


//测试
router.get('/test',middleware.post);

module.exports=router;