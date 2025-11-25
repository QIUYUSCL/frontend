import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PublishBook from '../views/PublishBook.vue'
import KnowledgeMap from '../views/KnowledgeMap.vue'
import PersonalCenter from "@/views/PersonalCenter.vue";
import MyOrders from "@/views/MyOrders.vue";
import CreditScore from "@/views/CreditScore.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/publish',
        name: 'PublishBook',
        component: PublishBook,
        meta: { requiresAuth: true }
    },
    {
        path: '/knowledge-map',
        name: 'KnowledgeMap',
        component: KnowledgeMap
    },
    {
        path: '/search',
        name: 'Search',
        component: () => import('../views/Search.vue')
    },
    {
        path: '/book/detail/:id',
        name: 'BookDetail',
        component: () => import('../views/BookDetail.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/personal',
        name: 'PersonalCenter',
        component: PersonalCenter
    },
    {
        path: '/my-orders',
        name: 'MyOrders',
        component: MyOrders
    },
    {
        path: '/credit',
        name: 'CreditScore',
        component: CreditScore
    },
    {
        path: '/order/confirm/:bookId',
        name: 'OrderConfirm',
        component: () => import('../views/OrderConfirm.vue'),
        meta: { requiresAuth: true }
    },
    {
        path: '/book/edit/:id',
        name: 'EditBook',
        component: () => import('../views/EditBook.vue'),
        meta: { requiresAuth: true }
    },

    {
        path: '/my-books',
        name: 'MyBooks',
        component: () => import('../views/MyBooks.vue'),
        meta: { requiresAuth: true }
    }


    ]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token')
    if (to.meta.requiresAuth && !token) {
        next('/login')
    } else {
        next()
    }
})

export default router