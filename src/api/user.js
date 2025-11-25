import axios from 'axios';
import MOCK_CONFIG, { mockApi } from '../mock';
import { mockData } from '../mock/data'; // ✅ 必须添加这行

const isMockMode = MOCK_CONFIG.enabled;

const request = axios.create({
    baseURL: isMockMode ? '' : '/api/v1',
    timeout: 10000
});

// 请求拦截器
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

// 响应拦截器
request.interceptors.response.use(
    response => response.data,
    error => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

export const userApi = {
    // 获取用户地址列表
    getAddresses() {
        if (isMockMode) {
            const userId = parseInt(localStorage.getItem('userId') || '1001');
            const addresses = mockData.addresses.filter(addr => addr.userId === userId);
            return Promise.resolve({
                code: 200,
                message: 'success',
                data: addresses
            });
        }
        return request.get('/user/addresses');
    },

    // 更新默认地址
    updateDefaultAddress(addressData) {
        if (isMockMode) {
            const userId = parseInt(localStorage.getItem('userId') || '1001');
            const user = mockData.users.find(u => u.userId === userId);
            if (user) {
                user.defaultAddress = { ...addressData, id: Date.now() };
                return Promise.resolve({
                    code: 200,
                    message: '更新成功',
                    data: user.defaultAddress
                });
            }
            return Promise.resolve({ code: 500, message: '用户不存在' });
        }
        return request.post('/user/address/default', addressData);
    },

    // 添加新地址
    addAddress(addressData) {
        if (isMockMode) {
            const userId = parseInt(localStorage.getItem('userId') || '1001');
            const newAddress = {
                id: Date.now(),
                userId,
                ...addressData,
                isDefault: false
            };
            mockData.addresses.push(newAddress);
            return Promise.resolve({
                code: 200,
                message: '添加成功',
                data: newAddress
            });
        }
        return request.post('/user/addresses', addressData);
    }
};