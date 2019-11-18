const router = require('koa-router')({prefix: '/board'})
const middleware = require('../middleware')
const boardController=require("../controller/board");
    /**
     * 
     * @api {post} /board/newpost 发布新帖子
     * @apiName newpost
     * @apiGroup board
     * @apiVersion  1.0.0
     * @apiHeader (Response Headers) {String} token 认证的token
     * @apiSampleRequest /api/board/newpost
     * 
     * @apiParam  {String} title 帖子标题
     * @apiParam  {String} content 帖子内容
     * @apiParam  {String} tags 帖子tag
     * @apiParam  {Number} boardid 板块id
     * @apiParam  {Number} lableid 标签id
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
router.post('/newpost',middleware.user,boardController.newPost);
/**
 * 
 * @api {post} /board/newlink 发布新链接
 * @apiName newlink
 * @apiGroup board
 * @apiVersion  1.0.0
 * @apiHeader (Response Headers) {String} token 认证的token
 * @apiSampleRequest /api/board/newlink
 * 
 * @apiParam  {String} title  链接标题
 * @apiParam  {String} content 链接内容
 * @apiParam  {String} tags 链接tag
 * @apiParam  {Number} boardid 板块id
 * @apiParam  {Number} lableid 标签id
 * @apiParam  {String} url 链接url
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
router.post('/newlink',middleware.user,boardController.newLink);
    /**
     * 
     * @api {post} /board/newcomment 新建回复
     * @apiName newcomment
     * @apiGroup board
     * @apiVersion  1.0.0
     * 
     * @apiHeader (Response Headers) {String} token 认证的token
     * @apiSampleRequest /api/board/newcomment
     * 
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
router.post('/newcomment',middleware.user,boardController.newComment);
router.get('/getpost/:postslug',middleware.user,middleware.post,boardController.getPostInfo);
module.exports=router