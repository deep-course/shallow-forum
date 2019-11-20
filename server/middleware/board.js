const jwt = require('jsonwebtoken');
const { setting, env } = require('../config');
const util = require('../util');
const boardService = require("../service/board_service");
const _ = require("lodash")
const logger = util.getLogger(__filename);
const boardMiddleware = module.exports = {
    //获取post相关信息,只获取信息,存入到state中
    async post(ctx, next) {
        let postslug = "";
        if (ctx.params && ctx.params.postslug) {
            //优先params
            postslug = ctx.params.postslug;

        } else if (ctx.query && ctx.query.postslug) {
            //其次get
            postslug = ctx.query.postslug;

        }
        else if (ctx.request.body && ctx.request.body.postslug) {
            //最后post
            postslug = ctx.request.body.postslug;
        }
        logger.debug("slug:", postslug)
        if (postslug) {
            const post = await boardService.getPostBySlug(postslug)
            if (post && !_.isEmpty(post)) {
                ctx.state.post = post;
            }
        }

        await next();
    },
    async board(ctx, next) {
        let boardslug = "";
        if (ctx.params && ctx.params.boardslug) {
            //优先params
            postslug = ctx.params.boardslug;

        } else if (ctx.query && ctx.query.boardslug) {
            //其次get
            postslug = ctx.query.boardslug;

        }
        else if (ctx.body && ctx.body.boardslug) {
            //最后post
            postslug = ctx.body.boardslug;
        }
        if (boardslug) {
            ctx.state.board = await boardService.getBoardBySlug(boardslug)
        }
        await next();
    },

    //查看权限，在controller后判断
    async viewPost(ctx, next) {
        //TODO：增加权限管理和管理员管理
        logger.debug("viewPost:", ctx.state);
        const { post, user } = ctx.state
        let retpost = _.assign({}, post);
        //删帖不显示
        if (retpost['deleted'] == 1) {
            ctx.body = util.retError(1, '无法找到内容');
            return;
        }
        //账号锁定不显示
        if (user && user['lock'] == 1) {
            ctx.body = util.retError(2, '用户已锁定');
            return;
        }

        delete retpost['id'];
        delete retpost['user_id'];
        delete retpost['comment_id'];
        delete retpost['approve'];
        delete retpost['deleted'];
        if (retpost['comment']['edituser_id'] == 0) {
            delete retpost['comment']['edituser'];
            delete retpost['comment']['edittime'];
        }
        retpost['comment'] = _.pick(retpost['comment'], ['addtime', 'type', 'content', 'edituser', 'edittime']);

        retpost['user'] = _.pick(retpost['user'], ['username', 'lock', 'activate']);
        ctx.body = util.retOk(retpost);

    },
    //编辑权限，在编辑的controller前
    async editPost(ctx, next) {
        logger.debug("editPost:",ctx.state);
        const {user,post}=ctx.state;
        if (!user || _.isEmpty(user))
        {
            ctx.body=util.retError(-1,"请先登录")
            return;
        }
        if (user['lock']==1)
        {
            ctx.body=util.retError(-12,"用户已被锁定")
            return;
        }
        if (!post || _.isEmpty(post))
        {
            ctx.body=util.retError(-2,"未找到信息")
            return;
        }
        //判断权限
        if (post["user_id"]!=user["id"])
        {
            ctx.body=util.retError(-3,"没有编辑权限")
            return;
        }
        await next()
    },
    //发帖权限，在编辑的controller前
    async addPost(ctx, next) {
        logger.debug("addPost:",ctx.state);
        //TODO:添加权限判断

        //判断用户
        const {user}=ctx.state;
        if (!user || _.isEmpty(user))
        {
            ctx.body=util.retError(-11,"请先登录")
            return;
        }
        if (user['lock']==1)
        {
            ctx.body=util.retError(-12,"用户已被锁定")
            return;
        }

        await next()
    },


}