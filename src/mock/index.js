import { mockData, generateMockData } from './data';

// 模拟API配置
const MOCK_CONFIG = {
    enabled: true, // 设置为false可切换到真实API
    delay: 300 // 模拟网络延迟
};

// 模拟响应生成器
const mockResponse = (data, success = true) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                code: success ? 200 : 500,
                message: success ? 'success' : 'mock error',
                data: data
            });
        }, MOCK_CONFIG.delay);
    });
};

// 模拟API实现
export const mockApi = {
    // 图书相关
    book: {
        getBookDetail(bookId) {
            const book = mockData.books.find(b => b.bookId === parseInt(bookId));
            return mockResponse(book);
        },

        searchBooks(params) {
            const { keyword, page = 1, size = 12, condition, minPrice, maxPrice } = params;
            const filters = { condition, minPrice, maxPrice };
            const results = generateMockData.searchBooks(keyword, filters);

            // 分页处理
            const start = (page - 1) * size;
            const end = start + size;
            const paginatedList = results.list.slice(start, end);

            return mockResponse({
                list: paginatedList,
                total: results.total
            });
        },

        publishBook(bookForm) {
            // 模拟发布成功
            return mockResponse({ bookId: Date.now() });
        },

        fetchBookInfo(isbn) {
            // 模拟豆瓣API返回
            const isbnMap = {
                '9787111128069': {
                    title: "算法导论（第三版）",
                    author: "Thomas H. Cormen",
                    publisher: "机械工业出版社"
                },
                '9787040406641': {
                    title: "数据结构（C语言版）",
                    author: "严蔚敏",
                    publisher: "高等教育出版社"
                }
            };

            return mockResponse(isbnMap[isbn] || {});
        },

        getPriceSuggestion(isbn, condition) {
            const priceMap = {
                '9787111128069': { min: 30, max: 45 },
                '9787040406641': { min: 18, max: 28 }
            };

            return mockResponse(priceMap[isbn] || { min: 20, max: 35 });
        },

        getMyBooks() {
            const currentUser = generateMockData.getCurrentUser();
            const myBooks = generateMockData.getUserBooks(currentUser.userId);
            return mockResponse(myBooks);
        },

        deleteBook(bookId) {
            return mockResponse({ success: true });
        }
    },

    // 推荐相关
    recommendation: {
        getPersonalRecommendation(userId, size = 8) {
            return mockResponse(mockData.recommendations.personal);
        },

        getPopularRecommendation(discipline, size = 8) {
            return mockResponse(mockData.recommendations.popular);
        },

        getRelatedRecommendation(bookId, size = 6) {
            // 返回与该图书同类型的其他书籍
            const currentBook = mockData.books.find(b => b.bookId === parseInt(bookId));
            if (!currentBook) return mockResponse([]);

            const related = mockData.books
                .filter(b => b.bookId !== currentBook.bookId)
                .sort(() => Math.random() - 0.5)
                .slice(0, size);

            return mockResponse(related);
        }
    },

    // 知识图谱相关
    kg: {
        getKnowledgeGraphData(disciplineName) {
            return mockResponse(mockData.knowledgeGraph);
        },

        semanticSearch(keywords) {
            // 模拟语义搜索
            const results = mockData.books.slice(0, 5);
            return mockResponse(results);
        }
    },

    // 用户相关
    auth: {
        login(credentials) {
            const { studentId, password } = credentials;
            const user = mockData.users.find(u => u.studentId === studentId);

            if (user && password === '123456') { // 模拟密码验证
                return mockResponse({
                    token: 'mock-jwt-token-' + user.userId,
                    userId: user.userId,
                    userInfo: user
                });
            }

            return mockResponse(null, false);
        },

        getCurrentUser() {
            return mockResponse(generateMockData.getCurrentUser());
        }
    }
};

export default MOCK_CONFIG;