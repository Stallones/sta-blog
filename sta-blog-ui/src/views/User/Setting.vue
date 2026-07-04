<script setup lang="ts">
import { ElMessage, FormRules, UploadInstance } from "element-plus";
import {
  Plus,
  User,
  Select,
  Message,
  Refresh,
  Unlock,
} from "@element-plus/icons-vue";
import type { UploadProps } from "element-plus";
import { useUserStore } from "@/store/useUserStore";
import { updateUser as updateUserApi } from "@/api/AppBlogUserController";
import { sendEmailCode } from "@/api/AppBlogAuthController";

const uploadRef = ref<UploadInstance>();

const accountForm = ref<any>({
  nickname: "",
  sex: undefined,
  avatar: "",
});

const avatarImg = ref();
const userStore = useUserStore();

const emailForm = reactive({
  email: "",
  code: "",
  password: "",
});

async function updateUser() {
  baseFormRef.value.validate(async (isValid: boolean) => {
    if (isValid) {
      const resp: any = await updateUserApi({
        nickname: accountForm.value.nickname,
        sex: accountForm.value.sex,
        avatar: accountForm.value.avatar,
        email: emailForm.email || undefined,
      });
      if (resp) {
        ElMessage.success("信息更新成功");
        userStore.getInfo();
      }
    } else ElMessage.warning("请完整填写信息");
  });
}

const firstImg = ref("");

const submitUploadAndUpdate = () => {
  if (firstImg.value !== avatarImg.value) {
    uploadRef.value!.submit();
  } else updateUser();
};

// 上传头像：使用 yudao 文件上传
const uploadAvatarUrl = "/api/app-api/infra/file/upload";

const handleAvatarSuccess: UploadProps["onSuccess"] = (response: any) => {
  const data = response?.data || response;
  if (data && data.url) {
    accountForm.value.avatar = data.url;
    updateUser();
  } else if (data && data.path) {
    accountForm.value.avatar = data.path;
    updateUser();
  }
  firstImg.value = avatarImg.value;
};

const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  firstImg.value = avatarImg.value;
  if (rawFile.type !== "image/jpeg" && rawFile.type !== "image/png") {
    ElMessage.error("头像图片需要jpg或者png类型的图片！");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("头像图片大小不能超过2MB！");
    return false;
  }
  return true;
};

const handleChange = (uploadFile: any) => {
  avatarImg.value = URL.createObjectURL(uploadFile.raw);
};

onMounted(() => {
  watchEffect(() => {
    if (userStore.userInfo) {
      accountForm.value = { ...userStore.userInfo };
      avatarImg.value = userStore.userInfo.avatar || "";
      firstImg.value = userStore.userInfo.avatar || "";
      emailForm.email = userStore.userInfo.email || "";
    }
  });
});

const validateUsername = (_: any, value: any, callback: any) => {
  if (value === "") {
    callback(new Error("请输入用户昵称"));
  } else if (!/[a-zA-Z0-9\u4e00-\u9fa5]+$/.test(value)) {
    callback(new Error("用户名不能包含特殊字符，只能是中/英文"));
  } else {
    callback();
  }
};

const baseFormRef = ref();
const emailFormRef = ref();

const nicknameRules = {
  nickname: [
    { validator: validateUsername, trigger: ["blur", "change"] },
    {
      min: 2,
      max: 10,
      message: "用户昵称的长度必须在2-10个字符之间",
      trigger: ["blur", "change"],
    },
  ],
};

const emailRules: FormRules = {
  email: [
    { required: true, message: "请输入邮件地址", trigger: "blur" },
    {
      type: "email",
      message: "请输入合法的电子邮件地址",
      trigger: ["blur", "change"],
    },
  ],
  code: [{ required: true, message: "请输入获取的验证码", trigger: "blur" }],
};

const centerDialogVisible = ref(false);

async function updateEmailFunc() {
  if (emailForm.email === userStore.userInfo?.email) {
    ElMessage.warning("邮件地址未更改");
    return;
  }
  // 直接更新用户信息（包含新邮箱）
  const resp: any = await updateUserApi({
    nickname: accountForm.value.nickname,
    sex: accountForm.value.sex,
    avatar: accountForm.value.avatar,
    email: emailForm.email,
  });
  if (resp) {
    ElMessage.success("邮件地址更新成功");
    emailForm.code = "";
    userStore.getInfo();
    centerDialogVisible.value = false;
  }
}

function modifyEmail() {
  emailFormRef.value.validate((isValid: boolean) => {
    if (isValid) {
      centerDialogVisible.value = true;
    } else ElMessage.warning("请完整填写信息");
  });
}

const isEmailValid = computed(() =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailForm.email),
);

const coldTime = ref(0);

async function getEmailCode() {
  if (!isEmailValid.value) return;
  coldTime.value = 60;
  await sendEmailCode({ email: emailForm.email, scene: "resetEmail" });
  ElMessage.success(`验证码已发送到邮箱：${emailForm.email}，请注意查收`);
  const intervalId = setInterval(() => {
    if (coldTime.value === 0) {
      clearInterval(intervalId);
    } else {
      coldTime.value--;
    }
  }, 1000);
}

// token for upload auth header
const token =
  localStorage.getItem("Token") || sessionStorage.getItem("Token") || "";
const uploadHeaders = ref<Record<string, string>>({
  Authorization:
    "Bearer " +
    (() => {
      try {
        const obj = JSON.parse(token);
        return obj.accessToken || "";
      } catch {
        return token;
      }
    })(),
});
</script>

<template>
  <div class="setting-page">
    <el-dialog
      v-model="centerDialogVisible"
      title="确认修改邮箱"
      width="500"
      align-center
    >
      <span class="dialog-bold">你正在更改邮箱为：{{ emailForm.email }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="centerDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="updateEmailFunc" :icon="Refresh">
            确认更新
          </el-button>
        </div>
      </template>
    </el-dialog>
    <div class="setting-layout">
      <div class="setting-main">
        <div class="panel">
          <div class="panel-header">
            <el-icon><User /></el-icon>
            <span class="panel-title">账号信息设置</span>
          </div>
          <span class="panel-desc"
            >在这里可以编辑你的个人信息，个人简介等等……</span
          >
          <el-divider style="margin-top: 0.5rem" />
          <div class="panel-body">
            <div class="form-wrap">
              <div class="avatar-section">
                <el-upload
                  class="avatar-uploader"
                  :action="uploadAvatarUrl"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  :on-change="handleChange"
                  :headers="uploadHeaders"
                  :auto-upload="false"
                  ref="uploadRef"
                  name="file"
                >
                  <img
                    v-if="avatarImg"
                    :src="avatarImg"
                    class="avatar"
                    alt="头像"
                    style="border-radius: 50%"
                  />
                  <el-icon v-else class="avatar-uploader-icon">
                    <Plus />
                  </el-icon>
                </el-upload>
              </div>
              <div class="form-section">
                <el-form
                  label-position="top"
                  label-width="auto"
                  class="setting-form"
                  :model="accountForm"
                  ref="baseFormRef"
                  :rules="nicknameRules"
                >
                  <el-form-item label="用户昵称" prop="nickname">
                    <el-input
                      placeholder="请输入用户昵称"
                      maxlength="10"
                      v-model="accountForm.nickname"
                    />
                  </el-form-item>
                  <el-form-item label="性别">
                    <el-radio-group v-model="accountForm.sex">
                      <el-radio :label="1">男</el-radio>
                      <el-radio :label="2">女</el-radio>
                      <el-radio :label="0">保密</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-form>
              </div>
              <el-button
                type="success"
                :icon="Select"
                @click="submitUploadAndUpdate"
                >更新信息</el-button
              >
            </div>
          </div>
        </div>

        <div class="panel panel--email">
          <div class="panel-header">
            <el-icon><Message /></el-icon>
            <span class="panel-title">电子邮件设置</span>
          </div>
          <span class="panel-desc">在这里可以修改或绑定的电子邮箱信息</span>
          <el-divider style="margin-top: 0.5rem" />
          <div class="panel-body">
            <div class="form-wrap">
              <div class="form-section">
                <el-form
                  label-position="top"
                  label-width="auto"
                  class="setting-form"
                  :model="emailForm"
                  ref="emailFormRef"
                  :rules="emailRules"
                >
                  <el-form-item label="电子邮件" prop="email">
                    <el-input
                      placeholder="请输入电子邮件"
                      v-model="emailForm.email"
                    />
                  </el-form-item>
                  <el-form-item prop="code">
                    <div class="code-row">
                      <el-input
                        placeholder="请获取验证码"
                        v-model="emailForm.code"
                      />
                      <el-button
                        type="success"
                        @click="getEmailCode"
                        plain
                        class="code-btn"
                        :disabled="!isEmailValid || coldTime != 0"
                      >
                        {{
                          coldTime > 0 ? `请稍后 ${coldTime} 秒` : "获取验证码"
                        }}
                      </el-button>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
              <el-button
                class="submit-btn"
                :icon="Unlock"
                type="success"
                @click="modifyEmail"
                >更新邮箱</el-button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$bp-md: 768px;
.setting-page {
  width: 100%;
}
.setting-layout {
  display: flex;
  flex-direction: column;
  width: 100%;

}
.setting-main {

}
.panel {
  width: 100%;
  padding: 1.25rem;
  margin-bottom: 1.25rem;
  border-radius: 10px;
  background-color: var(--el-bg-color);
  box-shadow: var(--el-box-shadow-light);
}
.panel--email {
  margin-bottom: 7rem;
}
.panel-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.panel-title {
  font-size: 1.25rem;
  font-weight: bold;
}
.panel-desc {
  color: var(--el-text-color-secondary);
  font-size: 0.8rem;
}
.panel-body {
  display: flex;
  justify-content: center;
  margin: 0 1.5rem;
}
.form-wrap {
  width: 100%;
  margin-bottom: 1.25rem;
}
.avatar-section {
  display: flex;
  justify-content: center;
}
.form-section {
  display: flex;
  justify-content: center;
}
.setting-form {
  width: 100%;
  margin-top: 1.25rem;
}
.dialog-bold {
  font-weight: bold;
}
.code-row {
  display: flex;
  width: 100%;
}
.code-btn {
  margin-left: 0.5rem;
}
.submit-btn {
  margin: 0 1.5rem;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 140px;
  border-radius: 50%;
  height: 140px;
  text-align: center;
}
.avatar-uploader :hover {
  border-color: var(--el-color-primary);
}
.avatar-uploader-icon {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
:deep(.el-dialog__body) {
  padding-top: 0;
}
:deep(.el-dialog) {
  border-radius: 10px;
}
</style>
