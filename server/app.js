const Koa2 = require('koa')
const KoaBody = require('koa-body')
const jwt = require('koa-jwt')
const static = require('koa-static');
const fs = require('fs')
const path = require('path')
const db = require('./db')
const util = require('./util')
const logger = util.getLogger(__filename);
const session = require('koa-session');
//配置文件
const { setting, env } = require('./config')
//路由
const router = require('./route')
//中间件
const middleware = require('./middleware')
const app = new Koa2()
//计算页面的执行时间
app.use(middleware.responseTime);
//TODO : 异常处理放在最前面

//session设置
app.keys = [setting.token.secret];
app.use(session({
  key: 'sf_sess',   //cookie key (default is koa:sess)
  maxAge: 3600 * 1000,  // cookie的过期时间 maxAge in ms (default is 1 days)
  overwrite: true,  //是否可以overwrite    (默认default true)
  httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
  signed: true,   //签名默认true
  rolling: false,  //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
  renew: false,  //(boolean) renew session when session is nearly expired,
}, app));

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
  //开发模式可以跨域
  app.use(async (ctx, next) => {
    ctx.set('Access-Control-Expose-Headers','token');
    ctx.set('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Connection, User-Agent, Cookie, token');
    ctx.set('Access-Control-Allow-Origin', '*');
    await next();
  });
}
//静态文件
app.use(static(
  path.join(__dirname, "public")
));
//koa-body处理文件上传等,最大上传5M
app.use(KoaBody({
  multipart: true,
  formidable: {
      maxFileSize: 10*1024*1024   
  }
}));

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
  logger.info("tables:" + result[0].length)
  app.listen(setting.port, setting.host, () => {
    logger.info(`server listen at ${setting.host}:${setting.port}`)
  });
  logger.info("server start!");
});