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


app.listen(3000, () => {
  console.log('This server is running at http://localhost:' + 3000)
})