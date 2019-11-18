const jwt = require('jsonwebtoken');
const {setting,env} = require('../config');
const util = require('../util');
const boardService = require("../service/board_service");
const logger=util.getLogger(__filename);
const boardMiddleware=module.exports={
    //获取post相关信息,只获取信息,存入到state中
    async post(ctx,next){    
        let postslug="";
        if (ctx.params&& ctx.params.postslug)
        {
            //优先params
            postslug=ctx.params.postslug;
            
        } else if(ctx.query&&ctx.query.postslug)
        {
            //其次get
            postslug=ctx.query.postslug;

        }
        else if(ctx.body&&ctx.body.postslug)
        {
            //最后post
            postslug=ctx.body.postslug;
        }
        //logger.debug(postslug)
        if (postslug)
        {
            const post=await boardService.getPostBySlug(postslug)
            if (post)
            {
                ctx.state.post=post;
            }
            ctx.state.post={};
        }
        else
        {
            ctx.state.post={};
        }
        await next();
    },
    async board(ctx,next){
        let boardslug="";
        if (ctx.params&& ctx.params.boardslug)
        {
            //优先params
            postslug=ctx.params.boardslug;
            
        } else if(ctx.query&&ctx.query.boardslug)
        {
            //其次get
            postslug=ctx.query.boardslug;

        }
        else if(ctx.body&&ctx.body.boardslug)
        {
            //最后post
            postslug=ctx.body.boardslug;
        }
        if (boardslug)
        {
            ctx.state.board=await boardService.getBoardBySlug(boardslug)
        }
        else
        {
            ctx.state.board={};
        }
        await next();
    },
 
    //查看权限，在controller后判断
    async viewPost (ctx,next){

    },
    //编辑权限，在编辑的controller前
    async editPost(ctx,next){

    },
    

}