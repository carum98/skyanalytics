# SkyAnalytics JS
SkyAnalytics JS is an adapter for [SkyAnalytics](https://github.com/carum98/skyanalytics) that allows you to track your website's traffic and user behavior.

[![npm version](https://badge.fury.io/js/@skyanalytics%2Fjs.svg)](https://badge.fury.io/js/@skyanalytics%2Fjs)

## Installation
```shell
npm install @skyanalytics/js
```

## Usage
```javascript
import skyanalytics from '@skyanalytics/js';

skyanalytics.init({
    key: 'source_key',
    host: 'http://localhost:3000'
});
```

### Tracking page views
```javascript
analytics.navigation({ name: 'page_name' });
```

### Tracking events
```javascript
analytics.event({ name: 'event_name' });
```

### Metadata
You can add metadata to your `view`.
```javascript
analytics.navigation({ name: 'page_name', metadata: { key1: 'value1', key2: 'value2' } });
```

Global metadata can be set using the `metadata` method.
```javascript
analytics.metadata({ key1: 'value1', key2: 'value2' });
```