
const os=require('os');
module.exports={
    status:async function(ctx,next) {
        ctx.body={
            totalmem:os.totalmem(),
            freemem:os.freemem(),
            cpu:os.cpus()
        }
    },
    ping:async function (ctx,next){
        ctx.body = 'ok'
    }
}