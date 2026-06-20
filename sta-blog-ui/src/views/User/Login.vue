<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { login } from '@/apis/user'
import { SET_TOKEN } from '@/utils/auth'
import { useUserStore } from '@/store/useUserStore'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const formRef = ref()
const env = import.meta.env

const form = reactive({
  username: '',
  password: '',
  remember: false,
})

const rules = {
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }],
}

async function handleLogin() {
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    const res: any = await login(form)
    if (res.code === 200) {
      SET_TOKEN(res.data.token, res.data.expire, form.remember)
      ElMessage.success('登录成功')
      userStore.getInfo()
      const redirect = (route.query.redirect as string) || '/setting'
      router.push(redirect)
    } else {
      ElMessage.error(res.msg)
    }
  })
}
</script>

<template>
  <div style="text-align: center; margin: 0 20px">
    <!-- 标题区 -->
    <div style="margin-top: 150px">
      <div style="font-size: 25px; font-weight: bold">登录</div>
      <div style="font-size: 14px; color: grey; margin-top: 1rem">
        用户密码使用键式哈希算法加密，请放心注册
      </div>
    </div>

    <!-- 表单 -->
    <div style="margin-top: 50px">
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item prop="username">
          <el-input v-model="form.username" maxlength="20" type="text" placeholder="用户名/邮箱">
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
            <el-link @click="$router.push('/reset')">忘记密码</el-link>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <!-- 登录按钮 -->
    <div style="margin-top: 30px">
      <el-button style="width: 270px" type="success" plain @click="handleLogin">
        登录
      </el-button>
    </div>

    <!-- 去注册 -->
    <el-divider>
      <span style="font-size: 13px; color: grey">没有账号？</span>
    </el-divider>
    <div>
      <el-button style="width: 270px" type="danger" plain @click="$router.push('/register')">
        去注册
      </el-button>
    </div>

    <!-- 第三方登录 -->
    <el-divider>
      <span style="font-size: 13px; color: grey">其他方式</span>
    </el-divider>
    <div class="oauth-links">
      <el-link :href="env.MODE === 'development' ? env.VITE_SERVE + '/oauth/gitee/render' : env.VITE_SERVE + '/api/oauth/gitee/render'">
        <svg-icon name="gitee" width="20px" height="20px" color="#4E86F1" />
      </el-link>
      <el-link style="margin-left: 1rem" :href="env.MODE === 'development' ? env.VITE_SERVE + '/oauth/github/render' : env.VITE_SERVE + '/api/oauth/github/render'">
        <svg-icon name="github" width="20px" height="20px" color="#4E86F1" />
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
