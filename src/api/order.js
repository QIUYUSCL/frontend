import axios from 'axios';
import MOCK_CONFIG, { mockApi } from '../mock';

const isMockMode = MOCK_CONFIG.enabled;
const request = axios.create({
    baseURL: isMockMode ? '' : '/api/v1',
    timeout: 10000
});

export const orderApi = {
    // 获取我的订单
    getMyOrders(status = '') {
        if (isMockMode) {
            return mockApi.order.getMyOrders(status);
        }
        return request.get('/orders/my', { params: { status } });
    },

    createOrder(orderData) {
        if (isMockMode) {
            return mockApi.order.createOrder(orderData);
        }
        return request.post('/orders', orderData);
    },

    // 获取订单详情
    getOrderDetail(orderId) {
        if (isMockMode) {
            return mockApi.order.getOrderDetail(orderId);
        }
        return request.get(`/orders/${orderId}`);
    },

    // 取消订单
    cancelOrder(orderId) {
        if (isMockMode) {
            return mockApi.order.cancelOrder(orderId);
        }
        return request.post(`/orders/${orderId}/cancel`);
    },

    // 支付订单
    payOrder(orderId) {
        if (isMockMode) {
            return mockApi.order.payOrder(orderId);
        }
        return request.post(`/orders/${orderId}/pay`);
    }
};