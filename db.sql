-- --------------------------------------------------------
-- 主机:                           127.0.0.1
-- 服务器版本:                        5.6.42-log - Homebrew
-- 服务器操作系统:                      osx10.14
-- HeidiSQL 版本:                  9.5.0.5196
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- 导出  表 shu.board_comment 结构
CREATE TABLE IF NOT EXISTS `board_comment` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `post_id` int(10) unsigned NOT NULL COMMENT 'postid',
  `user_id` int(10) unsigned NOT NULL COMMENT '用户id',
  `addtime` datetime NOT NULL COMMENT '添加时间',
  `type` varchar(20) NOT NULL COMMENT '类型 comment action',
  `content` text NOT NULL COMMENT '内容',
  `edittime` datetime NOT NULL COMMENT '编辑时间',
  `edituser_id` int(10) unsigned NOT NULL COMMENT '编辑用户',
  `ip` varchar(20) NOT NULL COMMENT 'ip地址',
  `approve` tinyint(4) NOT NULL COMMENT '审核',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='评论表';

-- 正在导出表  shu.board_comment 的数据：~0 rows (大约)
DELETE FROM `board_comment`;
/*!40000 ALTER TABLE `board_comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `board_comment` ENABLE KEYS */;

-- 导出  表 shu.board_post 结构
CREATE TABLE IF NOT EXISTS `board_post` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `slug` char(32) NOT NULL COMMENT '唯一标示',
  `title` varchar(80) NOT NULL COMMENT '标题',
  `pubtime` datetime NOT NULL COMMENT '发布时间',
  `user_id` int(11) unsigned NOT NULL COMMENT '发布人',
  `comment_id` int(11) unsigned NOT NULL COMMENT '发布内容',
  `label` int(11) unsigned NOT NULL COMMENT '标签，在配置里面',
  `approve` tinyint(3) unsigned NOT NULL COMMENT '验证',
  `lock` tinyint(3) unsigned NOT NULL COMMENT '锁定',
  `sticky` tinyint(3) unsigned NOT NULL COMMENT '置顶',
  `board_id` int(10) unsigned NOT NULL COMMENT '板块id，暂时没用',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='帖子';

-- 正在导出表  shu.board_post 的数据：~0 rows (大约)
DELETE FROM `board_post`;
/*!40000 ALTER TABLE `board_post` DISABLE KEYS */;
/*!40000 ALTER TABLE `board_post` ENABLE KEYS */;

-- 导出  表 shu.board_postacticity 结构
CREATE TABLE IF NOT EXISTS `board_postacticity` (
  `post_id` int(11) unsigned NOT NULL,
  `lastcommentuser_id` int(11) unsigned NOT NULL COMMENT '最后回复的用户id',
  `lastcomment_id` int(11) unsigned NOT NULL COMMENT '最后回复的id',
  `upcount` int(11) unsigned NOT NULL COMMENT '顶',
  `lastuptime` datetime NOT NULL COMMENT '最后顶的时间',
  `lastcommenttime` datetime NOT NULL COMMENT '最后回复时间',
  `commentcount` int(11) unsigned NOT NULL COMMENT '回复总数',
  PRIMARY KEY (`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='帖子信息';

-- 正在导出表  shu.board_postacticity 的数据：~0 rows (大约)
DELETE FROM `board_postacticity`;
/*!40000 ALTER TABLE `board_postacticity` DISABLE KEYS */;
/*!40000 ALTER TABLE `board_postacticity` ENABLE KEYS */;

-- 导出  表 shu.board_postintag 结构
CREATE TABLE IF NOT EXISTS `board_postintag` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `post_id` int(11) unsigned DEFAULT NULL,
  `tag_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `post_id_tag_id` (`post_id`,`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- 正在导出表  shu.board_postintag 的数据：~0 rows (大约)
DELETE FROM `board_postintag`;
/*!40000 ALTER TABLE `board_postintag` DISABLE KEYS */;
/*!40000 ALTER TABLE `board_postintag` ENABLE KEYS */;

-- 导出  表 shu.board_setting 结构
CREATE TABLE IF NOT EXISTS `board_setting` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(100) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='配置表，配置在初始化的时候写入json文件，定期更新';

-- 正在导出表  shu.board_setting 的数据：~0 rows (大约)
DELETE FROM `board_setting`;
/*!40000 ALTER TABLE `board_setting` DISABLE KEYS */;
/*!40000 ALTER TABLE `board_setting` ENABLE KEYS */;

-- 导出  表 shu.board_tag 结构
CREATE TABLE IF NOT EXISTS `board_tag` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '名称',
  `type` varchar(50) NOT NULL COMMENT 'tag的类型，主tag，附加tag',
  `slug` varchar(50) NOT NULL COMMENT 'slug',
  `info` varchar(200) NOT NULL COMMENT '介绍',
  `color` char(7) NOT NULL COMMENT '颜色',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COMMENT='标签';

-- 正在导出表  shu.board_tag 的数据：~1 rows (大约)
DELETE FROM `board_tag`;
/*!40000 ALTER TABLE `board_tag` DISABLE KEYS */;
INSERT INTO `board_tag` (`id`, `name`, `type`, `slug`, `info`, `color`) VALUES
	(1, '测试tag', 'main', 'test', '测试的tag', ''),
	(2, '子tag', 'sub', 'tag1', '目前没有区分子tag', '');
/*!40000 ALTER TABLE `board_tag` ENABLE KEYS */;

-- 导出  表 shu.board_tagactivity 结构
CREATE TABLE IF NOT EXISTS `board_tagactivity` (
  `tag_id` int(11) unsigned NOT NULL,
  `lastdposttime` datetime NOT NULL COMMENT '最后发布的时间',
  `lastcommenttime` datetime NOT NULL COMMENT '最后评论的时间',
  `lastpost_id` int(11) unsigned NOT NULL COMMENT '最后发布的帖子id',
  `lastcommentpost_id` int(11) unsigned NOT NULL COMMENT '最后评论的帖子id',
  `postcount` int(11) unsigned NOT NULL COMMENT '帖子总数',
  PRIMARY KEY (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='标签相关的活动';

-- 正在导出表  shu.board_tagactivity 的数据：~2 rows (大约)
DELETE FROM `board_tagactivity`;
/*!40000 ALTER TABLE `board_tagactivity` DISABLE KEYS */;
INSERT INTO `board_tagactivity` (`tag_id`, `lastdposttime`, `lastcommenttime`, `lastpost_id`, `lastcommentpost_id`, `postcount`) VALUES
	(1, '2019-05-08 15:25:29', '0000-00-00 00:00:00', 3, 0, 4),
	(2, '2019-05-08 15:50:42', '0000-00-00 00:00:00', 7, 0, 6);
/*!40000 ALTER TABLE `board_tagactivity` ENABLE KEYS */;

-- 导出  表 shu.board_useruppost 结构
CREATE TABLE IF NOT EXISTS `board_useruppost` (
  `id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `post_id` int(10) unsigned NOT NULL,
  `addtime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id_post_id` (`user_id`,`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户点赞表';

-- 正在导出表  shu.board_useruppost 的数据：~0 rows (大约)
DELETE FROM `board_useruppost`;
/*!40000 ALTER TABLE `board_useruppost` DISABLE KEYS */;
/*!40000 ALTER TABLE `board_useruppost` ENABLE KEYS */;

-- 导出  表 shu.user_activity 结构
CREATE TABLE IF NOT EXISTS `user_activity` (
  `user_id` int(11) unsigned NOT NULL,
  `lastactiontime` datetime NOT NULL COMMENT '最后活动时间',
  `lastlogintime` datetime NOT NULL COMMENT '最后登陆时间',
  `logincount` int(11) unsigned NOT NULL COMMENT '登录次数',
  `postcount` int(11) unsigned NOT NULL COMMENT '发帖数',
  `commentcount` int(11) unsigned NOT NULL COMMENT '回复数',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户活动';

-- 正在导出表  shu.user_activity 的数据：~0 rows (大约)
DELETE FROM `user_activity`;
/*!40000 ALTER TABLE `user_activity` DISABLE KEYS */;
INSERT INTO `user_activity` (`user_id`, `lastactiontime`, `lastlogintime`, `logincount`, `postcount`, `commentcount`) VALUES
	(1, '2019-05-08 16:28:14', '2019-05-08 16:16:25', 3, 8, 0);
/*!40000 ALTER TABLE `user_activity` ENABLE KEYS */;

-- 导出  表 shu.user_author 结构
CREATE TABLE IF NOT EXISTS `user_author` (
  `user_id` int(11) unsigned NOT NULL,
  `slug` varchar(50) NOT NULL COMMENT 'url',
  `active` int(11) NOT NULL COMMENT '是否激活',
  `addtime` datetime NOT NULL COMMENT '添加时间',
  `info` text NOT NULL COMMENT '介绍',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户作者表，在这个表里面的是公众号等自媒体';

-- 正在导出表  shu.user_author 的数据：~0 rows (大约)
DELETE FROM `user_author`;
/*!40000 ALTER TABLE `user_author` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_author` ENABLE KEYS */;

-- 导出  表 shu.user_group 结构
CREATE TABLE IF NOT EXISTS `user_group` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '组名',
  `color` char(7) NOT NULL COMMENT '显示颜色',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='用户组，没有组的都是普通用户';

-- 正在导出表  shu.user_group 的数据：~3 rows (大约)
DELETE FROM `user_group`;
/*!40000 ALTER TABLE `user_group` DISABLE KEYS */;
INSERT INTO `user_group` (`id`, `name`, `color`) VALUES
	(1, '管理员', ''),
	(2, '版主', ''),
	(3, '嘉宾', '');
/*!40000 ALTER TABLE `user_group` ENABLE KEYS */;

-- 导出  表 shu.user_token 结构
CREATE TABLE IF NOT EXISTS `user_token` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL COMMENT '用户的id',
  `token` text COMMENT '用户的token',
  `type` varchar(20) DEFAULT NULL COMMENT '类型：认证，邮箱，api',
  `addtime` datetime DEFAULT NULL COMMENT '添加日期',
  `expirestime` datetime DEFAULT NULL COMMENT '过期日期，根据类型不同',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户token表，自动清除过期的';

-- 正在导出表  shu.user_token 的数据：~0 rows (大约)
DELETE FROM `user_token`;
/*!40000 ALTER TABLE `user_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_token` ENABLE KEYS */;

-- 导出  表 shu.user_user 结构
CREATE TABLE IF NOT EXISTS `user_user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL COMMENT '用户名',
  `email` varchar(100) NOT NULL COMMENT '邮件',
  `phone` varchar(50) NOT NULL COMMENT '电话',
  `activate` tinyint(4) NOT NULL COMMENT '是否激活',
  `password` char(64) NOT NULL COMMENT '密码',
  `jointime` datetime NOT NULL COMMENT '加入时间',
  `bio` text NOT NULL COMMENT '个人介绍',
  `lock` tinyint(4) NOT NULL COMMENT '锁定',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='用户表';

-- 正在导出表  shu.user_user 的数据：~0 rows (大约)
DELETE FROM `user_user`;
/*!40000 ALTER TABLE `user_user` DISABLE KEYS */;
INSERT INTO `user_user` (`id`, `username`, `email`, `phone`, `activate`, `password`, `jointime`, `bio`, `lock`) VALUES
	(1, 'tant', 'tant@123.com', '123456', 1, '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '2019-05-01 10:00:00', '', 0);
/*!40000 ALTER TABLE `user_user` ENABLE KEYS */;

-- 导出  表 shu.user_userinfo 结构
CREATE TABLE IF NOT EXISTS `user_userinfo` (
  `user_id` int(10) unsigned NOT NULL,
  `key` varchar(50) NOT NULL,
  `value` varchar(200) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户信息，以用户属性的KV的形式存储';

-- 正在导出表  shu.user_userinfo 的数据：~0 rows (大约)
DELETE FROM `user_userinfo`;
/*!40000 ALTER TABLE `user_userinfo` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_userinfo` ENABLE KEYS */;

-- 导出  表 shu.user_useringroup 结构
CREATE TABLE IF NOT EXISTS `user_useringroup` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `group_id` int(10) unsigned NOT NULL,
  `addtime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id_group_id` (`user_id`,`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户分组对应';

-- 正在导出表  shu.user_useringroup 的数据：~0 rows (大约)
DELETE FROM `user_useringroup`;
/*!40000 ALTER TABLE `user_useringroup` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_useringroup` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
