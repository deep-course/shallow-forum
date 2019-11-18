const fs = require('fs');
const path=require('path');
const router = require('koa-router');
const util=require('../util');
const logger=util.getLogger(__dirname);


let rootRoute=router({prefix: '/api'})

//自动导入路由
const files = fs.readdirSync(__dirname)
files
    .filter(file => ~file.search(/^[^\.].*\.js$/))
    .forEach(file => {
        const file_name = file.substr(0, file.length - 3);
        const router_entity = require(path.join(__dirname, file));
        if (file_name.toLocaleLowerCase() !== 'index') {
            rootRoute.use(router_entity.routes(), router_entity.allowedMethods())
            logger.info(`router loaded :`,file)
            router_entity.stack.forEach(element => {
                logger.info(element.path,element.methods);        
            });
            
        }
    })


module.exports = rootRoute
