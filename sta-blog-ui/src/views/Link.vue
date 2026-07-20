<script setup lang="ts">
import { Watermelon } from "@element-plus/icons-vue";
import {
  ElNotification,
  FormInstance,
  FormRules,
} from "element-plus";
import { applyForLink, getLinkList } from "@/api/AppLinkController";
import { useDemotion } from "@/composables/useDemotion";

const dialogVisible = ref(false);
const { isOnline } = useDemotion();

onMounted(() => {
  if (isOnline.value) linkListFunc();
});

const links = ref<API.AppLinkRespVO[]>([]);

async function linkListFunc() {
  try {
    const res: any = await getLinkList();
    links.value = Array.isArray(res) ? res : [];
  } catch {
    links.value = [];
  }
}

/** 技术栈（静态） */
const techSites = [
  { name: "Vue", url: "https://vuejs.org", description: "渐进式 JavaScript 框架", background: "https://vuejs.org/images/logo.png" },
  { name: "Vite", url: "https://vitejs.dev", description: "下一代前端构建工具", background: "https://vitejs.dev/logo.svg" },
  { name: "TypeScript", url: "https://www.typescriptlang.org", description: "JavaScript 的超集语言", background: "data:image/svg+xml,%3Csvg viewBox='0 0 27 26' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='27' height='26' rx='1' fill='%233178c6'/%3E%3Cpath fill='%23fff' fill-rule='evenodd' clip-rule='evenodd' d='M.986 0h24.323c.545 0 .986.437.986.975v24.05c0 .539-.441.975-.986.975H.986C.442 26 0 25.564 0 25.025V.975C0 .437.442 0 .986 0Zm13.632 13.832v-2.132H5.26v2.132h3.34v9.495h2.66v-9.495h3.358Zm1.06 9.244c.429.216.936.378 1.522.487.586.108 1.203.162 1.852.162.632 0 1.233-.06 1.802-.178.569-.12 1.068-.315 1.497-.588s.769-.63 1.019-1.07c.25-.441.375-.985.375-1.634 0-.47-.072-.882-.214-1.237-.143-.354-.35-.669-.62-.944-.269-.276-.592-.523-.969-.742s-.8-.426-1.274-.62c-.346-.141-.657-.277-.932-.41-.275-.132-.509-.267-.701-.405-.193-.138-.341-.284-.445-.438-.105-.154-.157-.328-.157-.523 0-.178.047-.339.14-.482.094-.143.225-.266.396-.369.17-.103.379-.182.627-.239.247-.057.522-.085.825-.085.22 0 .452.016.697.049.245.032.49.082.738.15.247.067.488.152.722.255.234.103.45.222.647.357V12.6c-.401-.152-.84-.264-1.316-.337-.475-.073-1.021-.109-1.637-.109-.627 0-1.22.066-1.782.199-.56.132-1.054.339-1.48.62s-.763.639-1.01 1.074c-.248.435-.371.956-.371 1.561 0 .773.226 1.433.68 1.978.454.546 1.143 1.009 2.066 1.387.363.146.701.289 1.015.43.313.14.584.286.812.437.228.152.408.317.54.495s.198.381.198.608c0 .168-.041.323-.124.466-.082.143-.207.268-.375.373-.168.105-.377.188-.627.247-.25.06-.543.09-.878.09-.572 0-1.139-.1-1.7-.296-.56-.198-1.08-.493-1.558-.888Z'/%3E%3C/svg%3E" },
  { name: "Element Plus", url: "https://element-plus.org", description: "基于 Vue 3 的组件库", background: "https://element-plus.org/images/element-plus-logo.svg" },
  { name: "Pinia", url: "https://pinia.vuejs.org", description: "Vue 官方状态管理库", background: "https://pinia.vuejs.org/logo.svg" },
  { name: "Vue Router", url: "https://router.vuejs.org", description: "Vue 官方路由管理器", background: "https://vuejs.org/images/logo.png" },
];



const form = reactive({
  name: "",
  url: "",
  description: "",
  background: "",
  email: "",
});

const ruleFormRef = ref<FormInstance>();

const rules = reactive<FormRules<any>>({
  name: [
    { required: true, message: "请填写网站名称", trigger: "blur" },
    { min: 3, max: 15, message: "长度小3，最大15", trigger: "blur" },
  ],
  url: [
    { required: true, message: "请填写网站地址", trigger: "blur" },
    { min: 3, max: 50, message: "长度小3，最大50", trigger: "blur" },
  ],
  description: [
    { required: true, message: "请填写网站描述", trigger: "blur" },
    { min: 3, max: 30, message: "长度小3，最大30", trigger: "blur" },
  ],
  background: [
    { required: true, message: "请填写友链背景图链接", trigger: "blur" },
    { min: 3, max: 100, message: "长度小3，最大100", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请填写电子邮件地址", trigger: "blur" },
    { min: 3, max: 20, message: "长度小3，最大20", trigger: "blur" },
  ],
});

function applyLinkFunc() {
  ruleFormRef.value?.validate(async (valid) => {
    if (valid) {
      const res: any = await applyForLink(form);
      if (res !== undefined) {
        ElNotification({
          title: "成功",
          showClose: false,
          duration: 6000,
          message: "友链申请提交成功，待通过审核后会通过邮件通知您，请注意查收",
          type: "success",
        });
        dialogVisible.value = false;
        linkListFunc();
      }
    }
  });
}
</script>

<template>
  <div v-slide-in class="link-page">
    <!-- 申请友链弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      title="申请友链"
      width="35%"
      style="border-radius: 15px"
      append-to-body
      :close-on-click-modal="false"
      :lock-scroll="false"
    >
      <div class="form">
        <el-form :model="form" ref="ruleFormRef" :rules="rules">
          <el-form-item prop="name">
            <el-input v-model="form.name" placeholder="请输入网站名称" maxlength="15" show-word-limit>
              <template #prepend> 网站名称 </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="url">
            <el-input v-model="form.url" placeholder="请输入网站地址" maxlength="50" show-word-limit>
              <template #prepend> 网站地址 </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="description">
            <el-input v-model="form.description" placeholder="请输入网站描述" maxlength="30" show-word-limit>
              <template #prepend> 网站描述 </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="background">
            <el-input v-model="form.background" placeholder="请提供http地址" maxlength="100" show-word-limit>
              <template #prepend> 背景图片 </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input v-model="form.email" placeholder="填写邮箱地址" maxlength="20" show-word-limit>
              <template #prepend> 邮箱地址 </template>
            </el-input>
          </el-form-item>
          <div style="width: 100%; display: flex; flex-direction: row-reverse">
            <el-button type="primary" plain @click="applyLinkFunc">提交申请</el-button>
          </div>
        </el-form>
      </div>
    </el-dialog>

    <!-- 页面标题 + 申请按钮 -->
    <div class="page-header">
      <h1 class="page-title">
        <svg class="page-title-icon" viewBox="0 0 1024 1024" width="1.4rem" height="1.4rem" fill="currentColor">
          <path d="M440.736 696.256l-74.144 74.144c-83.36 83.36-218.912 83.36-302.272 0-83.36-83.36-83.36-218.912 0-302.272l209.568-209.568c83.36-83.36 218.912-83.36 302.272 0 25.248 25.248 43.488 55.104 54.72 87.168l-75.872 75.872c-4.736-39.104-21.76-76.832-51.008-106.048-58.816-58.816-154.368-58.816-213.184 0L81.248 525.12c-58.816 58.816-58.816 154.368 0 213.184 58.816 58.816 154.368 58.816 213.184 0l74.144-74.144c19.456-19.456 45.568-29.056 71.104-28.864 25.504 0.224 51.424 10.112 70.752 29.44l0.304 0.304c0.096 0.096 0.096 0.224 0 0.32l0 0c-19.296 19.296-44.832 29.504-69.984 30.912zM942.752 111.552c-83.36-83.36-218.912-83.36-302.272 0l-74.144 74.144c-19.456 19.456-45.568 29.056-71.104 28.864-25.504-0.224-51.424-10.112-70.752-29.44l-0.304-0.304c-0.096-0.096-0.096-0.224 0-0.32l0 0c19.296-19.296 44.832-29.504 69.984-30.912l74.144-74.144c83.36-83.36 218.912-83.36 302.272 0 83.36 83.36 83.36 218.912 0 302.272L761.008 591.28c-83.36 83.36-218.912 83.36-302.272 0-25.248-25.248-43.488-55.104-54.72-87.168l75.872-75.872c4.736 39.104 21.76 76.832 51.008 106.048 58.816 58.816 154.368 58.816 213.184 0l209.568-209.568c58.816-58.816 58.816-154.368 0-213.184z"/>
        </svg>
        友链
      </h1>
      <el-button type="primary" :icon="Watermelon" plain @click="dialogVisible = true">申请友链</el-button>
    </div>

    <!-- 网站（技术栈） -->
    <div class="link-group">
      <div class="group-header">
        <h2 class="group-title">
          <svg class="group-icon" viewBox="0 0 24 24" width="1.2rem" height="1.2rem" fill="none" stroke="#f66" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
            <polyline points="20 12 9 23 4 18"/>
          </svg>
          网站
        </h2>
        <p class="group-subtitle">重要的事情说一遍</p>
      </div>
      <div class="link-grid">
        <a v-for="site in techSites" :key="site.name" :href="site.url" target="_blank" rel="noopener noreferrer" class="link-card">
          <div class="link-card__avatar" v-slide-in>
            <img :src="site.background" :alt="site.name" loading="lazy" />
          </div>
          <div class="link-card__info">
            <div class="link-card__name">{{ site.name }}</div>
            <div class="link-card__desc">{{ site.description }}</div>
          </div>
        </a>
      </div>
    </div>



    <!-- 友链（数据库） -->
    <div class="link-group">
      <div class="group-header">
        <h2 class="group-title">
          <svg class="group-icon" viewBox="0 0 24 24" width="1.2rem" height="1.2rem" fill="none" stroke="#49b1f5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          友链
        </h2>
        <p class="group-subtitle">欢迎访问友链板块</p>
      </div>
      <div class="link-grid">
        <a
          v-for="link in links"
          :key="link.id"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="link-card"
        >
          <div class="link-card__avatar" v-slide-in>
            <img v-if="link.background" :src="link.background" :alt="link.name" loading="lazy" />
            <div v-else class="link-card__avatar-placeholder">{{ (link.name || '?').charAt(0) }}</div>
          </div>
          <div class="link-card__info">
            <div class="link-card__name">{{ link.name }}</div>
            <div class="link-card__desc">{{ link.description }}</div>
          </div>
        </a>
      </div>
      <div v-if="links.length === 0 && isOnline" class="empty-state">
        <el-empty description="暂无友链，快来申请吧！" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.link-page {
  width: 100%;
  @include surface-card;
  padding: $page-padding;
}

/* ── 弹窗样式 ── */
:deep(.el-dialog__body) {
  padding-top: 0;
}

:deep(.el-dialog) {
  transition: all 0.3s ease-in-out;
  @media (max-width: 1000px) {
    width: 60%;
  }
  @media (max-width: 550px) {
    width: 90%;
  }
}

/* ── 页面标题 ── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;

  .page-title {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &-icon {
      flex-shrink: 0;
      color: var(--accent-primary);
    }
  }
}

/* ─ 分组区域 ── */
.link-group {
  margin-bottom: 3rem;

  &:last-child {
    margin-bottom: 0;
  }
}

/* ── 分组标题 ─ */
.group-header {
  margin-bottom: 1.5rem;
}

.group-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.group-icon {
  flex-shrink: 0;
}

.group-subtitle {
  font-size: 0.95rem;
  color: var(--text-secondary);
  font-style: italic;
  margin: 0;
}

/* ── 链接卡片网格 ── */
.link-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  @media screen and (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media screen and (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

/* ── 单个链接卡片 ── */
.link-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  height: 90px;
  border-radius: $border-radius;
  text-decoration: none;
  color: var(--text-primary);
  overflow: hidden;
  cursor: pointer;
  transform: translateZ(0); /* GPU 加速 */

  /* ── ::before 底色层：scale(0) → scale(1) 从中心展开 ── */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: var(--surface-inner-bg);
    border-radius: $border-radius;
    transform: scale(0);
    transition: transform 0.3s ease-out;
  }

  &:hover::before {
    transform: scale(1);
  }

  /* ── 头像：hover 时缩小消失 ── */
  &__avatar {
    flex-shrink: 0;
    width: 60px;
    height: 60px;
    border-radius: 7px;
    overflow: hidden;
    margin: 0;
    transition: width 0.3s ease-out, margin 0.3s ease-out;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: filter 375ms ease-in 0.2s, transform 0.3s;
    }

    &-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--text-secondary);
      background: var(--bg-hover);
    }
  }

  &:hover &__avatar {
    width: 0;
    margin-left: -10px;
  }

  /* ── 信息区 ── */
  &__info {
    flex: 1;
    min-width: 0;
  }

  &__name {
    font-size: 1.43em;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0;
    padding: 0;
    height: 40px;
    line-height: 40px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__desc {
    font-size: 0.93em;
    color: var(--text-secondary);
    padding: 0;
    height: 30px;
    line-height: 30px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

/* ── 空状态 ── */
.empty-state {
  padding: 3rem 0;
}
</style>
