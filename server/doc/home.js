/**
 *
 * @api {get} /home  首页帖子列表
 * @apiSampleRequest /api/home
 * @apiName home
 * @apiGroup home
 * @apiVersion  1.0.0
 * @apiDescription 
 * 获取首页帖子列表
 * 这个只是首页的，包括排序和分页
 * @apiUse ReturnCode
 * @apiParam  {String} sort 排序 1，最新发布（默认），2最新回帖，3最新热（暂时不要）
 * @apiParam  {Number} page  分页，默认第一页
 */