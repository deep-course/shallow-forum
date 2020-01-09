const Koa = require('koa')
const next = require('next')
const Router = require('koa-router')
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const server = new Koa()
const router = new Router({ strict: true })
const fs= require('fs');


let pagelist = fs.readdirSync("pages");
pagelist=pagelist.filter(file => ~file.search(/^[^\.].*\.js$/))
.filter(file=>file.substr(0,1)!="_")
.map(item=>item.substr(0,item.length-3));

//测试反向代理
if (dev) {
    const proxy = require('koa2-proxy-middleware');
    const options = {
        targets: {
            '/api/(.*)': {
                target: 'http://shu-test.deephub.ai',//'http://localhost:3001',//
                changeOrigin: true,
            }
        }
    }
    server.use(proxy(options))
}

//所有页请求都返回200
server.use(async (ctx, next) => {

    ctx.res.statusCode = 200

    await next()

  })
//首页
router.get('/', async ctx => {
    await app.render(ctx.req, ctx.res, '/index')
    ctx.respond = false
})
//登录
router.get('/login', async ctx => {
    await app.render(ctx.req, ctx.res, '/login', ctx.query)
    ctx.respond = false
})
//设置页
router.get('/user/setting', async ctx => {
    await app.render(ctx.req, ctx.res, '/setting', ctx.query)
    ctx.respond = false
})

//写帖子页面
router.get('/write', async ctx => {
    await app.render(ctx.req, ctx.res, '/write', ctx.query)
    ctx.respond = false
})

//用户 /u/123456
router.get('/u/:slug', async ctx => {
    await app.render(ctx.req, ctx.res, '/user', ctx.params.slug)
    ctx.respond = false
})

//帖子列表 有两种可能  /t/主tag 和 /t/主tag/附tag
router.get('/t/:main', async ctx => {
    await app.render(ctx.req, ctx.res, '/list',ctx.params)
    ctx.respond = false
})
router.get('/t/:main/:sub', async ctx => {
    await app.render(ctx.req, ctx.res, '/list',ctx.params)
    ctx.respond = false
})

//帖子详情 /p/123456
router.get('/p/:slug', async ctx => {
    await app.render(ctx.req, ctx.res, '/detail', ctx.params)
})
//其他
router.get('*', async (ctx, next) => {

    //这里设置判断开发模式不走handle
    if (dev && ctx.url.startsWith('/api')) {
        console.log(ctx.url)
        await next()
    }
    else {
        const urlpath=ctx.url.substr(1);
        if (pagelist.indexOf(urlpath)>=0)
        {
            ctx.statusCode=404;
            app.render(ctx.req, ctx.res, '_error');
            ctx.respond = false
        }
        else
        {
        await handle(ctx.req, ctx.res)
        ctx.respond = false
        }
    }
    

})
app.prepare()
    .then(() => {
        server.use(router.routes())
        server.listen(port, () => {
            console.log(`> Ready on ${port}`)
        })
    })