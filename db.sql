-- --------------------------------------------------------
-- 主机:                           localhost
-- 服务器版本:                        5.7.27 - MySQL Community Server (GPL)
-- 服务器OS:                        Win64
-- HeidiSQL 版本:                  10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table shu.board_comment
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

-- Data exporting was unselected.

-- Dumping structure for table shu.board_post
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

-- Data exporting was unselected.

-- Dumping structure for table shu.board_postacticity
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

-- Data exporting was unselected.

-- Dumping structure for table shu.board_postimage
CREATE TABLE IF NOT EXISTS `board_postimage` (
  `id` int(10) unsigned NOT NULL,
  `hash` char(50) NOT NULL COMMENT '图片的hash值',
  `post_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `addtime` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='图片';

-- Data exporting was unselected.

-- Dumping structure for table shu.board_postintag
CREATE TABLE IF NOT EXISTS `board_postintag` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `post_id` int(11) unsigned DEFAULT NULL,
  `tag_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `post_id_tag_id` (`post_id`,`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table shu.board_setting
CREATE TABLE IF NOT EXISTS `board_setting` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(100) NOT NULL,
  `value` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='配置表，配置在初始化的时候写入json文件，定期更新';

-- Data exporting was unselected.

-- Dumping structure for table shu.board_tag
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

-- Data exporting was unselected.

-- Dumping structure for table shu.board_tagactivity
CREATE TABLE IF NOT EXISTS `board_tagactivity` (
  `tag_id` int(11) unsigned NOT NULL,
  `lastdposttime` datetime NOT NULL COMMENT '最后发布的时间',
  `lastcommenttime` datetime NOT NULL COMMENT '最后评论的时间',
  `lastpost_id` int(11) unsigned NOT NULL COMMENT '最后发布的帖子id',
  `lastcommentpost_id` int(11) unsigned NOT NULL COMMENT '最后评论的帖子id',
  `postcount` int(11) unsigned NOT NULL COMMENT '帖子总数',
  PRIMARY KEY (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='标签相关的活动';

-- Data exporting was unselected.

-- Dumping structure for table shu.board_useruppost
CREATE TABLE IF NOT EXISTS `board_useruppost` (
  `id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `post_id` int(10) unsigned NOT NULL,
  `addtime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id_post_id` (`user_id`,`post_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户点赞表';

-- Data exporting was unselected.

-- Dumping structure for table shu.user_activity
CREATE TABLE IF NOT EXISTS `user_activity` (
  `user_id` int(11) unsigned NOT NULL,
  `lastactiontime` datetime NOT NULL COMMENT '最后活动时间',
  `lastlogintime` datetime NOT NULL COMMENT '最后登陆时间',
  `logincount` int(11) unsigned NOT NULL COMMENT '登录次数',
  `postcount` int(11) unsigned NOT NULL COMMENT '发帖数',
  `commentcount` int(11) unsigned NOT NULL COMMENT '回复数',
  `lastvisitip` varchar(20) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户活动';

-- Data exporting was unselected.

-- Dumping structure for table shu.user_author
CREATE TABLE IF NOT EXISTS `user_author` (
  `user_id` int(11) unsigned NOT NULL,
  `slug` varchar(50) NOT NULL COMMENT 'url',
  `active` int(11) NOT NULL COMMENT '是否激活',
  `addtime` datetime NOT NULL COMMENT '添加时间',
  `info` text NOT NULL COMMENT '介绍',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户作者表，在这个表里面的是公众号等自媒体';

-- Data exporting was unselected.

-- Dumping structure for table shu.user_group
CREATE TABLE IF NOT EXISTS `user_group` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL COMMENT '组名',
  `color` char(7) NOT NULL COMMENT '显示颜色',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COMMENT='用户组，没有组的都是普通用户';

-- Data exporting was unselected.

-- Dumping structure for table shu.user_token
CREATE TABLE IF NOT EXISTS `user_token` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(100) DEFAULT NULL COMMENT 'key根据类型不同而不同，可能是手机，邮箱，甚至用户id',
  `token` text COMMENT '用户的token',
  `type` varchar(20) DEFAULT NULL COMMENT '类型：认证，邮箱，api',
  `addtime` datetime DEFAULT NULL COMMENT '添加日期',
  `expirestime` datetime DEFAULT NULL COMMENT '过期日期，根据类型不同',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='用户token表，自动清除过期的';

-- Data exporting was unselected.

-- Dumping structure for table shu.user_user
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
  `ip` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='用户表';

-- Data exporting was unselected.

-- Dumping structure for table shu.user_userinfo
CREATE TABLE IF NOT EXISTS `user_userinfo` (
  `user_id` int(10) unsigned NOT NULL,
  `key` varchar(50) NOT NULL,
  `value` varchar(200) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户信息，以用户属性的KV的形式存储';

-- Data exporting was unselected.

-- Dumping structure for table shu.user_useringroup
CREATE TABLE IF NOT EXISTS `user_useringroup` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `group_id` int(10) unsigned NOT NULL,
  `addtime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id_group_id` (`user_id`,`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户分组对应';

-- Data exporting was unselected.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
