import axios from 'axios';
import MOCK_CONFIG, { mockApi } from '../mock';

const isMockMode = MOCK_CONFIG.enabled;

// 创建axios实例
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

export const bookApi = {
    // 获取图书详情
    getBookDetail(bookId) {
        if (isMockMode) {
            return mockApi.book.getBookDetail(bookId);
        }
        return request.get(`/books/${bookId}`);
    },

    // 搜索图书
    searchBooks(params) {
        if (isMockMode) {
            return mockApi.book.searchBooks(params);
        }
        return request.get('/books/search', { params });
    },

    // 发布图书
    publishBook(bookForm) {
        if (isMockMode) {
            return mockApi.book.publishBook(bookForm);
        }
        return request.post('/books', bookForm);
    },

    // 获取图书信息（通过ISBN）
    fetchBookInfo(isbn) {
        if (isMockMode) {
            return mockApi.book.fetchBookInfo(isbn);
        }
        return request.get(`/books/isbn/${isbn}`);
    },

    // 获取价格建议
    getPriceSuggestion(isbn, condition) {
        if (isMockMode) {
            return mockApi.book.getPriceSuggestion(isbn, condition);
        }
        return request.get('/books/price-suggestion', { params: { isbn, condition } });
    },

    // 获取我的图书
    getMyBooks() {
        if (isMockMode) {
            return mockApi.book.getMyBooks();
        }
        return request.get('/books/my-books');
    },

    // 删除图书
    deleteBook(bookId) {
        if (isMockMode) {
            return mockApi.book.deleteBook(bookId);
        }
        return request.delete(`/books/${bookId}`);
    },

    purchaseBook(orderInfo) {
        if (isMockMode) {
            // 模拟购买成功
            return mockResponse({
                orderId: Date.now(),
                ...orderInfo
            });
        }
        return request.post('/orders', orderInfo);
    },
    // 新增：更新图书
    updateBook(bookData) {
        if (isMockMode) {
            return mockApi.book.updateBook(bookData);
        }
        return request.put(`/books/${bookData.bookId}`, bookData);
    },
    // 获取我的收藏
    getFavoriteBooks() {
        if (isMockMode) {
            return mockApi.book.getFavoriteBooks();
        }
        return request.get('/books/favorites');
    },

    // 收藏图书
    addFavorite(bookId) {
        if (isMockMode) {
            return mockApi.book.addFavorite(bookId);
        }
        return request.post(`/books/${bookId}/favorite`);
    },

    // 取消收藏
    removeFavorite(bookId) {
        if (isMockMode) {
            return mockApi.book.removeFavorite(bookId);
        }
        return request.delete(`/books/${bookId}/favorite`);
    },

    // 检查收藏状态
    checkFavorite(bookId) {
        if (isMockMode) {
            return mockApi.book.checkFavorite(bookId);
        }
        return request.get(`/books/${bookId}/favorite/check`);
    },
    // 根据状态获取我的图书
    getMyBooksByStatus(status) {
        if (isMockMode) {
            return mockApi.book.getMyBooksByStatus(status);
        }
        return request.get('/books/my-books/status', { params: { status } });
    },
};