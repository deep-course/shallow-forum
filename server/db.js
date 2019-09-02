const mysql = require('mysql2');
const { setting} = require('./config')
const mysqlPool = mysql.createPool(setting.mysql);  
const promiseMysqlPool = mysqlPool.promise();
module.exports={mysqlPool,promiseMysqlPool};