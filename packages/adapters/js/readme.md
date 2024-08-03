# SkyAnalytics JS
SkyAnalytics JS is an adapter for [SkyAnalytics](https://github.com/carum98/skyanalytics) that allows you to track your website's traffic and user behavior.

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