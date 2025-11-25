import axios from 'axios';
import MOCK_CONFIG, { mockApi } from '../mock';

const isMockMode = MOCK_CONFIG.enabled;
const request = axios.create({
    baseURL: isMockMode ? '' : '/api/v1',
    timeout: 10000
});

export const creditApi = {
    // 获取信用积分信息
    getCreditInfo(userId) {
        if (isMockMode) {
            return mockApi.credit.getCreditInfo(userId);
        }
        return request.get(`/credit/${userId}`);
    }
};