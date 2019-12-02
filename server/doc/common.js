/**
 * @apiDefine ReturnCode
 * @apiSuccess (成功) {Number} err 0表示成功
 * @apiSuccess (成功) {String} msg 成功永远返回ok
 * @apiSuccess (成功) {Object} data 服务器端返回结果
 * @apiError (失败) {Number} err err不为0表示失败
 * @apiError (失败) {String} msg 失败的错误信息 
 * @apiError (失败) {Object} data 没有data项
 * 
 */ 
 /**
 * 
 * @apiDefine HeaderToken
 * @apiHeader (用于验证的HTTP头) {String} token 认证的token
 * 
 * 
 */