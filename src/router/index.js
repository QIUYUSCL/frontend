import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import PublishBook from '../views/PublishBook.vue'
import KnowledgeMap from '../views/KnowledgeMap.vue'

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