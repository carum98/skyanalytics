import { createApp } from 'vue'
import { router } from './router'

import App from './App.vue'
import analytics from '@skyanalytics/vue3'

// Plugins
import { dialogPlugin } from './plugins/dialogs.plugin'

createApp(App)
    .use(dialogPlugin)
	.use(analytics, {
		host: import.meta.env.VITE_URL_BACKEND,
		key: import.meta.env.VITE_ANALYTICS_KEY,
	})
    .use(router)
    .mount('#app')
