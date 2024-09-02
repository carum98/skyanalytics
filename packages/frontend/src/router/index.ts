import { cookieExists } from '@/utils/cookies'
import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'

import type { DialogRecordRaw } from '@composables/useDialog'
import type { SidebarRecordRaw } from '@composables/useSidebar'

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
    },
    {
        name: 'map',
        path: '/map',
        component: () => import('@views/Map.vue'),
        meta: {
            disableTransition: true
        }
    },
	{
		name: 'bug-report',
		path: '/bug-report',
		component: () => import('@views/BugReport.vue'),
		meta: {
            disableTransition: true
        }
	},
    {
        name: 'sources',
        path: '/sources/:code',
        component: () => import('@views/sources/Profile.vue'),
        meta: {
            title: 'Sources'
        },
        redirect: { name: 'sources.summary' },
        children: [
            {
                name: 'sources.summary',
                path: 'summary',
                component: () => import('@views/sources/sections/Summary.vue'),
            },
            {
                name: 'sources.views',
                path: 'views',
                component: () => import('@views/sources/sections/Views.vue'),
            },
            {
                name: 'sources.sessions',
                path: 'sessions',
                component: () => import('@views/sources/sections/Sessions.vue'),
            },
            {
                name: 'sources.events',
                path: 'events',
                component: () => import('@views/sources/sections/Events.vue'),
            },
        ]
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
]

const sidebars: SidebarRecordRaw[] = [
    {
        name: 'sessions.list',
        component: () => import('@views/sessions/List.sidebar.vue'),
    },
    {
        name: 'views.list',
        component: () => import('@views/views/List.sidebar.vue'),
        rootProps: {
            width: 900
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
    dialogs,
    sidebars
}