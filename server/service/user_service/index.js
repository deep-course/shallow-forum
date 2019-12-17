
const moment = require("moment");
const util = require('../../util');
const logger = util.getLogger(__filename);
const { promiseMysqlPool } = require("../../db");

async function getUserByName(username) {
    const [rows, fields] = await promiseMysqlPool.query("select * from user_user where username=?", [username]);
    return rows[0];
}
async function getUserActivityById(id) {
    const [rows, fields] = await promiseMysqlPool.query("select * from user_activity where user_id=?", [id]);
    return rows[0];
}
async function getUserBySlug(slug) {
    const [rows, fields] = await promiseMysqlPool.query("select * from user_user where slug=?", [slug]);
    return rows[0];
}
async function getUserById(id) {
    const [rows, fields] = await promiseMysqlPool.query("select * from user_user where id=?", [id]);
    return rows[0];
}
async function getUserByPhone(id) {
    const [rows, fields] = await promiseMysqlPool.query("select * from user_user where phone=?", [id]);
    return rows[0];
}
async function getUserByEmail(id) {
    const [rows, fields] = await promiseMysqlPool.query("select * from user_user where email=?", [id]);
    return rows[0];
}
async function getUserInfoById(id) {
    const [rows, fields] = await promiseMysqlPool.query("select * from user_userinfo where user_id=?", [id]);
    return rows;
}
async function getUserGroup(id) {
    const [rows, fields] = await promiseMysqlPool.query("SELECT * FROM user_group WHERE id in(select group_id from user_useringroup where  user_id=?)", [id]);
    return rows;
}
async function getUserBoard(id) {
    const [rows, fields] = await promiseMysqlPool.query("SELECT * FROM board_board WHERE id in(select board_id from user_userinboard where  user_id=?)", [id]);
    return rows;
}
async function updateUserLoginTime(id, ip) {
    const [rows, fields] = await promiseMysqlPool.query("update user_activity set lastlogintime=?,logincount=logincount+1,lastvisitip=? where user_id=?", [moment().toDate(), ip, id]);
    return rows;
}
async function updateUserActionTime(id, ip) {
    const [rows, fields] = await promiseMysqlPool.query("update user_activity set lastactiontime=?,lastvisitip=? where user_id=?", [moment().toDate(), ip, id]);
    return rows;
}
async function insertUser(phone, username, password, ip) {
    const now = moment();
    const conn = await promiseMysqlPool.getConnection();
    conn.beginTransaction();
    let insertuserid = 0
    try {
        logger.debug("insertUser:user_user");
        const insertresult = await promiseMysqlPool.query("insert ignore into user_user set ?", {
            username: username,
            slug: util.getUuid(),
            email: '',
            phone: phone,
            activate: 1,
            password: util.sha256(password),
            jointime: now.toDate(),
            bio: '',
            lock: 0,
            ip: ip,
            avatar:"/avatar.png",
        });
        insertuserid = insertresult[0].insertId;
        if (insertuserid == 0) {
            throw "插入user_suer错误";
        }
        logger.debug("insertUser:user_activity");
        await promiseMysqlPool.query("insert into user_activity set?", {
            user_id: insertuserid,
            lastactiontime: now.toDate(),
            lastlogintime: now.toDate(),
            logincount: 0,
            postcount: 0,
            commentcount: 0,
            lastvisitip: ip
        });
        await conn.commit();
        logger.debug("insertUser done");

    } catch (error) {
        logger.error(error)
        conn.rollback();
        return 0;
    }
    finally {
        conn.release()
    }
    return insertuserid;

}
//生成短信token
async function genSmsToken(phone, type) {
    //token,30分钟内有效
    const token = util.randomString(6);
    const now = moment();

    try {
        const insertresult = await promiseMysqlPool.query("insert into user_token set ?", {
            key: phone,
            token: token,
            type: type,
            addtime: now.toDate(),
            expirestime: now.add(30, 'm').toDate()
        });
        return token;
    } catch (error) {
        logger.error(error);
        return '';
    }



}
//查找数据库中的token，并返回
async function getTokenByPhone(phone, type) {
    const expirestime = moment().toDate();
    const [rows, fields] = await promiseMysqlPool.query("select * from user_token where `key`=? and `type`=? and expirestime>=? order by id desc limit 1",
        [phone, type, expirestime]);
    return rows[0];

}
//获取根据用户ids获取列表
async function getUserInfoByIds(ids) {
    const [rows, fields] = await promiseMysqlPool.query("select * from user_user where id in(?)", [ids]);
    return rows;

}
//更新用户信息
async function changePassword(uid, password) {
    await promiseMysqlPool.execute("update user_user set password=? where id=?", [
        password,
        uid
    ]);
}
async function updateUserBio(uid, bio) {
    await promiseMysqlPool.execute("update user_user set bio=? where id=?", [
        bio,
        uid
    ]);
}
async function updateAvatar(uid, url) {
    await promiseMysqlPool.execute("update user_user set avatar=? where id=?", [
        url,
        uid
    ]);
}
module.exports = {
    getUserByName,
    getUserActivityById,
    getUserBySlug,
    getUserById,
    getUserByPhone,
    getUserByEmail,
    getUserInfoById,
    getUserGroup,
    updateUserLoginTime,
    updateUserActionTime,
    insertUser,
    genSmsToken,
    getTokenByPhone,
    getUserInfoByIds,
    changePassword,
    updateUserBio,
    updateAvatar,
    getUserBoard
}