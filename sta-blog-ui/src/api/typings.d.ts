declare namespace API {
  type addVisitCountParams = {
    /** 文章ID */
    id: number;
  };

  type AppArticleRespVO = {
    /** 文章编号 */
    id?: number;
    /** 分类编号 */
    categoryId?: number;
    /** 分类名称 */
    categoryName?: string;
    /** 封面图路径 */
    coverPath?: string;
    /** 文章标题 */
    title?: string;
    /** 文章内容（仅详情接口返回） */
    content?: string;
    /** 省略内容（列表接口返回，截取前N个字符） */
    summary?: string;
    /** 字数统计 */
    wordCount?: number;
    /** 访问量 */
    visitCount?: number;
    /** 点赞量 */
    likeCount?: number;
    /** 收藏量 */
    favoriteCount?: number;
    /** 评论量 */
    commentCount?: number;
    /** 当前用户是否已点赞 */
    isLiked?: boolean;
    /** 当前用户是否已收藏 */
    isFavorited?: boolean;
    /** 标签编号列表 */
    tagIds?: number[];
    /** 标签名称列表 */
    tagNames?: string[];
    /** 创建时间 */
    createTime?: string;
  };

  type AppAuthLoginRespVO = {
    /** 用户编号 */
    userId: number;
    /** 访问令牌 */
    accessToken: string;
    /** 刷新令牌 */
    refreshToken: string;
    /** 过期时间 */
    expiresTime: string;
    /** 社交用户 openid */
    openid?: string;
  };

  type AppCategoryRespVO = {
    /** 分类编号 */
    id: number;
    /** 分类名称 */
    categoryName: string;
    /** 文章数量 */
    articleCount?: number;
  };

  type AppCommentCreateReqVO = {
    /** 文章ID */
    articleId: number;
    /** 父级ID（评论传0，回复传被回复的评论/回复ID） */
    parentId?: number;
    /** 内容 */
    content: string;
    /** 被回复用户ID（评论传0） */
    toUserId?: number;
  };

  type AppCommentRespVO = {
    /** 评论编号 */
    id: number;
    /** 评论类型（10文章 20评论 21评论回复 30留言 31留言回复 51封面图 52轮播图 53banner图） */
    type?: 10 | 20 | 21 | 30 | 31 | 51 | 52 | 53 | 54;
    /** 文章ID */
    articleId?: number;
    /** 父级ID */
    parentId?: number;
    /** 根节点ID（顶级评论为0，回复指向根评论） */
    rootId?: number;
    /** 内容 */
    content?: string;
    /** 用户ID */
    userId?: number;
    /** 用户昵称 */
    userNickname?: string;
    /** 用户头像 */
    userAvatar?: string;
    /** 被回复用户ID */
    toUserId?: number;
    /** 被回复用户昵称 */
    toUserNickname?: string;
    /** 是否通过（0否 1是） */
    status?: number;
    /** IP属地 */
    ipLocation?: string;
    /** 浏览器 */
    browser?: string;
    /** 操作系统 */
    os?: string;
    /** 点赞量 */
    likeCount?: number;
    /** 当前用户是否已点赞 */
    isLiked?: boolean;
    /** 创建时间 */
    createTime?: string;
    /** 回复数 */
    replyCount?: number;
    /** 回复列表（嵌套树结构） */
    replies?: AppCommentRespVO[];
  };

  type AppEmailLoginReqVO = {
    /** 邮箱 */
    email: string;
    /** 密码 */
    password: string;
  };

  type AppEmailRegisterReqVO = {
    /** 用户名 */
    username: string;
    /** 邮箱 */
    email: string;
    /** 密码 */
    password: string;
    /** 邮箱验证码 */
    code: string;
  };

  type AppFavoriteReqVO = {
    /** 收藏类型（10文章） */
    type: 10 | 20 | 21 | 30 | 31 | 51 | 52 | 53 | 54;
    /** 目标ID（文章ID） */
    typeId: number;
  };

  type AppFavoriteRespVO = {
    /** 收藏编号 */
    id: number;
    /** 收藏类型（1文章 2留言板） */
    type?: 10 | 20 | 21 | 30 | 31 | 51 | 52 | 53 | 54;
    /** 目标ID */
    dataId?: number;
    /** 是否有效（0否 1是） */
    isCheck?: number;
    /** 创建时间 */
    createTime?: string;
  };

  type AppImageRespVO = {
    /** 图片编号 */
    id: number;
    /** 图类型（51封面图 52轮播图 53banner图 54头像） */
    type?: 10 | 20 | 21 | 30 | 31 | 51 | 52 | 53 | 54;
    /** 关联ID */
    coverId?: number;
    /** 图片路径 */
    path?: string;
    /** 图片大小（字节） */
    size?: number;
    /** 图片MIME类型 */
    extension?: string;
    /** 排序 */
    sort?: number;
    /** 创建时间 */
    createTime?: string;
  };

  type AppImageUploadRespVO = {
    /** 图片访问 URL */
    url: string;
    /** 图片编号 */
    id?: number;
  };

  type AppLikeReqVO = {
    /** 点赞类型（10文章 20评论 30留言） */
    type: 10 | 20 | 21 | 30 | 31 | 51 | 52 | 53 | 54;
    /** 目标ID（文章ID/评论ID/留言ID） */
    typeId: number;
  };

  type AppLinkApplyReqVO = {
    /** 网站名称 */
    name: string;
    /** 网站地址 */
    url: string;
    /** 网站描述 */
    description?: string;
    /** 网站背景图 */
    background?: string;
    /** 邮箱地址 */
    email?: string;
  };

  type AppLinkRespVO = {
    /** 友链编号 */
    id: number;
    /** 网站名称 */
    name?: string;
    /** 网站地址 */
    url?: string;
    /** 网站描述 */
    description?: string;
    /** 网站背景图 */
    background?: string;
    /** 邮箱地址 */
    email?: string;
    /** 审核状态 */
    isCheck?: number;
    /** 创建时间 */
    createTime?: string;
  };

  type AppMessageCreateReqVO = {
    /** 内容 */
    content: string;
    /** 父级ID（留言传0，回复传被回复的留言/回复ID） */
    parentId?: number;
    /** 被回复用户ID（留言传0） */
    toUserId?: number;
  };

  type AppMessageRespVO = {
    /** 留言编号 */
    id: number;
    /** 留言类型（30留言 31留言回复） */
    type?: 10 | 20 | 21 | 30 | 31 | 51 | 52 | 53 | 54;
    /** 父级ID */
    parentId?: number;
    /** 根节点ID（顶级留言为0，回复指向根留言） */
    rootId?: number;
    /** 内容 */
    content?: string;
    /** 用户ID */
    userId?: number;
    /** 用户昵称 */
    userNickname?: string;
    /** 用户头像 */
    userAvatar?: string;
    /** 被回复用户ID */
    toUserId?: number;
    /** 被回复用户昵称 */
    toUserNickname?: string;
    /** 是否通过（0否 1是） */
    status?: number;
    /** IP属地 */
    ipLocation?: string;
    /** 浏览器 */
    browser?: string;
    /** 操作系统 */
    os?: string;
    /** 点赞量 */
    likeCount?: number;
    /** 当前用户是否已点赞 */
    isLiked?: boolean;
    /** 创建时间 */
    createTime?: string;
    /** 回复数 */
    replyCount?: number;
    /** 回复列表（嵌套树结构） */
    replies?: AppMessageRespVO[];
  };

  type AppResetPasswordReqVO = {
    /** 邮箱 */
    email: string;
    /** 邮箱验证码 */
    code: string;
    /** 新密码 */
    password: string;
  };

  type AppSendEmailCodeReqVO = {
    /** 邮箱 */
    email: string;
    /** 发送场景（register 注册 / reset 重置密码 / resetEmail 修改邮箱） */
    scene: string;
  };

  type AppSnapshotRespVO = {
    /** 网站信息 */
    websiteInfo?: AppWebsiteInfoRespVO;
    /** 文章列表（含摘要，不含全文） */
    articles?: AppArticleRespVO[];
    /** 分类列表 */
    categories?: AppCategoryRespVO[];
    /** 标签列表 */
    tags?: AppTagRespVO[];
    /** 图片列表 */
    images?: AppImageRespVO[];
  };

  type AppSocialLoginReqVO = {
    /** 社交平台类型（对应 SocialTypeEnum） */
    type: number;
    /** 授权码 */
    code: string;
    /** state */
    state: string;
  };

  type AppTagRespVO = {
    /** 标签编号 */
    id: number;
    /** 标签名称 */
    tagName: string;
    /** 文章数量 */
    articleCount?: number;
  };

  type AppUserInfoRespVO = {
    /** 用户编号 */
    id: number;
    /** 用户昵称 */
    nickname: string;
    /** 用户头像 */
    avatar: string;
    /** 邮箱 */
    email?: string;
    /** 用户性别 */
    sex?: number;
    /** 创建时间 */
    createTime?: string;
  };

  type AppUserUpdatePasswordReqVO = {
    /** 旧密码 */
    oldPassword: string;
    /** 新密码 */
    newPassword: string;
  };

  type AppUserUpdateReqVO = {
    /** 用户昵称 */
    nickname: string;
    /** 头像 */
    avatar: string;
    /** 邮箱 */
    email?: string;
    /** 验证码（修改邮箱时必填） */
    code?: string;
    /** 性别 */
    sex: number;
  };

  type AppWebsiteInfoRespVO = {
    /** 网站信息编号 */
    id: number;
    /** 站长头像 */
    webmasterAvatar?: string;
    /** 站长名称 */
    webmasterName?: string;
    /** 站长文案 */
    webmasterCopy?: string;
    /** 站长资料卡背景图 */
    webmasterProfileBackground?: string;
    /** Gitee链接 */
    giteeLink?: string;
    /** GitHub链接 */
    githubLink?: string;
    /** 网站名称 */
    websiteName?: string;
    /** 头部通知 */
    headerNotification?: string;
    /** 侧面公告 */
    sidebarAnnouncement?: string;
    /** 备案信息 */
    recordInfo?: string;
    /** 开始运行时间 */
    startTime?: string;
    /** 创建时间 */
    createTime?: string;
    /** 更新时间 */
    updateTime?: string;
    /** 文章数量 */
    articleCount?: number;
    /** 分类数量 */
    categoryCount?: number;
    /** 评论数量 */
    commentCount?: number;
    /** 总访问量 */
    visitCount?: number;
    /** 最后更新时间 */
    lastUpdateTime?: string;
    /** 标签数量 */
    tagCount?: number;
  };

  type CommonResultAppArticleRespVO = {
    code?: number;
    msg?: string;
    data?: AppArticleRespVO;
  };

  type CommonResultAppAuthLoginRespVO = {
    code?: number;
    msg?: string;
    data?: AppAuthLoginRespVO;
  };

  type CommonResultAppCategoryRespVO = {
    code?: number;
    msg?: string;
    data?: AppCategoryRespVO;
  };

  type CommonResultAppImageUploadRespVO = {
    code?: number;
    msg?: string;
    data?: AppImageUploadRespVO;
  };

  type CommonResultAppSnapshotRespVO = {
    code?: number;
    msg?: string;
    data?: AppSnapshotRespVO;
  };

  type CommonResultAppUserInfoRespVO = {
    code?: number;
    msg?: string;
    data?: AppUserInfoRespVO;
  };

  type CommonResultAppWebsiteInfoRespVO = {
    code?: number;
    msg?: string;
    data?: AppWebsiteInfoRespVO;
  };

  type CommonResultBoolean = {
    code?: number;
    msg?: string;
    data?: boolean;
  };

  type CommonResultListAppArticleRespVO = {
    code?: number;
    msg?: string;
    data?: AppArticleRespVO[];
  };

  type CommonResultListAppCategoryRespVO = {
    code?: number;
    msg?: string;
    data?: AppCategoryRespVO[];
  };

  type CommonResultListAppCommentRespVO = {
    code?: number;
    msg?: string;
    data?: AppCommentRespVO[];
  };

  type CommonResultListAppFavoriteRespVO = {
    code?: number;
    msg?: string;
    data?: AppFavoriteRespVO[];
  };

  type CommonResultListAppImageRespVO = {
    code?: number;
    msg?: string;
    data?: AppImageRespVO[];
  };

  type CommonResultListAppLinkRespVO = {
    code?: number;
    msg?: string;
    data?: AppLinkRespVO[];
  };

  type CommonResultListAppMessageRespVO = {
    code?: number;
    msg?: string;
    data?: AppMessageRespVO[];
  };

  type CommonResultListAppTagRespVO = {
    code?: number;
    msg?: string;
    data?: AppTagRespVO[];
  };

  type CommonResultLong = {
    code?: number;
    msg?: string;
    data?: number;
  };

  type CommonResultPageResultAppArticleRespVO = {
    code?: number;
    msg?: string;
    data?: PageResultAppArticleRespVO;
  };

  type CommonResultPageResultAppCommentRespVO = {
    code?: number;
    msg?: string;
    data?: PageResultAppCommentRespVO;
  };

  type CommonResultPageResultAppMessageRespVO = {
    code?: number;
    msg?: string;
    data?: PageResultAppMessageRespVO;
  };

  type CommonResultString = {
    code?: number;
    msg?: string;
    data?: string;
  };

  type deleteCommentParams = {
    /** 评论编号 */
    id: number;
  };

  type deleteMessageParams = {
    /** 留言编号 */
    id: number;
  };

  type getArticleListByCategoryIdParams = {
    /** 分类ID */
    categoryId: number;
    /** 当前文章ID（排除自身） */
    articleId: number;
  };

  type getArticleListByCategoryParams = {
    /** 分类ID */
    categoryId: number;
  };

  type getArticleListByTagParams = {
    /** 标签ID */
    tagId: number;
  };

  type getArticleListByTitleAndContentParams = {
    /** 搜索关键词 */
    keyword: string;
  };

  type getArticlePageByCreateTimeParams = {
    /** 分类编号 */
    categoryId?: number;
    /** 标签编号 */
    tagId?: number;
    /** 省略内容长度（默认200） */
    summaryLength?: number;
    /** 页码，从 1 开始 */
    pageNo: number;
    /** 每页条数，最大值为 200 */
    pageSize: number;
  };

  type getArticlePageParams = {
    /** 分类编号 */
    categoryId?: number;
    /** 标签编号 */
    tagId?: number;
    /** 省略内容长度（默认200） */
    summaryLength?: number;
    /** 页码，从 1 开始 */
    pageNo: number;
    /** 每页条数，最大值为 200 */
    pageSize: number;
  };

  type getArticleParams = {
    /** 文章编号 */
    id: number;
  };

  type getCategoryParams = {
    /** 编号 */
    id: number;
  };

  type getCommentCountParams = {
    /** 文章ID */
    articleId: number;
  };

  type getCommentPageParams = {
    /** 文章ID */
    articleId: number;
    orderBy?: string;
    /** 页码，从 1 开始 */
    pageNo: number;
    /** 每页条数，最大值为 200 */
    pageSize: number;
  };

  type getCommentTreeParams = {
    /** 文章ID */
    articleId: number;
  };

  type getImageListParams = {
    /** 图片类型（51封面图 52轮播图 53banner图 54头像） */
    type?: number;
  };

  type getMessagePageParams = {
    orderBy?: string;
    /** 页码，从 1 开始 */
    pageNo: number;
    /** 每页条数，最大值为 200 */
    pageSize: number;
  };

  type getReplyPageParams = {
    /** 根留言ID */
    rootId: number;
    /** 页码，从 1 开始 */
    pageNo: number;
    /** 每页条数，最大值为 200 */
    pageSize: number;
  };

  type getReplyPageParams = {
    /** 根评论ID */
    rootId: number;
    /** 页码，从 1 开始 */
    pageNo: number;
    /** 每页条数，最大值为 200 */
    pageSize: number;
  };

  type getSnapshotArticleParams = {
    /** 文章ID */
    id: number;
    key: string;
  };

  type getSnapshotParams = {
    /** 快照密钥 */
    key: string;
  };

  type isFavoriteParams = {
    /** 收藏类型（10文章） */
    type: 10 | 20 | 21 | 30 | 31 | 51 | 52 | 53 | 54;
    /** 目标ID（文章ID） */
    typeId: number;
  };

  type isLikeParams = {
    /** 点赞类型（10文章 20评论 30留言） */
    type: 10 | 20 | 21 | 30 | 31 | 51 | 52 | 53 | 54;
    /** 目标ID（文章ID/评论ID/留言ID） */
    typeId: number;
  };

  type PageResultAppArticleRespVO = {
    /** 总量 */
    total: number;
    /** 数据 */
    list: AppArticleRespVO[];
  };

  type PageResultAppCommentRespVO = {
    /** 总量 */
    total: number;
    /** 数据 */
    list: AppCommentRespVO[];
  };

  type PageResultAppMessageRespVO = {
    /** 总量 */
    total: number;
    /** 数据 */
    list: AppMessageRespVO[];
  };

  type refreshTokenParams = {
    /** 刷新令牌 */
    refreshToken: string;
  };

  type socialAuthRedirectParams = {
    /** 社交平台类型 */
    type: number;
    /** 回调路径 */
    redirectUri: string;
  };

  type TypeEnum = 10 | 20 | 21 | 30 | 31 | 51 | 52 | 53 | 54;

  type uploadImageParams = {
    /** 图片类型（54头像 51封面 52轮播 53banner） */
    type: number;
    /** 关联数据 ID（头像上传无需填写，后端取当前登录用户） */
    dataId?: number;
    /** 图片附件 */
    file: string;
  };
}
