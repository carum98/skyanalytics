# SkyAnalytics Vue-3
SkyAnalytics Vue-3 is an adapter for [SkyAnalytics](https://github.com/carum98/skyanalytics) that allows you to track your website's traffic and user behavior.

[![npm version](https://badge.fury.io/js/@skyanalytics%2Fvue3.svg)](https://badge.fury.io/js/@skyanalytics%2Fvue3)

## Installation
```bash
npm install @skyanalytics/vue3
```

## Usage
```javascript
import { createApp } from 'vue'
import analytics from '@skyanalytics/vue3'

const app = createApp({
  // ...
})

app.use(analytics, {
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
import { useAnalytics } from '@skyanalytics/vue3'

useAnalytics.event('event', { key: 'value' })
useAnalytics.navigate('page', { key: 'value' })
```

## Vue-Router
```javascript
import { createRouter } from 'vue-router'
import { useAnalytics } from '@skyanalytics/vue3'

const analytics = useAnalytics()

const router = createRouter({
  // ...
})

router.beforeEach((to, from, next) => {
  analytics.navigate(to.name)
  next()
})
```