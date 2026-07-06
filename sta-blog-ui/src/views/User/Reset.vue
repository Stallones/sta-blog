<script setup lang="ts">
import {EditPen, Lock, Message} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import { sendEmailCode, resetPassword } from "@/api/AppBlogAuthController";

const router = useRouter();

const coldTime = ref(0)
const formRef = ref()
const loading = ref(false)

const form = reactive({
  email: '',
  code: '',
  password: '',
  password_repeat: ''
})

const validatePassword = (_: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = {
  password: [
    {required: true, message: '请输入密码', trigger: 'blur'},
    {min: 6, max: 20, message: '密码的长度必须在 6-20 个字符之间', trigger: ['blur', 'change']}
  ],
  password_repeat: [
    {validator: validatePassword, trigger: ['blur', 'change']}
  ],
  email: [
    {required: true, message: '请输入邮件地址', trigger: 'blur'},
    {type: 'email', message: '请输入合法的电子邮件地址', trigger: ['blur', 'change']}
  ],
  code: [
    {required: true, message: '请输入获取的验证码', trigger: 'blur'},
  ]
}

async function askCode() {
  if (!isEmailValid.value) {
    ElMessage.warning('请输入正确的电子邮件')
    return
  }
  coldTime.value = 60
  try {
    await sendEmailCode({ email: form.email, scene: 'reset' })
    ElMessage.success(`验证码已发送到邮箱：${form.email}，请注意查收`)
    const intervalId = setInterval(() => {
      if (coldTime.value === 0) clearInterval(intervalId)
      else coldTime.value--
    }, 1000)
  } catch (e: any) {
    coldTime.value = 0
    ElMessage.error(e?.msg || '验证码发送失败，请稍后重试')
  }
}

const isEmailValid = computed(() => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(form.email))

async function doReset() {
  formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        const res: any = await resetPassword({
          email: form.email,
          code: form.code,
          password: form.password,
        })
        if (res) {
          ElMessage.success('密码重置成功，请重新登录')
          router.push('/user/login')
        }
      } catch (e: any) {
        ElMessage.error(e?.msg || '密码重置失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }
  })
}

</script>

<template>
  <div style="text-align: center">
    <div style="margin: 0 20px">
      <div style="margin-top: 100px">
        <div style="font-size: 25px;font-weight: bold">重置密码</div>
        <div style="font-size: 14px;color: grey;margin-top: 1rem">请输入需要重置密码的电子邮件地址</div>
      </div>
      <div style="margin-top: 50px">
        <el-form :model="form" :rules="rules" ref="formRef">
          <!-- 验证身份 -->
          <div style="text-align: left;margin-bottom: 12px">
            <span style="font-size: 13px;color: #909399;font-weight: 500">验证身份</span>
          </div>
          <el-form-item prop="email">
            <el-input v-model="form.email" type="email" placeholder="电子邮件地址">
              <template #prefix><el-icon><Message/></el-icon></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="code">
            <el-row :gutter="10" style="width: 100%">
              <el-col :span="17">
                <el-input v-model="form.code" maxlength="6" placeholder="请输入验证码">
                  <template #prefix><el-icon><EditPen/></el-icon></template>
                </el-input>
              </el-col>
              <el-col :span="5">
                <el-button type="success" @click="askCode" :disabled="!isEmailValid || coldTime > 0">
                  {{ coldTime > 0 ? `请稍后 ${coldTime} 秒` : '获取验证码' }}
                </el-button>
              </el-col>
            </el-row>
          </el-form-item>


          <!-- 设定新密码 -->
          <div style="text-align: left;margin: 50px 0 12px">
            <span style="font-size: 13px;color: #909399;font-weight: 500">设定新密码</span>
          </div>
          <el-form-item prop="password">
            <el-input v-model="form.password" maxlength="20" type="password" placeholder="新密码（6-20个字符）">
              <template #prefix><el-icon><Lock/></el-icon></template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password_repeat">
            <el-input v-model="form.password_repeat" maxlength="20" type="password" placeholder="确认新密码">
              <template #prefix><el-icon><Lock/></el-icon></template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div style="margin-top: 50px">
        <el-button type="danger" style="width: 270px" plain @click="doReset" :loading="loading">
          重置密码
        </el-button>
      </div>
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
