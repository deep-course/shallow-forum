/*
 * 名称规则
 * {name} 论坛名
 * {pagename} 页面名称
 * {slogan} 口号
 */
//论坛名
export const name = '轻论坛'
export const slogan = '口号'
//一般页面
export const format = {
    //默认
    page: '{pagename} - {name}',
    //首页
    home: '{name} 首页 - {slogan}',
    //列表页
    list: '{pagename} 的相关文章 - {name}',
    //文章页
    post: '{pagename} - {name}',
    //用户首页
    user: '{pagename} 的首页 - {name}',
}
