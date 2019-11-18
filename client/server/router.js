//ssr的服务端路由
import Router from 'koa-router'

//react
import React from 'react'
import { renderToString } from 'react-dom/server'
//组件
import Home from '../src/views/home/home'
import List from '../src/views/list/list'
import Login from '../src/views/login/login'
import NewPost from '../src/views/newpost/newpost'
import Post from '../src/views/post/post'
import Setting from '../src/views/setting/setting'
import User from '../src/views/user/user'
//react-scripts编译后的文件对应
import {files,entrypoints} from '../build/asset-manifest.json'

const router = new Router();
//首页
router.get('/', async (ctx, next) => {
    const title="首页"
    const content = renderToString(<Home />)
    const scripts= [files['vendor.js'],files['home.js']]
    await ctx.render('home', {
        title,
        content,
        scripts
    })
});
//登录
router.get('/login', async (ctx, next) => {
    const title="登录页"
    const content = renderToString(<Login />)
    const scripts= [files['vendor.js'],files['login.js']]
    await ctx.render('login', {
        title,
        content,
        scripts
    })
});
//设置
router.get('/setting', async (ctx, next) => {
    const title="设置页"
    const content = renderToString(<Setting />)
    const scripts= [files['vendor.js'],files['setting.js']]
    await ctx.render('setting', {
        title,
        content,
        scripts
    })
});
//newpost
router.get('/newpost', async (ctx, next) => {
    const title="newpost"
    const content = renderToString(<NewPost />)
    const scripts= [files['vendor.js'],files['newpost.js']]
    await ctx.render('newpost', {
        title,
        content,
        scripts
    })
});
//用户
router.get('/u/:slug', async (ctx, next) => {
    console.log(ctx.params);
    const title="用户"
    const content = renderToString(<User />)
    const scripts= [files['vendor.js'],files['user.js']]
    await ctx.render('user', {
        title,
        content,
        scripts
    })
});
//列表
router.get('/t/:tag', async (ctx, next) => {
    console.log(ctx.params);
    const title="列表"
    const content = renderToString(<List />)
    const scripts= [files['vendor.js'],files['list.js']]
    await ctx.render('list', {
        title,
        content,
        scripts
    })
});
//post
router.get('/p/:slug', async (ctx, next) => {
    console.log(ctx.params);
    const title="post"
    const content = rend(<Post />)
    const scripts= [files['vendor.js'],files['post.js']]
    await ctx.render('post', {
        title,
        content,
        scripts
    })
});
//测试
router.get('/ping', async (ctx, next) => {
    ctx.response.body="pong"
   
});


export  default router;