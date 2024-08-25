import { cookieExists } from '@/utils/cookies'
import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'

import type { DialogRecordRaw } from '@composables/useDialog'

const routes: RouteRecordRaw[] = [
    {
        name: 'login',
        path: '/login',
        component: () => import('@views/Login.vue'),
        meta: {
            layout: 'login',
            disableTransition: true
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
        component: () => import('@/views/sources/Profile.vue'),
        meta: {
            title: 'Sources'
        }
    }
]

const dialogs: DialogRecordRaw[] = [
    {
        name: 'sources.form',
        component: () => import('@views/sources/Form.vue'),
        rootProps: {
            width: 300
        }
    },
    {
        name: 'sources.delete',
        component: () => import('@views/sources/Delete.vue'),
    },
    {
        name: 'sources.key',
        component: () => import('@views/sources/Key.vue'),
    },
    {
        name: 'sessions.table',
        component: () => import('@views/sessions/Table.vue'),
        rootProps: {
            width: 500
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
    router,
    dialogs
}