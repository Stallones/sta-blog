<script setup lang="ts">
import { User, Lock, EditPen, Message } from '@element-plus/icons-vue'
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
  <div style="text-align: center; margin: 0 20px">
    <div style="margin-top: 100px">
      <div style="font-size: 25px; font-weight: bold">注册新用户</div>
      <div style="font-size: 14px; color: grey; margin-top: 1rem">
        欢迎注册，请在下方填写相关信息
      </div>
    </div>

    <div style="margin-top: 50px">
      <el-form :model="form" :rules="rules" ref="formRef">
        <el-form-item prop="username">
          <el-input v-model="form.username" maxlength="10" type="text" placeholder="用户名">
            <template #prefix><el-icon><User /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" maxlength="20" type="password" placeholder="密码">
            <template #prefix><el-icon><Lock /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password_repeat">
          <el-input v-model="form.password_repeat" maxlength="20" type="password" placeholder="重复密码">
            <template #prefix><el-icon><Lock /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="email">
          <el-input v-model="form.email" type="email" placeholder="电子邮件地址">
            <template #prefix><el-icon><Message /></el-icon></template>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="17">
              <el-input v-model="form.code" maxlength="6" placeholder="请输入验证码">
                <template #prefix><el-icon><EditPen /></el-icon></template>
              </el-input>
            </el-col>
            <el-col :span="5">
              <el-button type="success" @click="askCode" :disabled="!isEmailValid || coldTime != 0">
                {{ coldTime > 0 ? `请稍后 ${coldTime} 秒` : '获取验证码' }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>

    <div style="margin-top: 80px">
      <el-button style="width: 270px" type="warning" plain @click="handleRegister">
        立即注册
      </el-button>
    </div>

    <el-divider>
      <span style="font-size: 13px; color: grey">已有账号？</span>
    </el-divider>
    <div>
      <el-button style="width: 270px"  plain @click="$router.push('/user/login')">
        去登录
      </el-button>
    </div>
  </div>
</template>
