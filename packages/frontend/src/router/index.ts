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
            title: 'Analytics'
        }
    },
    {
        name: 'sources',
        path: '/sources/:code',
        component: () => import('@views/Sources.vue'),
        meta: {
            title: 'Sources'
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