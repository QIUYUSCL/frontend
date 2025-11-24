import axios from 'axios';
import MOCK_CONFIG, { mockApi } from '../mock';

const isMockMode = MOCK_CONFIG.enabled;
const request = axios.create({
    baseURL: isMockMode ? '' : '/api/v1',
    timeout: 10000
});

export const recommendationApi = {
    // 获取个性化推荐
    getPersonalRecommendation(userId, size = 8) {
        if (isMockMode) {
            return mockApi.recommendation.getPersonalRecommendation(userId, size);
        }
        return request.get('/recommendation/personal', { params: { userId, size } });
    },

    // 获取热门推荐
    getPopularRecommendation(discipline, size = 8) {
        if (isMockMode) {
            return mockApi.recommendation.getPopularRecommendation(discipline, size);
        }
        return request.get('/recommendation/popular', { params: { discipline, size } });
    },

    // 获取相关推荐
    getRelatedRecommendation(bookId, size = 6) {
        if (isMockMode) {
            return mockApi.recommendation.getRelatedRecommendation(bookId, size);
        }
        return request.get(`/recommendation/related/${bookId}`, { params: { size } });
    }
};