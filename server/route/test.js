const router = require('koa-router')()
const u = require('../service/user_service')
router.get('/test/phone', async function (ctx) {
    //ctx.body=ctx.session;
    const token = await u.getTokenByPhone('18612733663',"sms")
    //console.log(token)
    if (token)
        ctx.body = token;
    else
        ctx.body = "none";

});
module.exports = router