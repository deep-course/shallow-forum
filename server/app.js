const Koa2 = require('koa')
const KoaBody = require('koa-body')
const jwt = require('koa-jwt')
const static = require('koa-static');
const fs = require('fs')
const path = require('path')
const db = require('./db')
const util= require('./util')
const logger=util.getLogger(__filename);
//配置文件
const { setting, env } = require('./config')
//路由
const router = require('./routers')
//中间件
const middleware = require('./middleware')
const app = new Koa2()
//计算页面的执行时间
app.use(middleware.responseTime);
//TODO : 异常处理放在最前面



//开发日志
if (env === 'development') {
  app.use((ctx, next) => {
    logger.warn(`${ctx.method} ${ctx.url} - start`)
    const start = new Date()
    return next().then(() => {
      const ms = new Date() - start
      logger.warn(`${ctx.method} ${ctx.url} ${ctx.status}  -  end ${ms}ms`)
    })
  })
}
//静态文件
app.use(static(
  path.join(__dirname, "public")
));
//koa-body处理文件上传等
app.use(KoaBody());

//路由
app.use(router.routes(), router.allowedMethods())
//错误处理
app.on("error", (err, ctx) => {//捕获异常记录错误日志
  logger.error(err)
});
//启动
logger.info('test db connect')
db.promiseMysqlPool.query("show tables").then((result, err) => {
  if (err) {
    loger.error(err)
    process.exit(1)
  }
  logger.info("tables:"+result[0].length)
  app.listen(setting.port, setting.host, () => {
    logger.info(`server listen at ${setting.host}:${setting.port}`)
  });
  logger.info("server start!");
});