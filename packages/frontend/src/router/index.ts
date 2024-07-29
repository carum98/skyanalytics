import { cookieExists } from '@/utils/cookies'
import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        name: 'login',
        path: '/login',
        component: () => import('@views/Login.vue'),
        meta: {
            layout: 'login'
        }
    },
    {
        name: 'home',
        path: '/',
        component: () => import('@views/Home.vue'),
        meta: {
            title: 'Home'
        }
    },
    {
        name: 'events',
        path: '/events',
        component: () => import('@views/Events.vue'),
        meta: {
            title: 'Events'
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to, _from, next) => {
    const isAuthenticated = cookieExists('skyanalytics')

    if (to.name !== 'login' && !isAuthenticated) {
        next({ name: 'login' })
    } else {
        next()
    }
})

export {
    router
}