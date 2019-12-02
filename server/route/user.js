const router = require('koa-router')()
const userController = require("../controller/user");
const middleware = require('../middleware')

router.get('/user/info', 
middleware.getUser,
userController.userInfo);

router.post('/register', userController.register);

router.post('/login', userController.login);

router.get('/captcha', userController.captcha);

router.post('/sendsmscode', userController.smscode);

router.post('/resetpassword', userController.resetPassword);

router.post('/resetpassword2', userController.resetPassword2);

router.get('/user/detail', 
middleware.getUser,
middleware.checkUser,
userController.getUserDetail

);

router.post('/user/updatepassword', 
middleware.getUser,
middleware.checkUser,
userController.changePassword
);

router.post('/user/updatedetail', 
middleware.getUser,
middleware.checkUser,
userController.updateUserDetail
);

router.get('/user/home', userController.getHomeList);

router.get('/user/homeinfo', userController.getHomeUser);

module.exports = router
