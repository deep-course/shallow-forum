const router = require('koa-router')({ prefix: '/board' })
const middleware = require('../middleware')
const boardController = require("../controller/board");
router.post('/newpost',
    middleware.getUser,
    middleware.checkUser,
    middleware.checkAddPost,
    boardController.newPost);

router.post('/newlink',
    middleware.getUser,
    middleware.checkUser,
    middleware.checkAddPost,
    boardController.newLink);

router.post('/newcomment',
    middleware.getUser,
    middleware.getPost,
    middleware.checkUser,
    middleware.checkAddComment,
    boardController.newComment);

router.post('/uploadattachments',
    middleware.getUser,
    middleware.getPost,
    middleware.checkUser,
    boardController.uploadAttachment);

router.get('/showattachments',
    middleware.getUser,
    middleware.getPost,
    middleware.checkUser,
    boardController.showAttachment);

router.post('/removeattachments',
    middleware.getUser,
    middleware.getPost,
    middleware.checkUser,
    boardController.removeAttachment);


router.get('/getpost',
    middleware.getUser,
    middleware.getPost,
    middleware.getPostDetail,
    boardController.showPost);

router.post('/editpost',
    middleware.getUser,
    middleware.getPost,
    middleware.getPostDetail,
    middleware.checkUser,
    middleware.checkEditPost,
    boardController.editPost
);



router.post('/editcomment',
    middleware.getUser,
    middleware.checkUser,
    middleware.checkEditComment,
    boardController.editComment);


router.post('/deletecomment',
    middleware.getUser,
    middleware.checkUser,
    boardController.deleteComment);


router.post('/deletepost',
    middleware.getUser,
    middleware.checkUser,
    middleware.getPost,
    boardController.deletePost

);


router.post('/uppost',
    middleware.getUser,
    middleware.checkUser,
    middleware.getPost,
    boardController.upPost
);


router.get('/postlist',
    middleware.getUser,
    boardController.getPostList
);

router.get('/commentlist',
    middleware.getUser,
    middleware.getPost,
    boardController.getCommentList
);
router.get('/boardsetting',
    boardController.getBoardSetting
);
router.post('/uploadavatar',
    middleware.getUser,
    middleware.checkUser,
    boardController.uploadAvatar
);
module.exports = router