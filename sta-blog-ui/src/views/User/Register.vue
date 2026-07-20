<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { emailRegister, sendEmailCode } from '@/api/AppBlogAuthController'

const router = useRouter()
const formRef = ref()

const form = reactive({
  username: '',
  password: '',
  password_repeat: '',
  email: '',
  code: '',
})

const validateUsername = (_: any, value: any, callback: any) => {
  if (value === '') callback(new Error('请输入用户名'))
  else if (!/[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(value))
    callback(new Error('用户名不能包含特殊字符，只能是中/英文'))
  else callback()
}

const validatePasswordRepeat = (_: any, value: any, callback: any) => {
  if (value === '') callback(new Error('请再次输入密码'))
  else if (value !== form.password)
    callback(new Error('两次输入的密码不一致'))
  else callback()
}

const rules = {
  username: [{ validator: validateUsername, trigger: ['blur', 'change'] }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码的长度必须在 6-20 个字符之间', trigger: ['blur', 'change'] },
  ],
  password_repeat: [{ validator: validatePasswordRepeat, trigger: ['blur', 'change'] }],
  email: [
    { required: true, message: '请输入邮件地址', trigger: 'blur' },
    { type: 'email', message: '请输入合法的电子邮件地址', trigger: ['blur', 'change'] },
  ],
  code: [{ required: true, message: '请输入获取的验证码', trigger: 'blur' }],
}

const coldTime = ref(0)
const isEmailValid = computed(() =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email),
)

async function askCode() {
  if (!isEmailValid.value) {
    ElMessage.warning('请输入正确的电子邮件')
    return
  }
  coldTime.value = 60
  try {
    const res: any = await sendEmailCode({ email: form.email, scene: 'register' })
    if (res) {
      ElMessage.success(`验证码已发送到邮箱：${form.email}，请注意查收`)
      const intervalId = setInterval(() => {
        if (coldTime.value === 0) clearInterval(intervalId)
        else coldTime.value--
      }, 1000)
    } else {
      coldTime.value = 0
    }
  } catch {
    coldTime.value = 0
    ElMessage.error('验证码发送失败，请稍后重试')
  }
}

async function handleRegister() {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      ElMessage.warning('请完整填写注册表单内容')
      return
    }
    try {
      const res: any = await emailRegister({
        username: form.username,
        email: form.email,
        password: form.password,
        code: form.code,
      })
      if (res) {
        ElMessage.success('注册成功，欢迎加入我们')
        router.push('/user/login')
      }
    } catch (e: any) {
      ElMessage.error(e?.msg || '注册失败，请稍后重试')
    }
  })
}
</script>

<template>
  <div class="auth-form">
    <!-- 标题 -->
    <div class="auth-brand">
      <h1 class="auth-title">创建账户</h1>
      <p class="auth-subtitle">欢迎注册，请填写相关信息</p>
    </div>

    <!-- 表单 -->
    <el-form :model="form" :rules="rules" ref="formRef" class="auth-fields">
      <el-form-item prop="username">
        <el-input v-model="form.username" maxlength="10" placeholder="用户名" size="large">
          <template #prefix>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="form.password" maxlength="20" type="password" placeholder="密码" size="large" show-password>
          <template #prefix>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password_repeat">
        <el-input v-model="form.password_repeat" maxlength="20" type="password" placeholder="确认密码" size="large" show-password>
          <template #prefix>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="email">
        <el-input v-model="form.email" type="email" placeholder="电子邮件地址" size="large">
          <template #prefix>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 4L12 13 2 4"/></svg>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="code">
        <div class="code-row">
          <el-input v-model="form.code" maxlength="6" placeholder="验证码" size="large">
            <template #prefix>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6v6H9z"/></svg>
            </template>
          </el-input>
          <button
            class="btn-code"
            :disabled="!isEmailValid || coldTime > 0"
            @click="askCode"
          >
            {{ coldTime > 0 ? `${coldTime}s` : '获取验证码' }}
          </button>
        </div>
      </el-form-item>
    </el-form>

    <!-- 注册按钮：绿色胶囊 -->
    <button class="btn-capsule btn-success" @click="handleRegister">立即注册</button>

    <!-- 登录链接：纯文本 -->
    <p class="auth-footer">
      已有账号？<router-link to="/user/login" class="auth-link">去登录</router-link>
    </p>
  </div>
</template>

<style scoped lang="scss">
.auth-form {
  display: flex;
  flex-direction: column;
}

.auth-brand {
  text-align: center;
  margin-bottom: 1.5rem;
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
    margin-bottom: 1rem;
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
  :deep(.el-input__prefix svg) {
    color: var(--text-secondary);
  }
}

/* ── 验证码行 ── */
.code-row {
  display: flex;
  gap: 10px;
  width: 100%;

  .el-input { flex: 1; }
}

.btn-code {
  flex-shrink: 0;
  padding: 0 16px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid var(--accent-primary);
  background: transparent;
  color: var(--accent-primary);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: var(--accent-primary);
    color: #fff;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
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
  margin-top: 0.5rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover { transform: translateY(-1px); }
  &:active { transform: translateY(0); }
}

.btn-success {
  background: linear-gradient(135deg, hsl(145, 63%, 42%), hsl(168, 70%, 38%));
  color: #fff;
  box-shadow: 0 4px 20px hsla(150, 60%, 40%, 0.3);
  &:hover { box-shadow: 0 6px 28px hsla(150, 60%, 40%, 0.4); }
}

/* ── 底部文本链接 ── */
.auth-link {
  color: var(--accent-primary);
  text-decoration: none;
  font-size: 0.85rem;
  &:hover { text-decoration: underline; }
}

.auth-footer {
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin: 1.5rem 0 0;
}
</style>
