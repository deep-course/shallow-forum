import path from 'path'
//koa
import Koa from 'koa' 
import router from './router'
import static_ from 'koa-static'
import views from 'koa-views'
const app = new Koa()
//静态文件(编译后的文件位置，SSR前后端共享)
app.use(static_(path.join(__dirname , '../build')))
// 加载模板引擎,必须再路由之前
app.use(views(path.join(__dirname, './view'), {
  extension: 'ejs'
}))
//路由
app.use(router.routes())
//代理
const proxy = require('koa2-proxy-middleware');
const proxyOptions = {
  target: 'http://103.61.38.127', //后端服务器地址
  changeOrigin: true //处理跨域
};
const exampleProxy = proxy('/api/*', proxyOptions); //api前缀的请求都走代理
app.use(exampleProxy); //注册

app.listen(3000, () => {
  console.log('This server is running at http://localhost:' + 3000)
})