
const router = require('koa-router')()
const status=require('../controller/status')
router.get('/status',status.status);
router.get('/',status.ping);
module.exports=router