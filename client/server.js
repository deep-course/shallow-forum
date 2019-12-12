const Koa = require('koa')
const next = require('next')
const Router = require('koa-router')
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()



app.prepare()
    .then(() => {
        const server = new Koa()
        const router = new Router()
        router.get('/', async ctx => {
            await app.render(ctx.req, ctx.res, '/index', ctx.query)
            ctx.respond = false
        })

        router.get('/login', async ctx => {
            await app.render(ctx.req, ctx.res, '/login', ctx.query)
            ctx.respond = false
        })

        router.get('*', async ctx => {
            await handle(ctx.req, ctx.res)
            ctx.respond = false
        })


        //测试反向代理
        if (dev) {
            const proxy = require('koa2-proxy-middleware');
            //测试的反向代理
            const options = {
                targets: {
                    '/api/(.*)': {
                        target: 'http://103.61.38.127',//http://localhost:3001
                        changeOrigin: true,
                    }
                }
            }
            server.use(proxy(options))
        }
        server.use(router.routes())
        server.listen(port, () => {
            console.log(`> Ready on ${port}`)
        })

    })