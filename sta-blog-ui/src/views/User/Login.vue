<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { emailLogin } from '@/api/AppBlogAuthController'
import { useUserStore } from '@/store/useUserStore'
import { useAccessStore } from '@/store/useAccessStore'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const accessStore = useAccessStore()
const formRef = ref()

const form = reactive({
  email: '',
  password: '',
  remember: false,
})

const rules = {
  email: [
    { required: true, message: '请输入邮箱' },
    { type: 'email', message: '请输入合法的邮箱地址', trigger: ['blur', 'change'] },
  ],
  password: [{ required: true, message: '请输入密码' }],
}

async function handleLogin() {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      const res: any = await emailLogin({ email: form.email, password: form.password })
      if (res) {
        accessStore.setToken({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          expiresTime: res.expiresTime,
        })
        ElMessage.success('登录成功')
        await userStore.getInfo()
        const redirect = (route.query.redirect as string) || '/setting'
        router.push(redirect)
      }
    } catch (e: any) {
      ElMessage.error(e?.msg || '登录失败')
    }
  })
}

function socialLogin(type: number) {
  window.location.href = `/api/app-api/blog/auth/social-auth-redirect?type=${type}&redirectUri=${encodeURIComponent(window.location.origin + '/user/login')}`
}
</script>

<template>
  <div class="auth-form">
    <!-- 品牌 + 标题 -->
    <div class="auth-brand">
      <div class="brand-logo">
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="var(--accent-primary)" opacity="0.85"/>
          <path d="M7 8h10M7 12h6M7 16h8" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <span class="brand-name">STA Blog</span>
      </div>
      <h1 class="auth-title">欢迎回来</h1>
      <p class="auth-subtitle">登录你的账户继续探索</p>
    </div>

    <!-- 表单 -->
    <el-form :model="form" :rules="rules" ref="formRef" class="auth-fields">
      <el-form-item prop="email">
        <el-input v-model="form.email" maxlength="50" type="email" placeholder="邮箱地址" size="large">
          <template #prefix>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13 2 4"/></svg>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="form.password"
          type="password"
          maxlength="20"
          placeholder="密码"
          size="large"
          show-password
          @keyup.enter="handleLogin()"
        >
          <template #prefix>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </template>
        </el-input>
      </el-form-item>

      <div class="auth-options">
        <el-checkbox v-model="form.remember" label="记住我" />
        <router-link to="/user/reset" class="auth-link">忘记密码?</router-link>
      </div>
    </el-form>

    <!-- 主按钮：胶囊 -->
    <button class="btn-capsule btn-primary" @click="handleLogin">登 录</button>

    <!-- 分割线 -->
    <div class="auth-divider"><span>或</span></div>

    <!-- 社交登录：圆角横排 -->
    <div class="social-row">
      <button class="btn-social" @click="socialLogin(22)">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
        GitHub
      </button>
      <button class="btn-social" @click="socialLogin(21)">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M11.984 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.016 0zm6.09 5.333c.328 0 .593.266.592.593v1.482c0 .303-.195.558-.475.636l-5.437 1.53v6.22c0 .724-.587 1.31-1.31 1.31h-1.482a1.31 1.31 0 0 1-1.31-1.31V9.566l5.948-1.673V6.519c0-.328.265-.593.593-.593h2.88z"/></svg>
        QQ
      </button>
    </div>

    <!-- 注册链接：纯文本 -->
    <p class="auth-footer">
      还没有账号？<router-link to="/user/register" class="auth-link">立即注册</router-link>
    </p>
  </div>
</template>

<style scoped lang="scss">
.auth-form {
  display: flex;
  flex-direction: column;
}

/* ── 品牌区 ── */
.auth-brand {
  text-align: center;
  margin-bottom: 2rem;
}

.brand-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 1rem;
}

.brand-name {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.auth-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.3rem;
}

.auth-subtitle {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
}

/* ── 表单 ── */
.auth-fields {
  :deep(.el-form-item) {
    margin-bottom: 1.25rem;
  }
  :deep(.el-input__wrapper) {
    border-radius: 10px;
    box-shadow: 0 0 0 1px var(--surface-border);
    background: var(--surface-inner-bg);
    transition: box-shadow 0.2s;
  }
  :deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1.5px var(--accent-primary);
  }
  :deep(.el-input__prefix .el-icon),
  :deep(.el-input__prefix svg) {
    color: var(--text-secondary);
  }
}

.auth-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.auth-link {
  color: var(--accent-primary);
  text-decoration: none;
  font-size: 0.85rem;
  &:hover { text-decoration: underline; }
}

/* ── 胶囊按钮（核心操作） ── */
.btn-capsule {
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 23px;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 2px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover { transform: translateY(-1px); }
  &:active { transform: translateY(0); }
}

.btn-primary {
  background: var(--accent-gradient);
  color: #fff;
  box-shadow: 0 4px 20px var(--accent-glow);
  &:hover { box-shadow: 0 6px 28px var(--accent-glow); }
}

/* ── 分割线 ── */
.auth-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 1.5rem 0;
  color: var(--text-secondary);
  font-size: 0.8rem;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--surface-border);
  }
}

/* ── 社交按钮：圆角横排 ── */
.social-row {
  display: flex;
  gap: 12px;
}

.btn-social {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 42px;
  border-radius: 10px;
  border: 1px solid var(--surface-border);
  background: var(--surface-inner-bg);
  color: var(--text-primary);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--bg-hover);
    border-color: var(--accent-primary);
  }
}

/* ── 底部文本链接 ── */
.auth-footer {
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 1.5rem 0 0;
}
</style>
