<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
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
</script>

<template>
  <div style="text-align: center; margin: 0 20px">
    <div style="margin-top: 100px">
      <div style="font-size: 25px; font-weight: bold">登录</div>
      <div style="font-size: 14px; color: grey; margin-top: 1rem">
        使用邮箱和密码登录你的账户
      </div>
    </div>

    <div style="margin-top: 50px">
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item prop="email">
          <el-input v-model="form.email" maxlength="50" type="email" placeholder="邮箱">
            <template #prefix><el-icon><User /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            maxlength="20"
            placeholder="密码"
            @keyup.enter="handleLogin()"
          >
            <template #prefix><el-icon><Lock /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12" style="text-align: left">
            <el-form-item prop="remember">
              <el-checkbox v-model="form.remember" label="记住我" />
            </el-form-item>
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-link @click="$router.push('/user/reset')">忘记密码</el-link>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div style="margin-top: 30px">
      <el-button style="width: 270px" type="success" plain @click="handleLogin">
        登录
      </el-button>
    </div>

    <el-divider>
      <span style="font-size: 13px; color: grey">没有账号？</span>
    </el-divider>
    <div>
      <el-button style="width: 270px" type="danger" plain @click="$router.push('/user/register')">
        去注册
      </el-button>
    </div>

    <!-- 第三方登录 -->
    <el-divider>
      <span style="font-size: 13px; color: grey">其他方式</span>
    </el-divider>
    <div class="oauth-links">
      <!-- GitHub: type=22 -->
      <el-link @click="() => { window.location.href = '/api/app-api/blog/auth/social-auth-redirect?type=22&redirectUri=' + encodeURIComponent(window.location.origin + '/user/login') }">
        <svg-icon name="github" width="20px" height="20px" color="#4E86F1" />
      </el-link>
      <!-- QQ: type=21 -->
      <el-link style="margin-left: 1rem" @click="() => { window.location.href = '/api/app-api/blog/auth/social-auth-redirect?type=21&redirectUri=' + encodeURIComponent(window.location.origin + '/user/login') }">
        <svg-icon name="gitee" width="20px" height="20px" color="#4E86F1" />
      </el-link>
    </div>
  </div>
</template>

<style scoped>
.oauth-links {
  display: flex;
  justify-content: center;
}
</style>
