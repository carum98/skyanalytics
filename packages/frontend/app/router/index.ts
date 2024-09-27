import { cookieExists } from '@/utils/cookies'
import { createWebHistory, createRouter, type RouteRecordRaw } from 'vue-router'
import { useAnalytics } from '@skyanalytics/vue3'

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
		name: 'settings',
		path: '/settings',
		component: () => import('@views/Settings.vue'),
		meta: {
			disableTransition: true
		},
		redirect: { 
			name: 'settings.users'
		},
		children: [
			{
				name: 'settings.users',
				path: 'users',
				component: () => import('@views/users/List.vue'),
			}
		]
	},
    {
        name: 'sources',
        path: '/sources/:code',
        component: () => import('@views/sources/Profile.vue'),
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
        name: 'sources.key',
        component: () => import('@views/sources/Key.vue'),
    },
	{
        name: 'users.form',
        component: () => import('@views/users/Form.vue'),
        rootProps: {
            width: 300
        }
    },
	{
		name: 'remove',
		component: () => import('@components/DialogRemove.vue'),
	}
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
    },
	{
        name: 'events.list',
        component: () => import('@views/events/List.sidebar.vue'),
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

	if (import.meta.env.MODE === 'production') {
		const analytics = useAnalytics()
		analytics.navigate(to.name as string)
	}

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