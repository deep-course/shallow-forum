
const moment=require("moment");
const util=require('../util');
const logger = util.getLogger(__filename);
const { promiseMysqlPool } = require("../db");
module.exports={
    getUserByName:async function(username){
        const [rows,fields]= await promiseMysqlPool.query("select * from user_user where username=?", [username]);
        return rows[0];
    },
    getUserById:async function(id){
        const [rows,fields]= await promiseMysqlPool.query("select * from user_user where id=?", [id]);
        return rows[0];
    },
    getUserByPhone:async function(id){
        const [rows,fields]= await promiseMysqlPool.query("select * from user_user where phone=?", [id]);
        return rows[0];
    },
    getUserByEmail:async function(id){
        const [rows,fields]= await promiseMysqlPool.query("select * from user_user where email=?", [id]);
        return rows[0];
    },
    getUserInfoById:async function(id){
        const [rows,fields]= await promiseMysqlPool.query("select * from user_userinfo where id=?", [id]);
        return rows;
    },
    getUserGroup:async function(id){
        const [rows,fields]= await promiseMysqlPool.query("select * from user_useringroup where  user_id=?", [id]);
        return rows;
    },
    updateUserLoginTime:async function(id){
        const [rows,fields]= await promiseMysqlPool.query("update user_activity set lastlogintime=?,logincount=logincount+1 where user_id=?", [moment().toDate(),id]);
        return rows;
    },
    updateUserActionTime:async function(id){
        const [rows,fields]= await promiseMysqlPool.query("update user_activity set lastactiontime=? where user_id=?", [moment().toDate(),id]);
        return rows;
    },
    insertUser:async function(phone,username,password)
    {
        const now= moment();
        try {
            const insertresult=await promiseMysqlPool.query("insert ignore into user_user set ?",{
                username:username,
                email:'',
                phone:phone,
                activate:1,
                password:util.sha256(password),
                jointime:now.toDate(),
                bio:'',
                lock:0
            }); 
            return insertresult[0]['insertId']
        } catch (error) {
            logger.error(error)
            return 0          
        }

    },
    //生成短信token
    genSmsToken:async function (phone)
    {        
        //token,30分钟内有效
        const token=util.randomString(6);
        const now=moment();

        try {
            const insertresult=await promiseMysqlPool.query("insert into user_token set ?",{
                key:phone,
                token:token,
                type:'sms',
                addtime:now.toDate(),
                expirestime:now.add(30,'m').toDate()
            }); 
            return token;
        } catch (error) {
            logger.error(error);
            return '';
        }

 

    },
    //查找数据库中的token，并返回
    getTokenByPhone:async function(phone)
    {
        const expirestime= moment().toDate();
        const [rows,fields]= await promiseMysqlPool.query("select * from user_token where `key`=? and `type`='sms' and expirestime>=? order by id desc limit 1", [phone,expirestime]);
        return rows[0];

    },
}