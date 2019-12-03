module.exports = {
    //mysql
    mysql: {
        connectionLimit: 20,
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'shu',
        multipleStatements: true
    },
    //登陆认证相关
    token:{
        secret:"deep-course"
    },
    //端口
    port: 3001,
    host: '0.0.0.0',
    //第三方服务
    sms:"aliyunsms",
    file:"aliyunoss"

};