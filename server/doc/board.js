/**
 * 
 * @api {post} /board/newpost 发帖
 * @apiName newpost
 * @apiGroup board
 * @apiVersion  1.0.0
 * @apiSampleRequest /api/board/newpost
 * @apiUse ReturnCode
 * @apiUse HeaderToken
 * @apiDescription  发布新的帖子，返回slug
 * @apiParam  {String} title 帖子标题
 * @apiParam  {String} content 帖子内容
 * @apiParam  {String} tags 帖子tag
 * @apiParam  {Number} boardid 板块id：0暂时没用
 * @apiParam  {Number} lableid 标签id
 * @apiParam  {String} [mainimage] 主图地址
 * @apiParam  {String[]} [imagelist[]] 图片列表 注意这个带中括号
 * 
 * 
 */

 /**
 * 
 * @api {post} /board/newlink 发连接
 * @apiName newlink
 * @apiGroup board
 * @apiVersion  1.0.0
 * @apiSampleRequest /api/board/newlink
 * @apiUse HeaderToken
 * @apiUse ReturnCode
 * @apiDescription  发布新连接，添加一个新的连接，连接没有图片
 * @apiParam  {String} title  链接标题
 * @apiParam  {String} content 链接内容
 * @apiParam  {String} tags 链接tag
 * @apiParam  {Number} boardid 板块id：0暂时没用
 * @apiParam  {Number} lableid 标签id
 * @apiParam  {String} url 链接url
 * 
 * 
 * 
 */
/**
 * 
 * @api {post} /board/newcomment 新建回复
 * @apiName newcomment
 * @apiGroup board
 * @apiVersion  1.0.0
 * 
 * @apiSampleRequest /api/board/newcomment
 * @apiUse HeaderToken
 * 
 * 
 * @apiParam  {String} postslug 帖子slug
 * @apiParam {String} content 回复内容
 * 
 * 
 * @apiParamExample  {type} Request-Example:
 * {
 *     property : value
 * }
 * 
 * 
 * @apiSuccessExample {type} Success-Response:
 * {
 *     property : value
 * }
 * 
 * 
 */
/**
 * 
 * @api {post} /board/uploadattachments 上传图片附件
 * @apiName uploadattachments
 * @apiGroup board
 * @apiVersion  1.0.0
 * @apiUse HeaderToken
 * @apiUse ReturnCode
 * @apiDescription
 * apidoc无法上传文件所以可以使用curl进行测试，代码如下：
 * 
 * curl --header "token: 登录的token"
 * -F "postslug="
 * -F "file=@文件名" 
 * localhost:3001/api/board/uploadattachments
 * 
 * 
 * 

 * 
 * @apiParam  {String} postslug 帖子slug
 * @apiParam {File} file 要上传的文件
 * 
  * @apiSuccessExample {type} Success-Response:
 * {
 *     url : 文件url地址
 * }
 * 
 *
 * 
 * 
 */
/**
 * 
 * @api {get} /board/showattachments 显示图片附件
 * @apiName showattachments
 * @apiGroup board
 * @apiVersion  1.0.0
 * 
 * @apiSampleRequest /api/board/showattachments
 * @apiUse HeaderToken
 * @apiUse ReturnCode
 * @apiDescription 根据postslug返回对应帖子的列表
 * 
 * 如果postslug为空，则返回新帖发帖的图片列表
 * 
 * 
 * @apiParam  {String} postslug 帖子slug
 * 
 * 
 * 
 * 
 * @apiSuccessExample {type} Success-Response:
 * {
 *     ['/upload/62c051b00a9411ea992ad5cbc4552877.jpeg',
 *      '/upload/62c051b00a9411ea992ad5cbc4552877.jpeg'
 *      ] 
 * }
 * 
 * 
 */
/**
 * 
 * @api {post} /board/removeattachments 删除图片附件
 * @apiName removeattachments
 * @apiGroup board
 * @apiVersion  1.0.0
 * 
 * @apiSampleRequest /api/board/removeattachments
 * @apiUse HeaderToken
 * @apiUse ReturnCode
 * @apiDescription 图片附件
 * 
 * 找到图片对应的post进行判断，能够删除再删除
 * 
 * 
 * @apiParam  {String} fileurl url
 * 
 * 
 * 
 * 
 * 
 * 
 */
/**
 * 
 * @api {get} /board/getpost 获取帖子信息
 * @apiName getpost
 * @apiGroup board
 * @apiVersion  1.0.0
 * 
 * @apiSampleRequest /api/board/getpost
 * @apiUse HeaderToken
 * @apiUse ReturnCode
 * @apiDescription 获取单个帖子信息
 * 
 * postslug获取帖子信息和帖子内容
 * 
 * 
 * @apiParam  {String} postslug 帖子slug
 * 
 * 
 * 
 * 
 * 
 * 
 */
/**
 * 
 * @api {post} /board/editpost 编辑帖子
 * @apiName board-todo
 * @apiGroup board
 * @apiVersion  1.0.0
 * @apiSampleRequest /api/board/editpost
 * @apiUse ReturnCode
 * @apiUse HeaderToken
 * @apiDescription  编辑帖子
 * @apiParam  {String} postslug slug
 * @apiParam  {String} title 帖子标题
 * @apiParam  {String} content 帖子内容
 * @apiParam  {Number} lableid 标签id
 * @apiParam  {String} [mainimage] 主图地址
 * @apiParam  {String[]} [imagelist[]] 图片列表 注意这个带中括号
 * 
 * 
 */
/**
 * 
 * @api {post} /board/editcomment 编辑回复
 * @apiName editcomment
 * @apiGroup board
 * @apiVersion  1.0.0
 * @apiSampleRequest /api/board/editcomment
 * @apiUse ReturnCode
 * @apiUse HeaderToken
 * @apiDescription  编辑回复
 * @apiParam  {String} commentid 回复id
 * @apiParam  {String} content 回复内容
 * 
 */
/**
 * 
 * @api {post} /board/deletecomment 删除回复
 * @apiName deletecomment
 * @apiGroup board
 * @apiVersion  1.0.0
 * @apiSampleRequest /api/board/deletecomment
 * @apiUse ReturnCode
 * @apiUse HeaderToken
 * @apiDescription  删除回复
 * @apiParam  {String} commentid 回复id
 * 
 */
/**
 * 
 * @api {post} /board/deletepost 删除帖子
 * @apiName deletepost
 * @apiGroup board
 * @apiVersion  1.0.0
 * @apiSampleRequest /api/board/deletepost
 * @apiUse ReturnCode
 * @apiUse HeaderToken
 * @apiDescription  删除帖子
 * @apiParam  {String} postslug  post标识
 * 
 */
/**
 * 
 * @api {post} /board/uppost 顶贴
 * @apiName uppost
 * @apiGroup board
 * @apiVersion  1.0.0
 * @apiSampleRequest /api/board/uppost
 * @apiUse ReturnCode
 * @apiUse HeaderToken
 * @apiDescription  顶贴后，再次请求取消顶贴
 * @apiParam  {String} postslug  post标识
 * 
 */

 /**
 *
 * @api {get} /board/postlist  帖子列表筛选
 * @apiSampleRequest /api/board/postlist
 * @apiName postlist
 * @apiGroup board
 * @apiVersion  1.0.0
 * @apiDescription 
 * 获取帖子列表
 * 这个是有条件的
 * @apiUse ReturnCode
 * @apiUse HeaderToken
 * @apiParam  {String} tag  tag标识
 * @apiParam  {String} sort 排序 1，最新发布（默认），2最新回帖，3最新热（暂时不要）
 * @apiParam  {Number} page  分页，默认第一页
 */

 /**
 *
 * @api {get} /board/commentlist  回复列表
 * @apiSampleRequest /api/board/commentlist
 * @apiName commentlist
 * @apiGroup board
 * @apiVersion  1.0.0
 * @apiDescription 
 * 获取帖子列表
 * 这个是有条件的
 * @apiUse ReturnCode
 * @apiUse HeaderToken
 * @apiParam  {String} postslug  tag标识
 * @apiParam  {Number} page  分页，默认第一页
 */