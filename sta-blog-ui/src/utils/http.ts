// 封装axios
import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import {ElMessage, ElNotification} from "element-plus"
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {JWT_PREFIX_CONS} from "@/const";
import {GET_TOKEN, UPDATE_ACCESS_TOKEN} from "@/utils/auth.ts";
import { useAccessStore } from "@/store/useAccessStore";
import { useLoading } from "@/composables/useLoading";
import {REQUEST_LOADING_PATH, IGNORE_ERROR_PATH} from "@/utils/enum.ts";
import { ApiResponse } from '@/types';
import router from '@/router';

type HttpInstance = {
    <T = any>(config: any): Promise<ApiResponse<T>>;
    get<T = any>(url: string, config?: any): Promise<ApiResponse<T>>;
    post<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>;
    put<T = any>(url: string, data?: any, config?: any): Promise<ApiResponse<T>>;
    delete<T = any>(url: string, config?: any): Promise<ApiResponse<T>>;
    [key: string]: any;
}

const http: HttpInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API ?? '/',
    timeout: 8000,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
}) as unknown as HttpInstance

const env = import.meta.env
const pathRequestCount = new Map();
const firstRequestPaths = new Set();
let loadingShown = false;

// ========== refreshToken 续期锁 ==========
let isRefreshing = false;
let refreshQueue: Array<{ resolve: (token: string) => void; reject: (err: any) => void }> = [];

async function doRefreshToken(): Promise<string> {
    const refreshToken = useAccessStore().refreshToken;
    if (!refreshToken) {
        useAccessStore().clear();
        router.push('/user/login');
        throw new Error('refreshToken 不存在');
    }
    const res: any = await axios.post(
        (import.meta.env.VITE_APP_BASE_API ?? '/') + '/app-api/blog/auth/refresh-token',
        null,
        { params: { refreshToken } }
    );
    const data = res.data?.data || res.data;
    if (data && data.accessToken) {
        UPDATE_ACCESS_TOKEN(data.accessToken, data.expiresTime);
        return data.accessToken;
    }
    useAccessStore().clear();
    router.push('/user/login');
    throw new Error('token 刷新失败');
}

// ========== 共享的 token 刷新处理 ==========
async function handleTokenRefresh(config: any): Promise<any> {
    // 如果根本没有 refreshToken（未登录状态），直接跳转登录页，不要抛异常
    if (!useAccessStore().refreshToken) {
        useAccessStore().clear();
        router.push('/user/login');
        return Promise.reject(new Error('请先登录'));
    }

    if (!isRefreshing) {
        isRefreshing = true;
        try {
            const newToken = await doRefreshToken();
            refreshQueue.forEach(({ resolve }) => resolve(newToken));
            refreshQueue = [];
            config._retry = true;
            config.headers['Authorization'] = JWT_PREFIX_CONS + newToken;
            return http(config);
        } catch (err) {
            refreshQueue.forEach(({ reject }) => reject(err));
            refreshQueue = [];
            useAccessStore().clear();
            router.push('/user/login');
            return Promise.reject(err);
        } finally {
            isRefreshing = false;
        }
    } else {
        return new Promise((resolve, reject) => {
            refreshQueue.push({
                resolve: (token: string) => {
                    config._retry = true;
                    config.headers['Authorization'] = JWT_PREFIX_CONS + token;
                    resolve(http(config));
                },
                reject,
            });
        });
    }
}

// request拦截器
http.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    let url = config?.url;
    if (url?.startsWith(import.meta.env.VITE_MUSIC_BASE_API)){
        config.baseURL = "";
    }
    let matchingPath = REQUEST_LOADING_PATH.find((path: string) => url?.startsWith(path));

    if (!(url?.startsWith(env.VITE_YIYAN_API)) || matchingPath) {
        if (matchingPath && !firstRequestPaths.has(matchingPath)) {
            firstRequestPaths.add(matchingPath);
            pathRequestCount.set(matchingPath, (pathRequestCount.get(matchingPath) || 0) + 1);
            if (!loadingShown){
                loadingShown = true;
                const loadingStore = useLoading();
                loadingStore.show();
                NProgress.start();
            }
        } else NProgress.start();
    }

    config.headers['X-Client-Type'] = 'Frontend'
    const token = GET_TOKEN();
    if (token) {
        config.headers['Authorization'] = JWT_PREFIX_CONS + token
    }
    return config
}, (error: AxiosError) => {
    return Promise.reject(error)
})

// response拦截器
http.interceptors.response.use(
    (response: AxiosResponse) => {
        let url = response.config?.url;
        let matchingPath = REQUEST_LOADING_PATH.find((path: string) => url?.startsWith(path));

        if (matchingPath) {
            pathRequestCount.set(matchingPath, pathRequestCount.get(matchingPath) - 1);
            if (pathRequestCount.get(matchingPath) === 0) {
                loadingShown = false;
                const loadingStore = useLoading();
                loadingStore.hide();
                pathRequestCount.clear();
                NProgress.done();
            }
        } else NProgress.done();

        // Yudao returns HTTP 200 with code 401 in body
        if (response.data?.code === 401) {
            return handleTokenRefresh(response.config);
        }

        return response.data
    },
    async (error: AxiosError) => {
        const config = error.config as any;

        // ========== 401 自动刷新 token（支持 HTTP 401 和响应体 code 401） ==========
        const is401 = error.response?.status === 401
                   || (error.response?.data as any)?.code === 401;
        if (is401 && config && !config._retry) {
            return handleTokenRefresh(config);
        }

        // ========== 原有错误处理 ==========
        let message = error.message;
        let url = error?.config?.url;
        let ignorePath = IGNORE_ERROR_PATH.find((path: string) => url?.startsWith(path));
        if (message == "Network Error") {
            message = "后端接口连接异常";
        } else if (message.includes("timeout")) {
            message = "系统接口请求超时";
        } else if (message.includes("Request failed with status code")) {
            message = "系统接口" + message.substring(message.length - 3) + "异常";
        }
        if (!ignorePath) {
            ElMessage.error(message)
        }
        return Promise.reject(error.response)
    }
)


export default http
