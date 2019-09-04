const jwt = require('jsonwebtoken');
const {setting,env} = require('../config');
const util = require('../util');
const boardService = require("../service/board_service");
const logger=util.getLogger(__filename);
module.exports={
    //获取post相关信息,只获取信息,存入到state中
    post:async function(ctx,next){
        ctx.response.body=ctx;
        
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
            ctx.state.post=await boardService.getPostBySlug(postslug)
        }
        else
        {
            ctx.state.post={};
        }
        await next();
    },
 
    //查看权限，在controller后判断
    viewPost:async function (ctx,next){

    },
    //编辑权限，在编辑的controller前
    editPost:async function(ctx,next){

    },
    

}