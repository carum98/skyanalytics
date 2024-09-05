import { createApp } from 'vue'
import { router } from './router'

import App from './App.vue'

// Plugins
import { dialogPlugin } from './plugins/dialogs.plugin'

createApp(App)
    .use(router)
    .use(dialogPlugin)
    .mount('#app')
