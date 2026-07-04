/*
 Navicat Premium Dump SQL

 Source Server         : blog
 Source Server Type    : MySQL
 Source Server Version : 80405 (8.4.5)
 Source Host           : 192.168.20.128:3306
 Source Schema         : blog

 Target Server Type    : MySQL
 Target Server Version : 80405 (8.4.5)
 File Encoding         : 65001

 Date: 22/06/2026 21:08:49
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for t_comment
-- ----------------------------
DROP TABLE IF EXISTS `t_comment`;
CREATE TABLE `t_comment`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '评论id',
  `type` tinyint(1) NOT NULL COMMENT '评论类型 (1文章 2留言板)',
  `type_id` bigint NOT NULL COMMENT '类型id',
  `parent_id` bigint NULL DEFAULT NULL COMMENT '父评论id',
  `reply_id` bigint NULL DEFAULT NULL COMMENT '回复评论id',
  `comment_content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '评论的内容',
  `comment_user_id` bigint NOT NULL COMMENT '评论用户的id',
  `reply_user_id` bigint NULL DEFAULT NULL COMMENT '回复用户的id',
  `is_check` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否通过 (0否 1是)',
  `create_time` datetime NOT NULL COMMENT '评论时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除（0：未删除，1：已删除）',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 57 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

SET FOREIGN_KEY_CHECKS = 1;
