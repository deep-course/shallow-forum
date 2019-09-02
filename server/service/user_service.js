const { promiseMysqlPool } = require("../db");
const moment=require("moment");
module.exports={
    getUserByName:async function(username){
        const [rows,fields]= await promiseMysqlPool.query("select * from user_user where username=?", [username]);
        return rows[0];
    },
    getUserById:async function(id){
        const [rows,fields]= await promiseMysqlPool.query("select * from user_user where id=?", [id]);
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
}