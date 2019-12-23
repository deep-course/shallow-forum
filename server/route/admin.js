const router = require('koa-router')({prefix: '/admin'})

router.get('/', async function (ctx) {
    let title = 'admin'
    await ctx.render('index', {
      title,
    })
}
);

module.exports=router