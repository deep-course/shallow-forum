
const os=require('os');
module.exports={
    async status(ctx,next) {

        ctx.body={
            totalmem:os.totalmem(),
            freemem:os.freemem(),
            memoryUsage:process.memoryUsage(),
            cpu:os.cpus()
        }
    },
    async ping (ctx,next){
        ctx.body = 'ok'
    }
}