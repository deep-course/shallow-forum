const { promiseMysqlPool } = require("../db");
const util = require("../util");
const logger = util.getLogger(__filename);
module.exports = {
    //添加post内容，link和comment
    addPost: async function (post, content, tags) {
        logger.debug("addPost :", post, content, tags);
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
                deleted:content.deleted
            };
            //判断是不是链接
            if (content.type == "link") {
                delete content.type;
                commentcontent.content = JSON.stringify(content);
            } else {
                commentcontent.content = content.content;
            }
            //TODO: 如何确认重复
            const commentresult = await conn.query("insert ignore into board_comment set ?", commentcontent);
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

    },
    //根据slug获取tag列表
    getTagListByName: async function (slugs) {
        const [taglist] = await promiseMysqlPool.query("select * from board_tag where slug in (?)", [slugs]);
        return taglist;
    },
    //添加评论内容
    addComment: async function (comment, post) {
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


    },
    //获取post
    getPostBySlug: async function (slug) {
        const [post] = await promiseMysqlPool.query("select * from board_post where slug=?", [slug]);
        return post[0];
    },
    //获取board
    getBoardBySlug: async function (slug) {
        const [board] = await promiseMysqlPool.query("select * from board_tag where slug=?", [slug]);
        return board[0];
    }

}