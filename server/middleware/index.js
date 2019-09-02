const user = require("./user");
const board = require("./board");
async function responseTime(ctx, next) {
  const started = Date.now()
  await next()
  const ellapsed = (Date.now() - started) + 'ms'
  ctx.set('X-ResponseTime', ellapsed)
}

module.exports = {
  responseTime,
  ...user,
  ...board,
};