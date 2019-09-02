const path=require('path');
const env = (process.env.NODE_ENV || 'development').toLowerCase();
const file = path.resolve(__dirname, env);
module.exports.env= env;
try {
    module.exports.setting = require(file);
    console.log('Load config: [%s] %s', env, file);
} catch (err) {
    console.error('Cannot load config: [%s] %s', env, file);
    throw err;
}
