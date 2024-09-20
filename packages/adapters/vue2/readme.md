# SkyAnalytics Vue-2
SkyAnalytics Vue-2 is an adapter for [SkyAnalytics](https://github.com/carum98/skyanalytics) that allows you to track your website's traffic and user behavior.

[![npm version](https://badge.fury.io/js/@skyanalytics%2Fvue2.svg)](https://badge.fury.io/js/@skyanalytics%2Fvue2)

## Installation
```bash
npm install @skyanalytics/vue2
```

## Usage
```javascript
import Vue from 'vue'
import SkyAnalytics from '@skyanalytics/vue2'

Vue.use(SkyAnalytics, {
    key: 'source_key',
    host: 'http://localhost:3000',
	enabled: true // default is true
})
```

### Directives
```html
<button v-sk-analytics="{ event: 'click', data: { key: 'value' } }">Click me</button>
```

### Methods
```javascript
this.$skyAnalytics.event('event', { key: 'value' })
```

### Composable
```javascript
import { useAnalytics } from '@skyanalytics/vue2'

useAnalytics.event('event', { key: 'value' })
useAnalytics.navigate('page', { key: 'value' })
```

## Vue-Router
```javascript
import Vue from 'vue'
import VueRouter from 'vue-router'
import SkyAnalytics from '@skyanalytics/vue2'

Vue.use(VueRouter)
Vue.use(SkyAnalytics, {
    key: 'source_key',
    host: 'http://localhost:3000',
	enabled: true // default is true
})

const router = new VueRouter({
    routes: []
})

router.beforeEach((to, from, next) => {
    Vue.prototype.$skyAnalytics.navigation({ name: to.name })
    next()
})
```