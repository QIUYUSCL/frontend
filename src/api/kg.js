import axios from 'axios';
import MOCK_CONFIG, { mockApi } from '../mock';

const isMockMode = MOCK_CONFIG.enabled;
const request = axios.create({
    baseURL: isMockMode ? '' : '/api/v1',
    timeout: 10000
});

export const kgApi = {
    // 获取知识图谱数据
    getKnowledgeGraphData(disciplineName) {
        if (isMockMode) {
            return mockApi.kg.getKnowledgeGraphData(disciplineName);
        }
        return request.get('/kg/discipline/map', { params: { disciplineName } });
    },

    // 语义搜索
    semanticSearch(keywords) {
        if (isMockMode) {
            return mockApi.kg.semanticSearch(keywords);
        }
        return request.get('/kg/semantic/search', { params: { keywords } });
    }
};