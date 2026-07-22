<script setup lang="ts">
import { ElMessage, ElMessageBox, FormRules, UploadInstance } from "element-plus";
import {
  Plus,
  User,
  Select,
  Message,
  Refresh,
  Unlock,
  Lock,
} from "@element-plus/icons-vue";
import type { UploadProps } from "element-plus";
import { useUserStore } from "@/store/useUserStore";
import { useAccessStore } from "@/store/useAccessStore";
import { updateUser as updateUserApi, updatePassword } from "@/api/AppBlogUserController";
import { sendEmailCode } from "@/api/AppBlogAuthController";

const uploadRef = ref<UploadInstance>();
const accessStore = useAccessStore();

const accountForm = ref<any>({
  nickname: "",
  sex: undefined,
  avatar: "",
});

const avatarImg = ref();
const userStore = useUserStore();
const router = useRouter();

const emailForm = reactive({
  newEmail: "",
  code: "",
});

const maskedEmail = computed(() => {
  const email = userStore.userInfo?.email;
  if (!email) return "";
  const [name, domain] = email.split("@");
  if (name.length <= 2) return name[0] + "***@" + domain;
  return name.slice(0, 2) + "***@" + domain;
});

async function updateUser() {
  baseFormRef.value.validate(async (isValid: boolean) => {
    if (isValid) {
      const resp: any = await updateUserApi({
        nickname: accountForm.value.nickname,
        sex: accountForm.value.sex,
        avatar: accountForm.value.avatar,
        email: userStore.userInfo?.email || undefined,
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

// 上传头像：后端转发到 MinIO，文件存储到 blog/avatar 并记录 infra_file
const uploadAvatarUrl = "/api/app-api/blog/image/upload";

const handleAvatarSuccess: UploadProps["onSuccess"] = (response: any) => {
  const data = response?.data || response;
  const url = typeof data === "string" ? data : data?.url || data?.path;
  if (url) {
    accountForm.value.avatar = url;
    updateUser();
  } else {
    ElMessage.error("头像上传失败，请稍后重试");
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
      emailForm.newEmail = "";
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
  newEmail: [
    { required: true, message: "请输入新邮件地址", trigger: "blur" },
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
  try {
    if (!emailForm.newEmail) {
      ElMessage.warning("请先输入新邮箱");
      return;
    }
    if (emailForm.newEmail === userStore.userInfo?.email) {
      ElMessage.warning("新邮箱与当前邮箱相同");
      return;
    }
    if (!emailForm.code) {
      ElMessage.warning("请先获取并输入验证码");
      return;
    }
    // 提交新邮箱 + 验证码，后端校验通过后才会更新
    const resp: any = await updateUserApi({
      nickname: accountForm.value.nickname,
      sex: accountForm.value.sex,
      avatar: accountForm.value.avatar,
      email: emailForm.newEmail,
      code: emailForm.code,
    });
    if (resp) {
      ElMessage.success("邮件地址更新成功");
      emailForm.code = "";
      emailForm.newEmail = "";
      userStore.getInfo();
      centerDialogVisible.value = false;
    }
  } catch (e: any) {
    ElMessage.error(e?.msg || '邮箱更新失败');
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
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailForm.newEmail),
);

const coldTime = ref(0);

async function getEmailCode() {
  if (!isEmailValid.value) return;
  if (emailForm.newEmail === userStore.userInfo?.email) {
    ElMessage.warning("新邮箱与当前邮箱相同");
    return;
  }
  coldTime.value = 60;
  try {
    await sendEmailCode({ email: emailForm.newEmail, scene: "resetEmail" });
    ElMessage.success(`验证码已发送到邮箱：${emailForm.newEmail}，请注意查收`);
    const intervalId = setInterval(() => {
      if (coldTime.value === 0) {
        clearInterval(intervalId);
      } else {
        coldTime.value--;
      }
    }, 1000);
  } catch (e: any) {
    coldTime.value = 0;
    ElMessage.error(e?.msg || "验证码发送失败，请稍后重试");
  }
}

const passwordForm = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const passwordFormRef = ref();

const passwordRules: FormRules = {
  oldPassword: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, max: 20, message: "新密码长度为 6-20 位", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "请确认新密码", trigger: "blur" },
    {
      validator: (_: any, value: any, callback: any) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error("两次输入的密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

async function handlePasswordChange() {
  passwordFormRef.value.validate(async (isValid: boolean) => {
    if (!isValid) return;
    try {
      await ElMessageBox.confirm(
        "修改密码后需要重新登录，确定要继续吗？",
        "确认修改密码",
        { confirmButtonText: "确定", cancelButtonText: "取消", type: "warning" }
      );
      const resp = await updatePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      if (resp) {
        ElMessage.success("密码修改成功");
        passwordForm.oldPassword = "";
        passwordForm.newPassword = "";
        passwordForm.confirmPassword = "";
        userStore.clearUser();
        ElMessage.success("密码已修改，请重新登录");
        router.push({ path: "/user/login", query: { redirect: "/" } });
      }
    } catch (e: any) {
      // ElMessageBox.confirm 取消时 catch，不做任何处理
      if (e !== "cancel" && e !== "close") {
        ElMessage.error(e?.msg || "密码修改失败");
      }
    }
  });
}

// token for upload auth header — 从响应式 store 读取
const uploadHeaders = computed<Record<string, string>>(() => ({
  Authorization: 'Bearer ' + (accessStore.accessToken || ''),
}));
</script>

<template>
  <div class="setting-page">
    <el-dialog
      v-model="centerDialogVisible"
      title="确认修改邮箱"
      width="500"
      align-center
    >
      <span class="dialog-bold">你正在更改邮箱为：{{ emailForm.newEmail }}</span>
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
                  :data="{ type: 54 }"
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
                      <el-radio :value="1" label="男" />
                      <el-radio :value="2" label="女" />
                      <el-radio :value="0" label="保密" />
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
                  <el-form-item label="当前邮箱">
                    <el-input
                      :model-value="maskedEmail"
                      disabled
                      placeholder="未绑定邮箱"
                    />
                  </el-form-item>
                  <el-form-item label="新邮箱" prop="newEmail">
                    <el-input
                      placeholder="请输入新邮箱"
                      v-model="emailForm.newEmail"
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

        <div class="panel panel--password">
          <div class="panel-header">
            <el-icon><Lock /></el-icon>
            <span class="panel-title">密码设置</span>
          </div>
          <span class="panel-desc">在这里可以修改你的登录密码</span>
          <el-divider style="margin-top: 0.5rem" />
          <div class="panel-body">
            <div class="form-wrap">
              <div class="form-section">
                <el-form
                  label-position="top"
                  label-width="auto"
                  class="setting-form"
                  :model="passwordForm"
                  ref="passwordFormRef"
                  :rules="passwordRules"
                >
                  <el-form-item label="旧密码" prop="oldPassword">
                    <el-input
                      type="password"
                      show-password
                      placeholder="请输入旧密码"
                      v-model="passwordForm.oldPassword"
                    />
                  </el-form-item>
                  <el-form-item label="新密码" prop="newPassword">
                    <el-input
                      type="password"
                      show-password
                      placeholder="请输入新密码"
                      v-model="passwordForm.newPassword"
                    />
                  </el-form-item>
                  <el-form-item label="确认新密码" prop="confirmPassword">
                    <el-input
                      type="password"
                      show-password
                      placeholder="请再次输入新密码"
                      v-model="passwordForm.confirmPassword"
                    />
                  </el-form-item>
                </el-form>
              </div>
              <el-button
                class="submit-btn"
                :icon="Lock"
                type="primary"
                @click="handlePasswordChange"
                >修改密码</el-button
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
  @include surface-card;
  padding: 2rem;
  margin-bottom: 1rem;
}
.panel--email {
  margin-bottom: 1rem;
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
  color: var(--text-secondary);
  font-size: 0.8rem;
}
.panel-body {
  display: flex;
  justify-content: center;
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
  border-color: var(--accent-primary);
}
.avatar-uploader-icon {
  border: 1px dashed var(--border-color);
  border-radius: 6px;
  cursor: pointer;
  overflow: hidden;
  transition: 0.2s;
}
:deep(.el-dialog__body) {
  padding-top: 0;
}
:deep(.el-dialog) {
  border-radius: 10px;
}
</style>
