import { createMemoryHistory, createRouter, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        name: 'home',
        path: '/',
        component: () => import('@views/Home.vue')
    },
    {
        name: 'login',
        path: '/login',
        component: () => import('@views/Login.vue')
    }
]

const router = createRouter({
    history: createMemoryHistory(),
    routes,
})

export {
    router
}