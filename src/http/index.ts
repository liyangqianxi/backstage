import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import router from '@/router/index';
import {ElMessage} from 'element-plus';

const http = axios.create({
    baseURL: '/api',
    timeout: 10000
});

// 请求拦截
// 每一次发请求前做的事情
http.interceptors.request.use(
    (config: AxiosRequestConfig) => {
        // 验证用户身份
        // token: 令牌
        // 在登录成功之后后端签发令牌
        // 每一次发请求的时候 加上这个令牌
        const token = localStorage.getItem('token');
        if (token) {
            // headers属性是后端约定的
            config.headers['Authorization'] = token;
        }
        return config;
    },
    (err: AxiosError) => {
        return Promise.reject(err);
    }
);

// 响应拦截
// 响应拦截每一次请求结束做的事情
http.interceptors.response.use(
    (res: any) => {
        return res.data;
    },
    (err: AxiosError) => {
        const status: number = err.response! && err.response.status;
        if (status === 401) {
            // token是有过期时间的
            // 登录过期
            // 跳转到登录页
            ElMessage.warning('登录过期');
            router.push('/login');
        }
        if (status === 403) {
            ElMessage.warning('没有全选');
        }
        if (status === 404) {
            ElMessage.warning('路径错误');
        }
        if (status === 500) {
            ElMessage.warning('服务器错误');
        }
        if (status === 503) {
            ElMessage.warning('服务器维护');
        }
        return Promise.reject(err);
    }
);

export default http;
