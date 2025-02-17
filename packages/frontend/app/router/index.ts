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
			},
			{
				name: 'settings.summary',
				path: 'summary',
				component: () => import('@views/summary/Profile.vue'),
			},
            {
                name: 'settings.bug-report',
                path: 'bug-reports',
                component: () => import('@views/reports/Settings.vue'),
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
		name: 'summary.form',
		component: () => import('@views/summary/Form.vue'),
		rootProps: {
            width: 300
        }
	},
    {
        name: 'summary.preview',
        component: () => import('@views/summary/Preview.vue'),
        rootProps: {
            width: 1100
        }
    },
    {
        name: 'reports.list',
        component: () => import('@views/reports/List.vue'),
        rootProps: {
            width: 1100
        }
    },
    {
        name: 'files.preview',
        component: () => import('@components/files/Preview.vue'),
        rootProps: {
            width: 800
        }
    },
    {
        name: 'bug-report.form-settings',
		component: () => import('@views/reports/SettingsForm.vue'),
		rootProps: {
            width: 300
        } 
    },
	{
		name: 'remove',
		component: () => import('@components/DialogRemove.vue'),
	},
    {
        name: 'confirm',
        component: () => import('@components/DialogConfirm.vue'),
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
            width: 1100
        }
    },
	{
        name: 'events.list',
        component: () => import('@views/events/List.sidebar.vue'),
        rootProps: {
            width: 1100
        }
    },
    {
        name: 'reports.profile',
        component: () => import('@views/reports/Profile.sidebar.vue'),
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