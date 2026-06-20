SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for t_article
-- ----------------------------
DROP TABLE IF EXISTS `t_article`;
CREATE TABLE `t_article`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '文章id',
  `user_id` bigint NOT NULL COMMENT '作者id',
  `category_id` bigint NOT NULL COMMENT '分类id',
  `article_cover` varchar(1024) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '文章缩略图',
  `article_title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '文章标题',
  `article_content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '文章内容',
  `article_type` tinyint NOT NULL COMMENT '类型 (1原创 2转载 3翻译)',
  `is_top` tinyint NOT NULL COMMENT '是否置顶 (0否 1是）',
  `status` tinyint NOT NULL COMMENT '文章状态 (1公开 2私密 3草稿)',
  `visit_count` bigint NOT NULL DEFAULT 0 COMMENT '访问量',
  `create_time` datetime NOT NULL COMMENT '文章创建时间',
  `update_time` datetime NOT NULL COMMENT '文章更新时间',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除（0：未删除，1：已删除）',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 41 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------

-- ----------------------------
-- Table structure for t_article_tag
-- ----------------------------
DROP TABLE IF EXISTS `t_article_tag`;
CREATE TABLE `t_article_tag`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '关系表id',
  `article_id` bigint UNSIGNED NOT NULL COMMENT '文章id',
  `tag_id` bigint NOT NULL COMMENT '标签id',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除（0：未删除，1：已删除）',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 80 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------

-- ----------------------------
-- Table structure for t_category
-- ----------------------------
DROP TABLE IF EXISTS `t_category`;
CREATE TABLE `t_category`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '分类id',
  `category_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '分类名',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除（0：未删除，1：已删除）',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------

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
) ENGINE = InnoDB AUTO_INCREMENT = 57 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------

-- ----------------------------
-- Table structure for t_favorite
-- ----------------------------
DROP TABLE IF EXISTS `t_favorite`;
CREATE TABLE `t_favorite`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '收藏id',
  `user_id` bigint NOT NULL COMMENT '收藏的用户id',
  `type` tinyint NOT NULL COMMENT '收藏类型(1,文章 2,留言板)',
  `type_id` bigint NOT NULL COMMENT '类型id',
  `is_check` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否有效 (0否 1是)',
  `create_time` datetime NOT NULL COMMENT '收藏时间',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除（0：未删除，1：已删除）',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 168 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------

-- ----------------------------
-- Table structure for t_leave_word
-- ----------------------------
DROP TABLE IF EXISTS `t_leave_word`;
CREATE TABLE `t_leave_word`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'id',
  `user_id` bigint NOT NULL COMMENT '留言用户id',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '留言内容',
  `is_check` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否通过 (0否 1是)',
  `create_time` datetime NOT NULL COMMENT '留言时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除（0：未删除，1：已删除）',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 28 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------

-- ----------------------------
-- Table structure for t_like
-- ----------------------------
DROP TABLE IF EXISTS `t_like`;
CREATE TABLE `t_like`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '点赞表id',
  `user_id` bigint NOT NULL COMMENT '点赞的用户id',
  `type` tinyint NOT NULL COMMENT '点赞类型(1,文章,2,评论,3留言板)',
  `type_id` bigint NOT NULL COMMENT '点赞的文章id',
  `create_time` datetime NOT NULL COMMENT '点赞时间',
  `update_time` datetime NOT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 289 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------

-- ----------------------------
-- Table structure for t_link
-- ----------------------------
DROP TABLE IF EXISTS `t_link`;
CREATE TABLE `t_link`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '友链表id',
  `user_id` bigint NOT NULL COMMENT '用户id',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '网站名称',
  `url` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '网站地址',
  `description` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '网站描述',
  `background` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '网站背景',
  `is_check` tinyint NOT NULL DEFAULT 0 COMMENT '审核状态（0：未通过，1：已通过）',
  `email` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '邮箱地址',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除（0：未删除，1：已删除）',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------

-- ----------------------------
-- Table structure for t_tag
-- ----------------------------
DROP TABLE IF EXISTS `t_tag`;
CREATE TABLE `t_tag`  (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '标签id',
  `tag_name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '标签名称',
  `create_time` datetime NOT NULL COMMENT '标签创建时间',
  `update_time` datetime NOT NULL COMMENT '标签更新时间',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除（0：未删除，1：已删除）',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------

-- ----------------------------
-- Table structure for t_tree_hole
-- ----------------------------
DROP TABLE IF EXISTS `t_tree_hole`;
CREATE TABLE `t_tree_hole`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '树洞表id',
  `user_id` bigint NOT NULL COMMENT '用户id',
  `content` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '内容',
  `is_check` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否通过 (0否 1是)',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '修改时间',
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否删除（0：未删除，1：已删除）',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 35 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------

-- ----------------------------
-- Table structure for t_banners
-- ----------------------------
DROP TABLE IF EXISTS `t_banners`;
CREATE TABLE `t_banners`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键id',
  `path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '图片路径',
  `size` bigint NOT NULL COMMENT '图片大小 (字节)',
  `type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '图片类型 (MIME)',
  `user_id` bigint NOT NULL COMMENT '上传人id',
  `sort_order` int NOT NULL COMMENT '图片顺序',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 43 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Table structure for t_black_list
-- ----------------------------
DROP TABLE IF EXISTS `t_black_list`;
CREATE TABLE `t_black_list`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '表id',
  `user_id` bigint NULL DEFAULT NULL COMMENT '用户id',
  `reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '封禁理由',
  `banned_time` datetime NOT NULL COMMENT '封禁时间',
  `expires_time` datetime NOT NULL COMMENT '到期时间',
  `type` tinyint NOT NULL COMMENT '类型（1：用户，2：路人/攻击者）',
  `ip_info` json NULL COMMENT '如果type=2，则需要有ip信息',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除（0：未删除，1：已删除）',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 257 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

/*
 Navicat Premium Data Transfer

 Source Server         : MySQL80
 Source Server Type    : MySQL
 Source Server Version : 80030 (8.0.30)
 Source Host           : localhost:3306
 Source Schema         : blog-dev

 Target Server Type    : MySQL
 Target Server Version : 80030 (8.0.30)
 File Encoding         : 65001

 Date: 27/01/2025 20:21:39
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for t_photo
-- ----------------------------
DROP TABLE IF EXISTS `t_photo`;
CREATE TABLE `t_photo`  (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '自增id',
  `user_id` bigint NOT NULL COMMENT '创建者id',
  `name` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '名称',
  `description` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '描述',
  `type` tinyint(1) NOT NULL COMMENT '类型（1：相册 2：照片）',
  `parent_id` bigint NULL DEFAULT NULL COMMENT '父相册id',
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '图片地址',
  `is_check` tinyint(1) NOT NULL DEFAULT 1 COMMENT '是否通过 (0否 1是)',
  `size` double NULL DEFAULT NULL COMMENT '照片体积大小(kb)',
  `create_time` datetime NOT NULL COMMENT '创建时间',
  `update_time` datetime NOT NULL COMMENT '更新时间',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '是否删除（0：未删除，1：已删除）',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 152 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- DATA IMPORT
-- ============================================================

-- Records of t_article
-- ----------------------------
INSERT INTO `t_article` VALUES (1, 1, 2, 'http://cdn.kuailemao.lielfw.cn/articleCover/Sara11676693097117968.png', 'java的继承', '# 🍖2、继承\r\n#### 🍟2.1、继承的基本概念\r\n> 继承是面向对象的三大特征之一，继承可以解决编程中代码冗余的问题，是实现代码重用的重要手段之一。\r\n> **语法：**\r\n> [ 访问修饰符 ] class  \\<SubClass\\>  extends <SuperClass\\>{\r\n>\r\n> }\r\n\r\n其中，SubClass 被称为子类或派生类，SuperClass 被称为父类或基类。\r\n\r\n> Java 继承规则如下：\r\n> 1、可以继承父类中 public 和 protected 修饰的属性和方法，不论子类和父类是否在同一包中。\r\n> 2、可以继承默认访问修饰符修饰的属性和方法，但是子类和父类必须在同一包中\r\n> 3、无法继承 private 修饰的属性和方法\r\n> 4、无法继承父类的构造方法\r\n\r\n**注意：**\r\n> 在 Java 中只支持单继承，即每个类只能有一个直接父类\r\n\r\n#### 🍟2.2、继承的应用\r\n如下：\r\n```java\r\n    /**\r\n    *动物父类\r\n    */\r\n	public class Animal {\r\n    public void cry(){\r\n        System.out.println(\"动物叫。。。。\");\r\n    }\r\n}\r\n	/**\r\n	*	继承了动物类的小猫类也有 cry() 方法（子类）\r\n	*/\r\npublic class Cat extends Animal {\r\n   // 有父类的方法与属性 \r\n}\r\n```\r\n#### 🍟2.3、Object\r\n> Object 类属性超级父类（老祖宗），当一个类没有任何继承的时候，默认继承 Object 类，自带 Object 类里面的 方法与属性\r\n\r\n**注意：**\r\n> 子类被创建对象的时候必是先执行 Object 类的构造方法，因为构造方法第一行中有隐藏的 super() 调用父类构造方法，最终的父类一定是 Object 类\r\n\r\n#### 🍟2.4、继承关系中的方法重写\r\n> 子类通过继承可以拥有和父类相同的特征和行为，另外，子类也可以定义自己特有的行为，既沿袭了父类的方法名称，又重新实现了父类方法，这就是方法重写。\r\n\r\n> 在子类中可以根据需求对从父类继承的方法进行重写编写，这被称为方法重写或方法覆盖。\r\n\r\n**方法重写必须遵守以下规则：**\r\n* 重写方法和被重写方法必须具有相同的方法名\r\n* 重写方法和被重写方法必须具有相同的参数列表\r\n* 重写方法的返回值类型必须和被重写方法的返回值类型相同或是其子类\r\n* 重写方法不能缩小被重写方法的访问权限\r\n\r\n**重写的时候可以在方法上面使用注解：**\r\n\r\n> @Override\r\n> @Override 是用 Java 注解的方法表示该方法重写了父类方法，可以写也可以不写，在功能实现上没有区别，但是通过 @Override 注解，程序更加方便阅读。另外，编译器也会帮助验证 @Override 下面的方法名是否是父类所有的。如果其不符合方法重写规则，则会报错。\r\n\r\n**提示：**\r\n> Java 注解又被称为 Java 标注，是 Java 5 引入的一种注解机制。  \r\n\r\n#### 🍟2.5、方法重载和方法重写的区别\r\n* 方法重载涉及同一个类中的同名方法，要求方法名相同，参数列表不同，与返回值类型和访问修饰符无关\r\n* 方法重写涉及的是子类和父类之间的同名方法，要求方法名相同，参数列表相同，返回值类型i相同或是其子类\r\n\r\n#### 🍟2.6、super关键字\r\n> 如果想在子类中调用父类的被重写的方法，可以使用 ” super.方法名 “实现\r\n\r\nsuper 关键字代表对当前对象的直接父类对象的默认引用。在子类中可以通过 super 关键字访问父类的成员，包括父类的属性和方法。语法如下：\r\n> 语法：\r\n> 访问父类构造方法 ：super(参数)\r\n> 访问父类属性 / 方法 ：super.< 父类属性 / 方法 \\>\r\n\r\n使用 super 关键字，需要注意以下几点：\r\n* super 关键字必须出现在子类（子类的方法和构造方法）中，而不允许在其他位置。\r\n* 可以访问父类的成员，如父类的属性，方法，构造方法。\r\n* 注意访问权限的限制，如无法通过 super 关键字访问 private 成员。\r\n\r\n**注意：**\r\n\r\n> 1、在构造方法中如果有 this 语句或 super 语句，则只能是第一条语句。\r\n> 2、在一个构造方法中，不允许同时使用 this 关键字和 super 关键字调用构造方法（否则就有两条第一条语句）。\r\n> 3、在静态方法中不允许出现 this 关键字或 super 关键字。\r\n> 4、在实例方法中，this 语句和 super 语句不要求是第一条语句，可以共存。\r\n> 5、子类构造方法中第一行有隐藏的 **super( )** 调用父类构造方法，最终父类一定是 Object 类\r\n\r\n#### 🍟2.7、继承关系中的构造方法\r\n在 Java 中，一个类的构造方法在如下两种情况下会被执行：\r\n* 创建该类对象（实例化）\r\n* 创建该类的子类对象（子类的实例化）\r\n\r\n> 子类在实例化时，会首先执行其父类的构造方法，然后才会执行子类的构造方法。\r\n> 在 Java 语言中，当创建一个对象时，Java 虚拟机（JVM）会按照父类——>子类的顺序执行一系列的构造方法。\r\n\r\n**子类继承父类时构造方法的调用规则如下：**\r\n* 如果在类的构造方法中没有通过 super 关键字显式调用父类地带参构造方法，也没有通过 this 关键字显式调用自身地其他构造方法，则系统会默认先调用父类的无参构造方法。在这种情况下，是否写 “ super( );  ”语句，效果是一样的。\r\n* 如果在子类的构造方法中通过 super 关键字显式地调用了父类地带参构造方法，那么将执行父类相应的构造方法，而不执行父类无参构造方法。\r\n* 如果在子类的构造方法中通过 this 关键字显式地调用了自身地其他构造方法，那么在相应构造方法中遵循以上两条规则。\r\n* 如果存在多级继承关系，则在创建一个子类对象时，以上规则会多次向上更高一级父类应用，直到执行顶级父类 Object 类的无参构造方法为止。\r\n\r\n<center>-----------------------<b style=\"color:#C3C326\">世界会向那些有目标和远见的人让路。</b>-----------------------</center>', 1, 1, 1, 266, '2023-10-15 02:26:45', '2023-12-06 00:34:35', 0);
INSERT INTO `t_article` VALUES (2, 1, 1, 'http://cdn.kuailemao.lielfw.cn/articleCover/kuailemao11677588411382186.jpg', 'java的多态啊', '### 🍖3、多态\n![](http://43.136.78.47:9000/blog/article/articleImage/161ccca6-65c9-4ef9-9098-4a6f0446b9f9.png)\n![](http://43.136.78.47:9000/blog/article/articleImage/f34c07f4-f88a-48bf-af18-4daf44db7101.png)\n\n\n> * 面向对象的三大特性为 封装、继承、多态。最后一个特性——多态。它能使同一个操作当作用于不同的对象时，产生不同的执行结果。\n>\n> * 使用多态可以提高代码的可维护性和可扩展性\n\n#### 🍟3.1、子类到父类的转换（向上转型）\n> 子类到父类的转换被称为向上转型。（自动类型转换）\n\n **语法：**\n> < 父类型 \\> < 引用变量名 \\> = new < 子类型 \\> ( );\n```Java\n	Strive strive1 = new s1();\n```\nStrive 为父类型 strive1 为引用变量名 s1 为子类型\n\n* 父类型的引用指向子类型的对象\n\n**实现多态的三个条件如下：**\n\n> 1、继承的存在（继承是多态的继承，没有继承就没有多态）。\n>\n> > 2、子类重写父类的方法（多态下调用子类重写后的方法）。\n> >\n> > > 3、父类引用变量指向子类对象（向上转型）。\n\n#### 🍟3.2、父类到子类的转换（向下转型）\n> 父类到子类的转换被称为向上转型。（强制类型转换）\n\n**语法：**\n> < 子类型 \\> < 引用变量名 \\> = ( < 子类型 \\> ) < 父类型的引用变量 \\>;\n\n```java\n	Strive strive1 = (Strive)s1;\n```\ns1 为 父类型的引用变量，Strive 为子类型，strive1 为引用变量名\n\n#### 🍟3.3、instanceof 运算符\n**语法：**\n\n> 对象 instanceof 类或接口\n\n* 该运算符用来判断一个对象是否属于一个类或实现了一个接口，结果为 **true** 或 **false**。\n* 在强制类型转换之前通过 **instanceof** 运算符检查对象的真实类型，再进行相应的强制类型转换，这样就可以避免类型转换异常，从而提高代码的健壮性。\n\n```java\n	 if(Strive instanceof s1){  // 类型判断\n            Strive strive1 = (Strive)s1;\n        }else{\n        	System.out.println(\"Strive与s1没有关系\");\n        }\n```\n\n#### 🍟3.4、多态的优势\n* 可替换性：多态对已存在的代码具有可替换性\n* 可扩充性：多态对代码具有可扩充性。增加新的子类不影响已存在类的多态性，继承性，以及其他特性的运行和操作。实际上新加子类更容易获得多态功能。\n* 灵活性：在多态的应用中，体现了灵活多样的操作，提高了使用效率。\n* 简化性：多态简化了应用软件的代码编写和修改过程，尤其在处理大量对象的运算和操作时，这个特点尤为突出\n\n**多态的使用大多体现在实际开发中，多写代码，多用多态，慢慢自然能够体验到多态的灵活性以及多态的重要性**', 1, 1, 1, 138, '2022-10-15 02:26:45', '2024-01-23 23:08:12', 1);
INSERT INTO `t_article` VALUES (3, 1, 2, 'http://cdn.kuailemao.lielfw.cn/PicGo/idea%E8%83%8C%E6%99%AF.png', '今天出去玩了', '好好玩啊，好好玩啊，好好玩啊，好好玩啊，好好玩啊，好好玩啊，好好玩啊，好好玩啊，好好玩啊，好好玩啊，好好玩啊，好好玩啊，好好玩啊，好好玩啊，', 1, 1, 1, 133, '2023-10-15 02:26:45', '2024-01-08 10:41:42', 0);
INSERT INTO `t_article` VALUES (24, 1, 3, 'http://cdn.kuailemao.lielfw.cn/PicGo/idea%E8%83%8C%E6%99%AF.png', '测试分类3', '好好玩啊，好好玩啊，好好玩啊，好好玩啊，好好玩啊，好好玩啊，好好玩啊，好好玩啊，好好玩啊，好好玩啊，好好玩啊，好好玩啊，好好玩啊，好好玩啊，', 1, 0, 1, 131, '2023-10-15 02:26:45', '2023-10-18 00:34:35', 0);
INSERT INTO `t_article` VALUES (32, 1, 4, 'http://43.136.78.47:9000/blog/article/articleCover/d4574635-ba1d-4c01-beda-1ad25c4db0e3.png', '测试文章', '## 这是一篇测试文章\n> 你看见这篇文章说明后台发布文章功能成功\n\n```mermaid\ngantt\ntitle A Gantt Diagram\ndateFormat  YYYY-MM-DD\nsection Section\nA task  :a1, 2014-01-01, 30d\nAnother task  :after a1, 20d\n```\n\n### 图表\n```mermaid\nclassDiagram\n  class Animal\n  Vehicle <|-- Car\n```\n', 1, 0, 1, 7, '2024-01-04 21:32:19', '2024-01-08 10:48:06', 0);
INSERT INTO `t_article` VALUES (33, 1, 2, 'http://43.136.78.47:9000/blog/article/articleCover/4580f62d-0548-47c5-8e94-42fb4dae1560.png', '图片上传', '# 测试图片上传\n## 下面是预览图\n> ![](http://43.136.78.47:9000/blog/article/articleImage/bc35310c-fe3c-487b-9d06-e2d66bec9a3a.gif)\n### 剪切上传\n![](http://43.136.78.47:9000/blog/article/articleImage/1f0b3ec4-91aa-4165-b1f8-060e89baf783.png)\n![](http://43.136.78.47:9000/blog/article/articleImage/0d45c380-4f54-42e6-8c94-fb589c6444f2.gif)\n', 1, 0, 1, 1, '2024-01-05 16:49:37', '2024-01-09 23:53:42', 1);
INSERT INTO `t_article` VALUES (37, 1, 1, 'http://43.136.78.47:9000/blog/article/articleCover/72494e09-3fae-4a7d-bfe9-37108bfd3766.png', '测是AA', '顶顶顶', 1, 0, 1, 0, '2024-01-08 10:39:36', '2024-01-09 23:47:46', 1);
INSERT INTO `t_article` VALUES (38, 1, 5, 'http://43.136.78.47:9000/blog/article/articleCover/152113cc-ea0e-451e-8912-4eea8ba5096f.png', '测试添加', '| col | col | col | col |\n| - | - | - | - |\n| content | content | content | content |\n| content | content | content | content |\n| content | content | content | content |\n```mermaid\nerDiagram\n  CAR ||--o{ NAMED-DRIVER : allows\n  PERSON ||--o{ NAMED-DRIVER : is\n```\n```mermaid\njourney\n  title My working day\n  section Go to work\n    Make tea: 5: Me\n    Go upstairs: 3: Me\n    Do work: 1: Me, Cat\n  section Go home\n    Go downstairs: 5: Me\n    Sit down: 5: Me\n```\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n', 1, 0, 1, 0, '2024-01-08 10:49:50', '2024-01-09 23:44:35', 1);
INSERT INTO `t_article` VALUES (39, 1, 2, 'http://43.136.78.47:9000/blog/article/articleCover/ba380480-c8d6-40aa-822a-6105e03eb259.jpg', '测试删除', '删除', 1, 0, 1, 0, '2024-01-09 23:51:49', '2024-01-09 23:53:42', 1);
INSERT INTO `t_article` VALUES (40, 1, 1, 'http://43.136.78.47:9000/blog/article/articleCover/cfce7f30-f9e7-4ca4-81b9-c0831cc9c221.png', '测试', '新文章', 1, 0, 1, 0, '2024-02-28 14:05:36', '2024-02-28 14:05:36', 0);

-- Records of t_article_tag
-- ----------------------------
INSERT INTO `t_article_tag` VALUES (1, 1, 1, '2023-10-15 02:04:40', 0);
INSERT INTO `t_article_tag` VALUES (2, 1, 2, '2023-10-15 02:04:47', 0);
INSERT INTO `t_article_tag` VALUES (3, 1, 3, '2023-10-15 02:04:57', 0);
INSERT INTO `t_article_tag` VALUES (28, 24, 2, '2023-10-29 23:07:40', 0);
INSERT INTO `t_article_tag` VALUES (29, 2, 3, '2023-10-15 02:04:57', 1);
INSERT INTO `t_article_tag` VALUES (30, 2, 1, '2023-10-15 02:04:57', 1);
INSERT INTO `t_article_tag` VALUES (31, 3, 3, '2023-10-15 02:04:57', 0);
INSERT INTO `t_article_tag` VALUES (32, 3, 5, '2023-10-30 10:16:22', 0);
INSERT INTO `t_article_tag` VALUES (33, 24, 4, '2023-10-30 10:16:36', 0);
INSERT INTO `t_article_tag` VALUES (34, 27, 2, '2024-01-04 17:11:13', 0);
INSERT INTO `t_article_tag` VALUES (35, 27, 3, '2024-01-04 17:11:13', 0);
INSERT INTO `t_article_tag` VALUES (36, 27, 4, '2024-01-04 17:11:13', 0);
INSERT INTO `t_article_tag` VALUES (37, 28, 2, '2024-01-04 17:22:13', 0);
INSERT INTO `t_article_tag` VALUES (38, 28, 3, '2024-01-04 17:22:13', 0);
INSERT INTO `t_article_tag` VALUES (39, 28, 4, '2024-01-04 17:22:13', 0);
INSERT INTO `t_article_tag` VALUES (40, 29, 5, '2024-01-04 17:46:31', 0);
INSERT INTO `t_article_tag` VALUES (41, 29, 4, '2024-01-04 17:46:31', 0);
INSERT INTO `t_article_tag` VALUES (42, 30, 2, '2024-01-04 17:47:07', 0);
INSERT INTO `t_article_tag` VALUES (43, 31, 3, '2024-01-04 17:47:35', 0);
INSERT INTO `t_article_tag` VALUES (44, 31, 5, '2024-01-04 17:47:35', 0);
INSERT INTO `t_article_tag` VALUES (45, 32, 3, '2024-01-04 21:32:19', 0);
INSERT INTO `t_article_tag` VALUES (46, 32, 2, '2024-01-04 21:32:19', 0);
INSERT INTO `t_article_tag` VALUES (47, 33, 2, '2024-01-05 16:49:37', 1);
INSERT INTO `t_article_tag` VALUES (48, 33, 3, '2024-01-05 16:49:37', 1);
INSERT INTO `t_article_tag` VALUES (49, 2, 1, '2024-01-08 10:30:26', 1);
INSERT INTO `t_article_tag` VALUES (50, 2, 3, '2024-01-08 10:30:26', 1);
INSERT INTO `t_article_tag` VALUES (51, 2, 1, '2024-01-08 10:30:41', 1);
INSERT INTO `t_article_tag` VALUES (52, 2, 3, '2024-01-08 10:30:41', 1);
INSERT INTO `t_article_tag` VALUES (53, 2, 1, '2024-01-08 10:31:48', 1);
INSERT INTO `t_article_tag` VALUES (54, 2, 3, '2024-01-08 10:31:48', 1);
INSERT INTO `t_article_tag` VALUES (55, 34, 5, '2024-01-08 10:37:04', 0);
INSERT INTO `t_article_tag` VALUES (56, 35, 5, '2024-01-08 10:37:19', 0);
INSERT INTO `t_article_tag` VALUES (57, 36, 3, '2024-01-08 10:38:13', 0);
INSERT INTO `t_article_tag` VALUES (58, 37, 4, '2024-01-08 10:39:36', 1);
INSERT INTO `t_article_tag` VALUES (59, 37, 2, '2024-01-08 10:39:36', 1);
INSERT INTO `t_article_tag` VALUES (60, 3, 3, '2024-01-08 10:41:42', 0);
INSERT INTO `t_article_tag` VALUES (61, 3, 5, '2024-01-08 10:41:42', 0);
INSERT INTO `t_article_tag` VALUES (62, 37, 2, '2024-01-08 10:42:07', 1);
INSERT INTO `t_article_tag` VALUES (63, 37, 4, '2024-01-08 10:42:07', 1);
INSERT INTO `t_article_tag` VALUES (64, 37, 2, '2024-01-08 10:43:01', 1);
INSERT INTO `t_article_tag` VALUES (65, 37, 4, '2024-01-08 10:43:01', 1);
INSERT INTO `t_article_tag` VALUES (66, 37, 2, '2024-01-08 10:43:19', 1);
INSERT INTO `t_article_tag` VALUES (67, 37, 4, '2024-01-08 10:43:19', 1);
INSERT INTO `t_article_tag` VALUES (68, 32, 2, '2024-01-08 10:44:57', 0);
INSERT INTO `t_article_tag` VALUES (69, 32, 3, '2024-01-08 10:44:57', 0);
INSERT INTO `t_article_tag` VALUES (70, 37, 2, '2024-01-08 10:47:44', 1);
INSERT INTO `t_article_tag` VALUES (71, 37, 4, '2024-01-08 10:47:44', 1);
INSERT INTO `t_article_tag` VALUES (72, 32, 2, '2024-01-08 10:48:06', 0);
INSERT INTO `t_article_tag` VALUES (73, 32, 3, '2024-01-08 10:48:06', 0);
INSERT INTO `t_article_tag` VALUES (74, 38, 4, '2024-01-08 10:49:50', 1);
INSERT INTO `t_article_tag` VALUES (75, 38, 3, '2024-01-08 10:49:50', 1);
INSERT INTO `t_article_tag` VALUES (76, 2, 1, '2024-01-08 10:57:52', 1);
INSERT INTO `t_article_tag` VALUES (77, 2, 3, '2024-01-08 10:57:52', 1);
INSERT INTO `t_article_tag` VALUES (78, 39, 2, '2024-01-09 23:51:49', 1);
INSERT INTO `t_article_tag` VALUES (79, 40, 2, '2024-02-28 14:05:36', 0);

-- Records of t_category
-- ----------------------------
INSERT INTO `t_category` VALUES (1, '生活', '2023-10-15 02:03:42', '2023-10-15 02:03:45', 0);
INSERT INTO `t_category` VALUES (2, '技术', '2023-10-15 02:03:53', '2023-10-15 02:03:56', 0);
INSERT INTO `t_category` VALUES (3, '娱乐', '2023-10-15 02:04:04', '2023-10-15 02:04:06', 0);
INSERT INTO `t_category` VALUES (4, '分类', '2024-01-04 11:23:27', '2024-01-04 11:23:27', 0);
INSERT INTO `t_category` VALUES (5, '测试', '2024-01-08 10:48:43', '2024-01-18 22:52:54', 1);
INSERT INTO `t_category` VALUES (9, '测添加', '2024-01-18 22:53:01', '2024-01-18 22:53:06', 1);
INSERT INTO `t_category` VALUES (10, '修改', '2024-01-18 22:53:12', '2024-01-18 22:53:29', 1);

-- Records of t_comment
-- ----------------------------
INSERT INTO `t_comment` VALUES (1, 1, 1, NULL, NULL, '这是一条父评论[3d眼镜]', 1, NULL, 1, '2021-01-01 12:00:00', '2021-01-01 12:00:00', 0);
INSERT INTO `t_comment` VALUES (13, 1, 1, NULL, NULL, '这是一条父评论啊', 1, NULL, 1, '2021-01-01 12:00:00', '2024-01-22 20:12:13', 0);
INSERT INTO `t_comment` VALUES (43, 2, 4, NULL, NULL, '666[哭泣]', 1, NULL, 1, '2023-11-06 11:30:23', '2023-11-06 11:30:23', 0);
INSERT INTO `t_comment` VALUES (44, 2, 4, 43, 43, '哈哈哈🤑', 1, 1, 1, '2023-11-06 11:32:30', '2023-11-06 11:32:30', 0);
INSERT INTO `t_comment` VALUES (47, 2, 4, 41, 46, '好像是', 1, 1, 1, '2023-11-06 11:35:34', '2023-11-06 11:35:34', 0);
INSERT INTO `t_comment` VALUES (48, 2, 3, NULL, NULL, '你好啊[扶额]', 1, NULL, 1, '2023-12-17 17:13:09', '2023-12-17 17:13:09', 0);
INSERT INTO `t_comment` VALUES (51, 2, 2, NULL, NULL, '😦', 1, NULL, 1, '2024-01-07 21:24:30', '2024-01-07 21:24:30', 0);
INSERT INTO `t_comment` VALUES (52, 1, 3, NULL, NULL, '你好啊😁', 88065988, NULL, 1, '2024-02-28 11:01:34', '2024-02-28 11:01:34', 0);
INSERT INTO `t_comment` VALUES (53, 1, 1, 13, 13, '子评论回复😍😍', 88065988, 1, 1, '2024-02-28 11:02:15', '2024-02-28 11:02:15', 0);
INSERT INTO `t_comment` VALUES (54, 1, 1, 1, 1, '表情包[微笑]', 88065988, 1, 1, '2024-02-28 11:02:33', '2024-02-28 11:02:33', 0);
INSERT INTO `t_comment` VALUES (55, 1, 1, 1, 54, '哈哈[不服吗]', 88065988, 88065988, 1, '2024-02-28 11:02:59', '2024-02-28 11:02:59', 0);
INSERT INTO `t_comment` VALUES (56, 1, 3, 52, 52, '你好[哈士奇失望]', 88065987, 88065988, 1, '2024-02-28 11:13:43', '2024-02-28 11:13:43', 0);

-- Records of t_favorite
-- ----------------------------
INSERT INTO `t_favorite` VALUES (162, 1, 1, 3, 1, '2024-01-18 10:00:41', 0);
INSERT INTO `t_favorite` VALUES (163, 1, 1, 24, 1, '2024-01-19 10:00:48', 0);

-- Records of t_leave_word
-- ----------------------------
INSERT INTO `t_leave_word` VALUES (13, 1, '## 测试比较长的留言\\n\\n> 下面是一篇 c# 笔记\\n\\n<center>\\n    <h1>C#笔记</h1>\\n</center>\\n\\n\\n\\n[TOC] \\n\\n### 1、C#访问修饰符\\n\\n​\\t\\t在C#当中的访问修饰符及作用范围如下：\\n\\n|     访问修饰符     |                        说明                        |\\n| :----------------: | :------------------------------------------------: |\\n|       public       |              共有访问。不受任何限制。              |\\n|      private       |      私有访问。只有本类能访问，实例不能访问。      |\\n|     protected      |   保护访问。只限于本类和子类访问，实例不能访问。   |\\n|      internal      |      内部访问。只限于本项目访问，其他不能访问      |\\n| protected internal | 内部保护访问。只限于本项目或子类访问，其他不能访问 |\\n\\n​\\t\\tC#成员类型的可修饰及默认修饰符如下：\\n\\n| 成员类型  | 默认修饰符 |                           可被修饰                           |\\n| :-------: | :--------: | :----------------------------------------------------------: |\\n|   enum    |   public   |                             none                             |\\n|   class   |  private   | public、protected、internal、private、<br />protected internal |\\n| interface |   public   |                             none                             |\\n|  struct   |  private   |                  public、internal、private                   |\\n\\n> public 访问级别最高\\n>\\n> private 访问级别最低\\n\\n### 2、this 关键字\\n\\n看以下代码，有什么问题：\\n\\n```C#\\nclass Strdent\\n{\\n    private string _name;\\t//姓名\\t\\n    public int _age = 19;\\t//年龄\\n    public string _cardID = \\\"145236985674526685\\\";\\t//身份证号码\\n    public void SetName(string _name)\\n    {\\n        _name = _name;\\n    }\\n}\\n```\\n\\n分析： 在 Student 类中定义了一个 private 成员变量 _name,在 SetName()方法的参数中也定义了一个与之同名的变量 _name。这时编译器会发现成员变量和方法的参数重名了。\\n此时，编译器无法分辨代码中出现的这两个 _name 那个是成员变量，哪个是方法中的参数。我们可以借助 this 关键字来解决这个问题。\\n\\n> this 关键字是指当前对象本身。通过 this 可以引用当前类的成员变量和方法。\\n\\n因此可以改变以上代码为：\\n\\n```C#\\nclass Strdent\\n{\\n    private string _name;\\t//姓名\\t\\n    public int _age = 19;\\t//年龄\\n    public string _cardID = \\\"145236985674526685\\\";\\t//身份证号码\\n    public void SetName(string _name)\\n    {\\n        this._name = _name;\\n    }\\n}\\n```\\n\\n> 使用 this 关键字可以解决成员变量和局部变量名称冲突的问题。\\n\\n### 3、C#属性\\n\\n#### 3.1、用方法保证数据安全', 1, '2024-01-16 12:15:27', '2024-01-16 12:15:27', 0);
INSERT INTO `t_leave_word` VALUES (23, 1, '# \\u6DFB\\u52A0\\u7559\\u8A00\\u677F\\\\n\\\\n* \\u6DFB\\u52A0\\u6D4B\\u8BD5\\\\n* dddd', 1, '2024-01-16 13:10:40', '2024-01-16 13:10:40', 0);
INSERT INTO `t_leave_word` VALUES (24, 1, '# 添加留言板\n\n* 添加测试aaa', 1, '2024-01-16 13:16:24', '2024-01-16 13:16:24', 0);
INSERT INTO `t_leave_word` VALUES (25, 1, '## 测试比较长的留言\n\n> 下面是一篇 c# 笔记\n\n<center>\n    <h1>C#笔记</h1>\n</center>\n\n\n\n[TOC] \n\n### 1、C#访问修饰符\n\n​		在C#当中的访问修饰符及作用范围如下：\n\n|     访问修饰符     |                        说明                        |\n| :----------------: | :------------------------------------------------: |\n|       public       |              共有访问。不受任何限制。              |\n|      private       |      私有访问。只有本类能访问，实例不能访问。      |\n|     protected      |   保护访问。只限于本类和子类访问，实例不能访问。   |\n|      internal      |      内部访问。只限于本项目访问，其他不能访问      |\n| protected internal | 内部保护访问。只限于本项目或子类访问，其他不能访问 |\n\n​		C#成员类型的可修饰及默认修饰符如下：\n\n| 成员类型  | 默认修饰符 |                           可被修饰                           |\n| :-------: | :--------: | :----------------------------------------------------------: |\n|   enum    |   public   |                             none                             |\n|   class   |  private   | public、protected、internal、private、<br />protected internal |\n| interface |   public   |                             none                             |\n|  struct   |  private   |                  public、internal、private                   |\n\n> public 访问级别最高\n>\n> private 访问级别最低\n\n### 2、this 关键字\n\n看以下代码，有什么问题：\n\n```C#\nclass Strdent\n{\n    private string _name;	//姓名	\n    public int _age = 19;	//年龄\n    public string _cardID = \"145236985674526685\";	//身份证号码\n    public void SetName(string _name)\n    {\n        _name = _name;\n    }\n}\n```\n\n分析： 在 Student 类中定义了一个 private 成员变量 _name,在 SetName()方法的参数中也定义了一个与之同名的变量 _name。这时编译器会发现成员变量和方法的参数重名了。\n此时，编译器无法分辨代码中出现的这两个 _', 1, '2024-01-16 13:25:08', '2024-01-16 13:25:08', 0);
INSERT INTO `t_leave_word` VALUES (26, 1, '## 测试留言Markdown 编写\n\n> 不要报错\n\n> ~~没有bug~~', 1, '2024-01-16 13:27:50', '2024-01-16 13:27:50', 0);
INSERT INTO `t_leave_word` VALUES (27, 1, '### 留言bug 最后测试', 1, '2024-01-16 13:29:34', '2024-01-16 13:30:23', 0);

-- Records of t_like
-- ----------------------------
INSERT INTO `t_like` VALUES (257, 1, 2, 5, '2023-11-06 11:02:40', '2023-11-06 11:02:40');
INSERT INTO `t_like` VALUES (261, 1, 3, 4, '2023-11-06 11:28:30', '2023-11-06 11:28:30');
INSERT INTO `t_like` VALUES (262, 1, 3, 5, '2023-11-06 11:28:36', '2023-11-06 11:28:36');
INSERT INTO `t_like` VALUES (263, 1, 2, 46, '2023-11-06 11:35:39', '2023-11-06 11:35:39');
INSERT INTO `t_like` VALUES (264, 1, 2, 41, '2023-11-06 11:35:41', '2023-11-06 11:35:41');
INSERT INTO `t_like` VALUES (269, 1, 2, 26, '2023-12-11 16:44:51', '2023-12-11 16:44:51');
INSERT INTO `t_like` VALUES (283, 1, 1, 3, '2024-01-01 23:20:59', '2024-01-01 23:20:59');

-- Records of t_link
-- ----------------------------
INSERT INTO `t_link` VALUES (1, 1, '网站名称', 'http://www.example.com', '这是一个示例网站', 'http://cdn.kuailemao.lielfw.cn/articleCover/21676717033297579.jpg', 1, 'example@example.com', '2023-11-14 10:13:07', '2024-02-28 10:22:45', 0);
INSERT INTO `t_link` VALUES (2, 1, '网站名称', 'http://www.example.com', '这是一个示例网站', 'http://cdn.kuailemao.lielfw.cn/articleCover/21676717033297579.jpg', 1, 'example@example.com', '2023-11-14 10:32:55', '2024-01-22 21:38:45', 0);
INSERT INTO `t_link` VALUES (4, 1, '网站名称', 'https://www.baidu.com/', '这是一个示例网站这是一个示例网站这是一个示例网站都是进口粮', 'http://cdn.kuailemao.lielfw.cn/articleCover/21676717033297579.jpg', 1, 'example@example.com', '2023-11-14 10:37:29', '2023-11-14 10:37:29', 0);
INSERT INTO `t_link` VALUES (6, 1, '网站名称', 'http://www.example.com', '这是一个示例网站', 'http://cdn.kuailemao.lielfw.cn/articleCover/21676717033297579.jpg', 1, 'example@example.com', '2023-11-14 10:56:16', '2023-11-14 10:56:16', 0);
INSERT INTO `t_link` VALUES (8, 1, '网站名称', 'http://www.example.com', '这是一个示例网站', 'http://cdn.kuailemao.lielfw.cn/articleCover/Sara11676693097117968.png', 1, 'example@example.com', '2023-11-14 10:57:50', '2023-11-14 10:57:50', 0);
INSERT INTO `t_link` VALUES (18, 1, '无语小站', '  http://localhost:99/', '无语小站无语小站', 'http://cdn.kuailemao.lielfw.cn/articleCover/21676717033297579.jpg', 1, '3490223402@qq.com', '2024-01-22 21:55:08', '2024-01-22 21:55:36', 0);

-- Records of t_tag
-- ----------------------------
INSERT INTO `t_tag` VALUES (1, 'java', '2023-10-15 02:02:28', '2023-10-15 02:02:30', 0);
INSERT INTO `t_tag` VALUES (2, 'python', '2023-10-15 02:02:53', '2023-10-15 02:02:55', 0);
INSERT INTO `t_tag` VALUES (3, 'c#', '2023-10-15 02:03:06', '2023-10-15 02:03:09', 0);
INSERT INTO `t_tag` VALUES (4, 'c++', '2023-10-15 02:03:23', '2023-10-15 02:03:25', 0);
INSERT INTO `t_tag` VALUES (5, '开心', '2023-10-15 23:17:19', '2023-10-15 23:17:22', 0);

-- Records of t_tree_hole
-- ----------------------------
INSERT INTO `t_tree_hole` VALUES (1, 1, '测试添加', 1, '2023-10-30 11:32:30', '2023-10-30 11:32:30', 0);
INSERT INTO `t_tree_hole` VALUES (29, 1, '真的是服了！！', 1, '2023-10-30 16:41:15', '2023-10-30 16:41:15', 0);
INSERT INTO `t_tree_hole` VALUES (30, 1, '记得一定要快乐啊！！', 1, '2023-10-30 16:41:57', '2024-01-19 21:31:21', 0);
INSERT INTO `t_tree_hole` VALUES (34, 1, '天天开心', 1, '2024-01-19 21:33:24', '2024-01-19 21:33:24', 0);