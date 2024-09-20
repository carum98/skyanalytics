# SkyAnalytics Nuxt
SkyAnalytics Nuxt is an adapter for [SkyAnalytics](https://github.com/carum98/skyanalytics) that allows you to track your website's traffic and user behavior.

[![npm version](https://badge.fury.io/js/@skyanalytics%2Fnuxt.svg)](https://badge.fury.io/js/@skyanalytics%2Fnuxt)

## Installation
```bash
npm install @skyanalytics/nuxt
```

```typescript
// `nuxt.config.ts`
export default defineNuxtConfig({
  modules: ['@skyanalytics/nuxt'],
  skyanalytics: {
    key: 'source_key',
    host: 'http://localhost:3000',
  },
});
```

### Module options
- `key` - The source key of your SkyAnalytics instance.
- `host` - The host of your SkyAnalytics instance.
- `captureNavigation` - Capture navigation events automatically. Default: `true`.
- `enabled` - Enable or disable tracking. Default: `true`.

## Usage

### Directives
```html
<button v-sk-analytics="{ event: 'click', data: { key: 'value' } }">Click me</button>
```

### Composable
```typescript
const analytics = useAnalytics()

function send() {
  analytics.event('event_name', { key: 'value' })
}
```