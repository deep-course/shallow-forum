const { promiseMysqlPool } = require("../../db");
const util = require("../../util");
const logger = util.getLogger(__filename);
const _ = require('lodash');
const _3rd_service = require("../3rd_service");
const moment = require("moment");

//更新post
async function editPost(post, content, imagelist) {
    logger.debug("editPost :", post, content, imagelist);
    const conn = await promiseMysqlPool.getConnection();
    try {

        await conn.beginTransaction();
        //更新post
        await conn.query("update `board_post` set `title`=?,`label`=?,`mainimage`=? where slug=?",
            [
                post["title"],
                post["label"],
                post["mainimage"],
                post["slug"]
            ]);
        //更新comment 
        await conn.query("update `board_comment` set content=?,edituser_id=?,edittime=? where id=?", [
            content["content"],
            content["edittime"],
            content["edituser_id"],
            content["comment_id"]
        ]);


        //TODO：检查图片，是否存在，不存在的要删掉
        await conn.commit();
        return true;

    } catch (error) {
        logger.error("editPost error:", error);
        return false;
    }
    finally {
        await conn.release()

    }
}

//添加post内容，link和comment
async function addPost(post, content, tags, imagelist) {
    logger.debug("addPost :", post, content, tags, imagelist);
    const conn = await promiseMysqlPool.getConnection()
    const slug = util.getUuid();
    let insertpostid = 0;
    try {
        await conn.beginTransaction();
        post.slug = slug;
        //插入 board_post
        const postresult = await conn.query("insert into board_post set ?", post);
        const postinsertid = postresult[0].insertId;

        //插入 board_postacticity
        const postacticity = {
            post_id: postinsertid,
            lastcommentuser_id: 0,
            lastcomment_id: 0,
            upcount: 0,
            lastuptime: post.pubtime,
            lastcommenttime: post.pubtime,
            commentcount: 0,
        };
        await conn.query("insert into board_postacticity set ?", postacticity);
        //插入 board_comment
        //连接
        const commentcontent = {
            post_id: postinsertid,
            user_id: post.user_id,
            addtime: post.pubtime,
            type: content.type,
            edituser_id: 0,
            edittime: post.pubtime,
            ip: content.ip,
            approve: 1,
            deleted: content.deleted
        };
        //判断是不是链接
        if (content.type == "link") {
            const linkcontent = _.pick(content, ['content', 'url']);
            commentcontent.content = JSON.stringify(linkcontent);
        } else {
            commentcontent.content = content.content;
        }
        //TODO: 如何确认重复
        const commentresult = await conn.query("insert ignore into board_comment set ?", commentcontent);
        //更改图片关联信息
        if (imagelist) {
            for (let index = 0; index < imagelist.length; index++) {
                const element = imagelist[index];
                await conn.query("update board_postimage set post_id=? where post_id=0 and filename=? and user_id=?", [
                    postinsertid, element, post.user_id
                ]);

            }
        }

        //更新 board_post commentid
        await conn.query("update board_post set comment_id=? where id=?", [commentresult[0].insertId, postinsertid]);
        //tag列表在验证时已经确认了，所以不需要再次验证
        //const tagidlist = await conn.query("select id from board_tag where slug in (?)", [tags]);
        //logger.debug("tag",tagidlist);
        tags.forEach(async (tag) => {
            //插入 board_postintag
            await conn.query("insert ignore into board_postintag set ? ", {
                post_id: postinsertid,
                tag_id: tag.id
            });
            //更新 board_tagactivity
            await conn.query("update board_tagactivity set lastdposttime=?,lastpost_id=?,postcount=postcount+1 where tag_id=?",
                [post.pubtime,
                    postinsertid,
                tag.id]
            );

        });

        //更新用户活跃 user_activity
        await conn.query("update user_activity set postcount=postcount+1,lastactiontime=? where user_id=?", [post.pubtime, post.user_id]);

        //确认提交
        insertpostid = postinsertid;
        await conn.commit();
        logger.debug("addPost done");
    } catch (error) {
        logger.error("addPost rollback:", error)
        conn.rollback();
    }
    finally {
        conn.release();
    }
    return {
        id: insertpostid,
        slug: slug
    };

}

//根据slug获取单个tag
async function getTagBySlug(tags) {
    if (tags.length == 1) {
        tags[1] = tags[0];
        tags[0] = "";
    }
    const [taglist] = await promiseMysqlPool.query("select * from board_tag where tagpath=? and slug=?", tags);
    return taglist;
}
//获取论坛所有设置的标签列表
async function getBuildInTagList() {
    const [taglist] = await promiseMysqlPool.query("select * from board_tag where `type` in ('main','sub')");
    return taglist;

}
//添加评论内容
async function addComment(comment, post) {
    logger.debug("addComment :", comment)
    const conn = await promiseMysqlPool.getConnection();
    let insertcommentid = 0
    conn.beginTransaction();
    try {
        //新建回复
        const commentresult = await conn.query("insert into board_comment set ?", comment);
        const commentinsertid = commentresult[0].insertId;
        if (commentinsertid == 0) {
            throw "插入错误";
        }
        //更新 board_postacticity
        await conn.query("update board_postacticity set lastcommentuser_id=?,lastcomment_id=?,lastcommenttime=?,commentcount=commentcount+1 where post_id=?", [
            comment.user_id,
            commentinsertid,
            comment.addtime,
            post.id,
        ]);
        //更新 board_tagactivity
        await conn.query(`
update board_tagactivity set
lastcommenttime=?,
lastcommentpost_id=?
where tag_id in
(
select tag_id from board_postintag where post_id=?
)`, [
            comment.addtime,
            post.id,
            post.id,
        ]);


        //更新 user_activity
        await conn.query("update user_activity set lastactiontime=?,commentcount=commentcount+1 where user_id=?", [
            comment.addtime,
            comment.user_id,
        ]);
        //确认提交
        insertcommentid = commentinsertid;
        await conn.commit();
        logger.debug("addComment done");

    } catch (error) {
        logger.error("addComment rollback:", error)
        conn.rollback();
    }
    finally {
        conn.release()
    }
    return {
        id: insertcommentid,
        slug: post.slug
    };


}
//更新comment
async function updateComment(comment) {
    logger.debug("updateComment :", comment);
    const result = await promiseMysqlPool.execute("update board_comment set content=?,edittime=?,edituser_id=? where id=?", [
        comment["content"],
        comment["edittime"],
        comment["edituser"],
        comment["id"]
    ]);
    //logger.debug(result)
    return true;
}
//获取post
async function getPostBySlug(slug) {
    const [post] = await promiseMysqlPool.query("select * from board_post where slug=?", [slug]);
    return post[0];
}
async function getPostById(id) {
    const [post] = await promiseMysqlPool.query("select * from board_post where id=?", [id]);
    return post[0];
}
//获取board
async function getBoardBySlug(slug) {
    const [board] = await promiseMysqlPool.query("select * from board_tag where slug=?", [slug]);
    return board[0];
}
//保存上传的文件
async function saveFile(filepath, format, userid, postid) {
    const filename = "upload/" + util.getUuid() + "." + format;
    const hash = util.getFileMd5(filepath);
    //保存文件
    saveresult = await _3rd_service.saveFile(filepath, filename);
    logger.debug("save to store done");
    if (saveresult) {
        await promiseMysqlPool.query("insert into board_postimage set ?", {
            filename: saveresult,
            hash: hash,
            post_id: postid,
            user_id: userid,
            addtime: moment().toDate()
        });
        logger.debug("save to db done");

    }
    else {
        logger.error("saveFile error : ", filename);

    }
    logger.debug("return:", saveresult);
    return saveresult;

}
async function getAllFile(userid, postid) {
    const result = await promiseMysqlPool.query("select * from board_postimage where user_id=? and post_id=?",
        [userid, postid]);
    let retresult = [];
    result[0].forEach(element => {
        retresult.push(element["filename"]);
    });
    return retresult;
}
async function getImageInfo(fileurl) {
    logger.debug("getImageInfo:", fileurl);
    const [result] = await await promiseMysqlPool.query("select * from board_postimage where filename=?",
        [fileurl]);
    return result[0];
}
async function deleteFile(fileinfo) {
    logger.debug("deleteFile:", fileinfo);
    //删除文件
    const result = await _3rd_service.deleteFile(fileinfo["filename"]);
    if (result) {
        try {
            await promiseMysqlPool.query("delete from board_postimage where id=?", [
                fileinfo["id"]
            ]);
            return true;
        } catch (error) {
            logger.error("deleteFile error: ", error);
            return false;
        }

    }
    else {
        return false;
    }

}
async function getCommentById(id) {
    logger.debug("getCommentById:", id);
    const [result] = await promiseMysqlPool.query("select * from board_comment where id=?",
        [id]);
    return result[0];
}
async function deleteComment(id) {
    //逻辑删除
    const result = await promiseMysqlPool.query("update board_comment set deleted=1 where id=?", [id]);
    return true;

    //TODO:更新board_postacticity

}
async function deletePost(id) {
    const result = await promiseMysqlPool.execute("update board_post set deleted=1 where id=?", [id]);
    return true;
}
async function checkUpHistory(pid, uid) {
    const [result] = await promiseMysqlPool.query("select count(*) as c from board_useruppost where user_id=? and post_id=?", [
        uid, pid
    ]);
    logger.debug(result[0]);
    return result[0]["c"] > 0 ? true : false;

}
async function upPost(pid, uid) {
    logger.debug("upPost:");
    const conn = await promiseMysqlPool.getConnection();
    await conn.beginTransaction();
    try {
        //更新对应关系
        await conn.query("insert ignore into `board_useruppost` set ?", {
            user_id: uid,
            post_id: pid,
            addtime: moment().toDate()
        });
        //更新帖子
        await conn.query("update `board_postacticity` set `upcount`=`upcount`+1, `lastuptime`=?where `post_id`=? ", [
            moment().toDate(),
            pid
        ]);
        await conn.commit();
        return true;

    } catch (error) {
        logger.error("upPost:", error);
        await conn.rollback();
        return false;

    }
    finally {
        await conn.release();
    }

}
async function getCommentListByPostId(postid, page) {
    logger.debug("getCommentListByPostId:", postid);
    const offset = (page - 1) * 20;
    const [result] = await promiseMysqlPool.query("select * from board_comment where post_id=? and `deleted`=0 and `approve`=1 and `type`='comment' order by  id desc limit ?,20",
        [
            postid, offset
        ])
    return result;
}
async function getPostListbyTagId(tagid, page, sort, board) {
    logger.debug("getPostListbyTags:", tagid, page, sort);
    const offset = (page - 1) * 20;
    const sql = `SELECT p.*,a.* FROM board_post AS p 
        LEFT JOIN board_postintag AS t ON p.id = t.post_id 
        LEFT JOIN board_postacticity AS a ON p.id=a.post_id 
        WHERE t.tag_id=?  and p.deleted=0 and p.\`type\`="post"
        and p.board_id=?
        order by ${sort == 1 ? "p.id" : "a.lastcommenttime"} desc
        limit ?,20 
        `;
    const [postlist] = await promiseMysqlPool.query(sql, [
        tagid,
        board,
        offset
    ]);
    return postlist;

}
async function getPostListByUserId(postid, page) {
    const offset = (page - 1) * 20;
    const [result] = await promiseMysqlPool.query(`
        SELECT p.*,a.* FROM board_post AS p
        LEFT JOIN board_postacticity AS a ON p.id=a.post_id
        WHERE p.user_id=? and p.deleted=0 and p.\`type\`="post"
        order by p.id desc
        limit ?,20
        `,
        [
            postid, offset
        ])
    return result;

}
async function getPostListByUserUp(postid, page) {
    const offset = (page - 1) * 20;
    const [result] = await promiseMysqlPool.query(`
        SELECT p.*,a.* FROM board_post AS p
        LEFT JOIN board_postacticity AS a ON p.id=a.post_id
        inner JOIN board_useruppost u ON p.id=u.user_id
        WHERE p.user_id=? and p.deleted=0 and p.\`type\`="post"
        order by p.id desc
        limit ?,20
        `,
        [
            postid, offset
        ])
    return result;
}
async function getTagListByPostId(postid) {
    const [result] = await promiseMysqlPool.query("SELECT * FROM board_tag WHERE id IN (SELECT  tag_id FROM board_postintag WHERE post_id=?)", [postid]);
    return result;
}
async function getHomePostList(page, sort, board) {
    const offset = (page - 1) * 20;
    const sql = `SELECT p.*,a.* FROM board_post AS p 
        LEFT JOIN board_postacticity AS a ON p.id=a.post_id 
        WHERE p.deleted=0 and p.\`type\`="post" and p.board_id=?
        order by ${sort == 1 ? "p.id" : "a.lastcommenttime"} desc
        limit ?,20 
        `;
    const [postlist] = await promiseMysqlPool.query(sql, [
        board,
        offset
    ]);
    return postlist;
}
//判断用户group和board进行比对，返回是否与权限
async function checkBoardPermission(board_id, boardlist) {
    logger.debug(board_id, boardlist);
    if (boardlist) {
        const board = _.filter(boardlist, function (o) { return o["id"] == board_id; });
        if (board.length == 0) {
            return false;
        }
        else {
            return true;
        }
    } else if (board_id == 0) {
        return true;
    } else {
        return false;
    }
}
async function getActivityByPostId(postid){
    const [result] = await promiseMysqlPool.query("SELECT * FROM board_postacticity WHERE post_id=?", [postid]);
    return result[0];
}
//根据slug列表获取相应的tag列表
async function getTagListBySlugs(slugs)
{
    logger.info(slugs);
    const [result] = await promiseMysqlPool.query("SELECT * FROM board_tag WHERE slug IN (?)", [slugs]);
    return result;
    
}
module.exports = {
    editPost,
    addPost,
    getTagBySlug,
    getTagListBySlugs,
    addComment,
    updateComment,
    getPostBySlug,
    getPostById,
    getBoardBySlug,
    saveFile,
    getAllFile,
    getImageInfo,
    deleteFile,
    getCommentById,
    deleteComment,
    deletePost,
    checkUpHistory,
    upPost,
    getCommentListByPostId,
    getPostListbyTagId,
    getPostListByUserId,
    getPostListByUserUp,
    getBuildInTagList,
    getTagListByPostId,
    getHomePostList,
    checkBoardPermission,
    getActivityByPostId,
}