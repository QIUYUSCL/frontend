import axios from 'axios';
import MOCK_CONFIG, { mockApi } from '../mock';

const isMockMode = MOCK_CONFIG.enabled;
const request = axios.create({
    baseURL: isMockMode ? '' : '/api/v1',
    timeout: 10000
});

// 添加请求拦截器（与bookApi保持一致）
request.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// 添加响应拦截器
request.interceptors.response.use(
    response => response.data,
    error => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export const authApi = {
    // 用户登录
    login(credentials) {
        if (isMockMode) {
            return mockApi.auth.login(credentials);
        }
        return request.post('/auth/login', credentials);
    },

    // 获取当前用户信息
    getCurrentUser() {
        if (isMockMode) {
            return mockApi.auth.getCurrentUser();
        }
        return request.get('/auth/current-user');
    },

    // 退出登录
    logout() {
        if (isMockMode) {
            return Promise.resolve({ code: 200, message: 'success' });
        }
        return request.post('/auth/logout');
    }
};