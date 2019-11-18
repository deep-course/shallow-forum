# SSR

其实就是服务器端先渲染一次，然后客户端再次渲染

## 目录说明

server：SSR的服务端渲染代码
server/view：koa 服务端模板
src：react的组件代码
start-server.js ：node ssr启动文件 

build：react-scripts build后的代码，node启动也需要

## 启动命令 
npm run server 或 node start-server.js


## 下一步配置

最后一个需要考虑的就是文章页的内容太多，能不能把文章放到html代码中，或者加一个类似查看全部的连接，点击以后再绑定所有的类似CSDN。


## 服务所用组件

"koa": 
"koa-router": koa的路由
"koa-static":  koa静态
"koa-views":  koa的模板中间件
"ejs":  模板引擎

## 参考
https://segmentfault.com/a/1190000012998848

## 页面说明

home：首页

list：列表页，暂时可以和首页一样

post：内容页

newpost:内容发布页

login : 登录和注册页

user：个人信息页（点击帖子的头像连接后跳转的页面）

setting：用户设置页,修改密码，头像，等


目录规则index.js是入口页面，只负责浏览器端渲染

node端直接import 与目录同名的jsx然后render就可以了


## url规则（koa）
首页： /
用户信息：/u/:slug
post： /p/:slug
newpost:/newpost
login: /login
setting: /setting
列表： /t/:tag
