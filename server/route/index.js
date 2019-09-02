const fs = require('fs')
const router = require('koa-router')()
const controller=require('../controller')
controller.get("home");


/** 自动导入
 * const files = fs.readdirSync(__dirname)
files
    .filter(file => ~file.search(/^[^\.].*\.js$/))
    .forEach(file => {
        const file_name = file.substr(0, file.length - 3);
        const file_entity = require(path.join(__dirname, file));
        if (file_name.toLocaleLowerCase() !== 'index') {
            rootRoute.use(`/${file_name}`, file_entity.routes(), file_entity.allowedMethods())
            console.log(`/${file_name}`)
        }
    })
*/  
//首页相关
//首页
//router.use('/',homeController.home);
//状态
const status=require('./status')
router.use('/status',status.routes(), status.allowedMethods())
//用户
const user=require('./user')
router.use('/user',user.routes(), user.allowedMethods())
module.exports = router
