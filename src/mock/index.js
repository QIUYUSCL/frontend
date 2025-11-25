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
        },

        // 新增：更新图书
        updateBook(bookData) {
            const { bookId } = bookData;
            const index = mockData.books.findIndex(b => b.bookId === parseInt(bookId));

            if (index === -1) {
                return mockResponse(null, false);
            }

            // 更新数据
            const book = mockData.books[index];
            Object.assign(book, {
                condition: bookData.condition,
                price: bookData.price,
                description: bookData.description,
                images: bookData.images || [],
                updateTime: new Date().toISOString()
            });

            return mockResponse(book);
        },

        // 获取我的收藏
        getFavoriteBooks() {
            const currentUser = generateMockData.getCurrentUser();
            const favorites = mockData.favoriteBooks.filter(
                f => f.userId === currentUser.userId
            );

            // 补充完整的图书信息
            const favoritesWithBooks = favorites.map(fav => {
                const book = mockData.books.find(b => b.bookId === fav.bookId);
                return {
                    ...fav,
                    book: book || fav.book
                };
            });

            return mockResponse(favoritesWithBooks);
        },

        // 收藏图书
        addFavorite(bookId) {
            const currentUser = generateMockData.getCurrentUser();
            const existing = mockData.favoriteBooks.find(
                f => f.userId === currentUser.userId && f.bookId === parseInt(bookId)
            );

            if (existing) {
                return mockResponse(null, false); // 已收藏
            }

            const book = mockData.books.find(b => b.bookId === parseInt(bookId));
            if (!book) {
                return mockResponse(null, false);
            }

            const newFavorite = {
                id: Date.now(),
                userId: currentUser.userId,
                bookId: parseInt(bookId),
                createTime: new Date().toISOString(),
                book: book
            };

            mockData.favoriteBooks.push(newFavorite);
            return mockResponse({ success: true });
        },

        // 取消收藏
        removeFavorite(bookId) {
            const currentUser = generateMockData.getCurrentUser();
            const index = mockData.favoriteBooks.findIndex(
                f => f.userId === currentUser.userId && f.bookId === parseInt(bookId)
            );

            if (index === -1) {
                return mockResponse(null, false);
            }

            mockData.favoriteBooks.splice(index, 1);
            return mockResponse({ success: true });
        },

        // 检查是否已收藏
        checkFavorite(bookId) {
            const currentUser = generateMockData.getCurrentUser();
            const favorite = mockData.favoriteBooks.find(
                f => f.userId === currentUser.userId && f.bookId === parseInt(bookId)
            );

            return mockResponse({ isFavorite: !!favorite });
        },
        getMyBooksByStatus(status) {
            const currentUser = generateMockData.getCurrentUser();
            const myBooks = mockData.books.filter(
                b => b.sellerId === currentUser.userId && b.status === status
            );
            return mockResponse(myBooks);
        },

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

        register(userData) {
            const { studentId, realName, password, college, major, grade } = userData;

            // 检查学工号是否已存在
            const existingUser = mockData.users.find(u => u.studentId === studentId);
            if (existingUser) {
                return mockResponse({ message: '该学工号已注册' }, false);
            }

            // 生成新用户ID
            const newUserId = Math.max(...mockData.users.map(u => u.userId)) + 1;

            // 创建新用户
            const newUser = {
                userId: newUserId,
                studentId,
                realName,
                creditScore: 80, // 新用户初始信用分
                college,
                major,
                grade,
                defaultAddress: null
            };

            // 添加到用户列表
            mockData.users.push(newUser);

            // 模拟注册成功后自动登录
            return mockResponse({
                token: 'mock-jwt-token-' + newUserId,
                userId: newUserId,
                userInfo: newUser
            });
        },

        getCurrentUser() {
            const currentUser = generateMockData.getCurrentUser();
            return mockResponse(currentUser);
        },
    },

    // 订单相关
    order: {

        // 新增：创建订单
        createOrder(orderData) {
            const {bookId, buyerId, paymentMethod} = orderData;
            const book = mockData.books.find(b => b.bookId === parseInt(bookId));

            if (!book) {
                return mockResponse(null, false);
            }

            // 创建新订单
            const newOrder = {
                orderId: Date.now(),
                bookId: book.bookId,
                bookTitle: book.title,
                bookCover: book.cover,
                price: book.price,
                buyerId: parseInt(buyerId),
                sellerId: book.sellerId,
                status: "待支付",
                createTime: new Date().toISOString(),
                paymentMethod: paymentMethod
            };

            // 添加到订单列表
            mockData.orders.push(newOrder);

            return mockResponse(newOrder);
        },

        getMyOrders(status = '') {
            const currentUser = generateMockData.getCurrentUser();
            let myOrders = mockData.orders.filter(order =>
                order.buyerId === currentUser.userId || order.sellerId === currentUser.userId
            );

            if (status) {
                myOrders = myOrders.filter(order => order.status === status);
            }

            return mockResponse(myOrders);
        },

        getOrderDetail(orderId) {
            const order = mockData.orders.find(o => o.orderId === parseInt(orderId));
            return mockResponse(order);
        },

        cancelOrder(orderId) {
            return mockResponse({ success: true });
        },

        payOrder(orderId) {
            return mockResponse({ success: true });
        }


    },

// 信用积分相关
    credit: {
        getCreditInfo(userId) {
            const user = mockData.users.find(u => u.userId === parseInt(userId));
            const records = mockData.creditRecords.filter(r => r.userId === parseInt(userId));

            return mockResponse({
                score: user.creditScore,
                level: user.creditScore >= 90 ? '优秀' : user.creditScore >= 70 ? '良好' : '一般',
                records: records
            });
        }
    }
};

export default MOCK_CONFIG;