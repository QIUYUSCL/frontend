// data.js - 升级版真实封面 + 更多高质量模拟数据
export const mockData = {
    // 用户数据（保持不变）
    users: [
        {
            userId: 1001,
            studentId: "2021000001",
            realName: "张小明",
            creditScore: 95,
            college: "信息工程学院",
            major: "软件工程",
            grade: 2021
        },
        {
            userId: 1002,
            studentId: "2021000002",
            realName: "李华",
            creditScore: 88,
            college: "计算机学院",
            major: "计算机科学与技术",
            grade: 2021
        },
        {
            userId: 1003,
            studentId: "2022000001",
            realName: "王芳",
            creditScore: 92,
            college: "信息工程学院",
            major: "电子信息工程",
            grade: 2022
        }
    ],

    // 图书数据 - 全部使用真实高清封面（来自豆瓣/当当/京东公开链接）
    books: [
        {
            bookId: 2001,
            isbn: "9787111128069",
            title: "算法导论（原书第3版）",
            author: "Thomas H. Cormen 等",
            publisher: "机械工业出版社",
            price: 89.00,
            originalPrice: 128.00,
            condition: "九成新",
            description: "计算机经典教材，笔记轻微，书脊完好",
            sellerId: 1001,
            status: "在售",
            viewCount: 328,
            createTime: "2025-09-15T10:30:00",
            cover: "public/images/5abb54f5N4d11464e.jpg"
        },
        {
            bookId: 2002,
            isbn: "9787040406641",
            title: "数据结构（C语言版）",
            author: "严蔚敏",
            publisher: "清华大学出版社",
            price: 22.00,
            originalPrice: 39.00,
            condition: "八成新",
            description: "经典严版数据结构，有少量划线",
            sellerId: 1002,
            status: "在售",
            viewCount: 256,
            createTime: "2025-10-10T14:20:00",
            cover: "public/images/9787302147510.jpg"
        },
        {
            bookId: 2003,
            isbn: "9787302275959",
            title: "计算机网络（第7版）",
            author: "谢希仁",
            publisher: "电子工业出版社",
            price: 28.00,
            originalPrice: 59.00,
            condition: "九成新",
            description: "几乎全新，买来没怎么翻",
            sellerId: 1003,
            status: "在售",
            viewCount: 412,
            createTime: "2025-10-20T09:15:00",
            cover: "public/images/4a32bd868be2b935.jpg"
        },
        {
            bookId: 2004,
            isbn: "9787115565402",
            title: "深度学习入门：基于Python的理论与实现",
            author: "斋藤康毅",
            publisher: "人民邮电出版社",
            price: 45.00,
            originalPrice: 99.00,
            condition: "全新",
            description: "鱼书，全新未拆封，买重复了",
            sellerId: 1001,
            status: "在售",
            viewCount: 289,
            createTime: "2025-11-01T16:45:00",
            cover: "public/images/xZAWfwpTFGQGgkLR5MXm1A.jpg"
        },
        {
            bookId: 2005,
            isbn: "9787040566232",
            title: "线性代数及其应用（原书第5版）",
            author: "David C. Lay",
            publisher: "机械工业出版社",
            price: 38.00,
            originalPrice: 89.00,
            condition: "九成新",
            description: "线代经典教材，含答案解析",
            sellerId: 1002,
            status: "在售",
            viewCount: 178,
            createTime: "2025-09-28T11:30:00",
            cover: "public/images/PixPin_2025-11-25_12-14-27.jpg"
        },
        {
            bookId: 2006,
            isbn: "9787111641247",
            title: "Java核心技术 卷I：基础知识（第11版）",
            author: "Cay S. Horstmann",
            publisher: "机械工业出版社",
            price: 78.00,
            originalPrice: 149.00,
            condition: "九成新",
            description: "Java圣经，2022最新版",
            sellerId: 1003,
            status: "在售",
            viewCount: 267,
            createTime: "2025-10-05T13:20:00",
            cover: "public/images/PixPin_2025-11-25_12-15-41.jpg"
        },
        {
            bookId: 2007,
            isbn: "9787302555834",
            title: "操作系统概念（原书第10版）",
            author: "Abraham Silberschatz",
            publisher: "高等教育出版社",
            price: 48.00,
            originalPrice: 119.00,
            condition: "八成新",
            description: "恐龙书，操作系统经典",
            sellerId: 1001,
            status: "在售",
            viewCount: 198,
            createTime: "2025-10-15T15:10:00",
            cover: "public/images/PixPin_2025-11-25_12-16-13.jpg"
        },
        {
            bookId: 2008,
            isbn: "9787111641233",
            title: "数据库系统概念（原书第7版）",
            author: "Abraham Silberschatz",
            publisher: "机械工业出版社",
            price: 68.00,
            originalPrice: 139.00,
            condition: "九成新",
            description: "数据库领域经典教材",
            sellerId: 1002,
            status: "在售",
            viewCount: 156,
            createTime: "2025-10-25T10:50:00",
            cover: "public/images/PixPin_2025-11-25_12-16-43.jpg"
        },
        {
            bookId: 2009,
            isbn: "9787115526595",
            title: "Python编程：从入门到实践（第2版）",
            author: "Eric Matthes",
            publisher: "人民邮电出版社",
            price: 58.00,
            originalPrice: 109.00,
            condition: "全新",
            description: "Python入门神书，项目驱动",
            sellerId: 1003,
            status: "在售",
            viewCount: 456,
            createTime: "2025-11-05T09:30:00",
            cover: "public/images/v2-0769c039eb86a19e83fb17fd25485d77_r.jpg"
        },
        {
            bookId: 2013,
            isbn: "9787302423287",
            title: "机器学习",
            author: "周志华",
            publisher: "清华大学出版社",
            price: 68.00,
            originalPrice: 138.00,
            condition: "全新",
            description: "西瓜书，机器学习圣经",
            sellerId: 1001,
            status: "在售",
            viewCount: 523,
            createTime: "2025-11-08T13:30:00",
            cover: "public/images/05d1646fcc28420b.jpg"
        },
        {
            bookId: 2011,
            isbn: "9787121330872",
            title: "C++ Primer（第5版）",
            author: "Stanley B. Lippman",
            publisher: "电子工业出版社",
            price: 72.00,
            originalPrice: 128.00,
            condition: "九成新",
            description: "C++经典入门书",
            sellerId: 1002,
            status: "在售",
            viewCount: 289,
            createTime: "2025-10-08T11:15:00",
            cover: "public/images/PixPin_2025-11-25_12-17-12.jpg"
        },
        {
            bookId: 2014,
            isbn: "9787302456461",
            title: "计算机组成与设计：硬件/软件接口（原书第5版）",
            author: "David A. Patterson",
            publisher: "清华大学出版社",
            price: 65.00,
            originalPrice: 139.00,
            condition: "九成新",
            description: "RISC-V版，计组神书",
            sellerId: 1003,
            status: "在售",
            viewCount: 234,
            createTime: "2025-10-18T11:45:00",
            cover: "public/images/PixPin_2025-11-25_12-17-49.jpg"
        }
    ],

    // 推荐数据（使用真实封面）
    recommendations: {
        personal: [
            {
                bookId: 2001,
                title: "算法导论（原书第3版）",
                price: 89.00,
                cover: "public/images/5abb54f5N4d11464e.jpg",
                reasons: ["您专业核心教材", "同院系学长最爱买"]
            },
            {
                bookId: 2002,
                title: "数据结构（C语言版）",
                price: 22.00,
                cover: "public/images/9787302147510.jpg",
                reasons: ["本学期《数据结构》课程指定教材"]
            },
            {
                bookId: 2013,
                title: "机器学习",
                price: 68.00,
                cover: "public/images/05d1646fcc28420b.jpg",
                reasons: ["您浏览过AI相关书籍，强力推荐西瓜书"]
            },
            {
                bookId: 2009,
                title: "Python编程：从入门到实践",
                price: 58.00,
                cover: "public/images/v2-0769c039eb86a19e83fb17fd25485d77_r.jpg",
                reasons: ["Python最热入门书，适合零基础"]
            }
        ],
        popular: [
            {
                bookId: 2013,
                title: "机器学习",
                price: 68.00,
                cover: "public/images/05d1646fcc28420b.jpg",
                reasons: ["全校最热，人工智能必读"]
            },
            {
                bookId: 2009,
                title: "Python编程：从入门到实践",
                price: 58.00,
                cover: "public/images/v2-0769c039eb86a19e83fb17fd25485d77_r.jpg",
                reasons: ["本月销量第一，适合所有专业"]
            },
            {
                bookId: 2003,
                title: "计算机网络（第7版）",
                price: 28.00,
                cover: "public/images/4a32bd868be2b935.jpg",
                reasons: ["计网课必备，谢希仁经典"]
            }
        ]
    },

    // 知识图谱数据（节点名称更清晰）
    knowledgeGraph: {
        nodes: [
            { id: "dis_cs", name: "计算机科学与技术", category: "学科" },
            { id: "course_ds", name: "数据结构", category: "课程" },
            { id: "course_algo", name: "算法设计与分析", category: "课程" },
            { id: "course_net", name: "计算机网络", category: "课程" },
            { id: "course_os", name: "操作系统", category: "课程" },
            { id: "book_ds", name: "数据结构（严蔚敏）", category: "教材" },
            { id: "book_algo", name: "算法导论", category: "教材" },
            { id: "book_net", name: "计算机网络（谢希仁）", category: "教材" },
            { id: "book_ml", name: "机器学习（周志华）", category: "教材" },
            { id: "kp_tree", name: "二叉树", category: "知识点" },
            { id: "kp_sort", name: "排序算法", category: "知识点" },
            { id: "kp_graph", name: "图论算法", category: "知识点" }
        ],
        links: [
            { source: "dis_cs", target: "course_ds", type: "包含" },
            { source: "dis_cs", target: "course_algo", type: "包含" },
            { source: "dis_cs", target: "course_net", type: "包含" },
            { source: "course_ds", target: "book_ds", type: "使用教材" },
            { source: "course_algo", target: "book_algo", type: "使用教材" },
            { source: "course_net", target: "book_net", type: "使用教材" },
            { source: "course_algo", target: "book_ml", type: "后续进阶" },
            { source: "book_ds", target: "kp_tree", type: "包含" },
            { source: "book_ds", target: "kp_graph", type: "包含" },
            { source: "book_algo", target: "kp_sort", type: "包含" }
        ]
    }
};

// 工具函数保持不变
export const generateMockData = {
    generateBooks(count = 12) {
        const base = mockData.books;
        if (count <= base.length) return base.slice(0, count);
        return base;
    },

    searchBooks(keyword = "", filters = {}) {
        let results = mockData.books;
        if (keyword) {
            const kw = keyword.toLowerCase();
            results = results.filter(book =>
                book.title.toLowerCase().includes(kw) ||
                book.author.toLowerCase().includes(kw) ||
                book.isbn.includes(keyword)
            );
        }
        return { list: results, total: results.length };
    },

    getUserBooks(userId) {
        return mockData.books.filter(b => b.sellerId === userId);
    },

    getCurrentUser() {
        return mockData.users[0];
    }
};