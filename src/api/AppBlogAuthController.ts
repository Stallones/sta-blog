// @ts-ignore
/* eslint-disable */
import request from "@/utils/request";

/** 邮箱 + 密码登录 POST /app-api/blog/auth/email-login */
export async function emailLogin(
  body: API.AppEmailLoginReqVO,
  options?: { [key: string]: any }
) {
  return request<API.AppAuthLoginRespVO>("/app-api/blog/auth/email-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 邮箱 + 密码 + 验证码注册 POST /app-api/blog/auth/email-register */
export async function emailRegister(
  body: API.AppEmailRegisterReqVO,
  options?: { [key: string]: any }
) {
  return request<number>("/app-api/blog/auth/email-register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 登出系统 POST /app-api/blog/auth/logout */
export async function logout(options?: { [key: string]: any }) {
  return request<boolean>("/app-api/blog/auth/logout", {
    method: "POST",
    ...(options || {}),
  });
}

/** 刷新令牌 POST /app-api/blog/auth/refresh-token */
export async function refreshToken(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.refreshTokenParams,
  options?: { [key: string]: any }
) {
  return request<API.AppAuthLoginRespVO>("/app-api/blog/auth/refresh-token", {
    method: "POST",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 重置密码（邮箱 + 验证码 + 新密码） POST /app-api/blog/auth/reset-password */
export async function resetPassword(
  body: API.AppResetPasswordReqVO,
  options?: { [key: string]: any }
) {
  return request<boolean>("/app-api/blog/auth/reset-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 发送邮箱验证码 POST /app-api/blog/auth/send-email-code */
export async function sendEmailCode(
  body: API.AppSendEmailCodeReqVO,
  options?: { [key: string]: any }
) {
  return request<boolean>("/app-api/blog/auth/send-email-code", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取社交授权跳转 URL GET /app-api/blog/auth/social-auth-redirect */
export async function socialAuthRedirect(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.socialAuthRedirectParams,
  options?: { [key: string]: any }
) {
  return request<string>("/app-api/blog/auth/social-auth-redirect", {
    method: "GET",
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 社交登录（QQ/GitHub） POST /app-api/blog/auth/social-login */
export async function socialLogin(
  body: API.AppSocialLoginReqVO,
  options?: { [key: string]: any }
) {
  return request<API.AppAuthLoginRespVO>("/app-api/blog/auth/social-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: body,
    ...(options || {}),
  });
}
