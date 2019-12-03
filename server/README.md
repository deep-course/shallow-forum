后端
===============
没有使用Babel

## 使用组件

koa全家桶

apidoc生成API的文档

开发时使用了node-dev进行热加载

## 启动命令

npm run dev 开启开发环境

npm run doc 生成API DOC

## 第三方服务
在config里配置使用的第三方服务：

默认发送短信服务使用阿里云短信服务，需要安装 npm install @alicloud/pop-core

默认文件服务使用阿里云oss：需要安装 npm install ali-oss

aws s3的文件支持 需要安装 npm install aws-sdk

