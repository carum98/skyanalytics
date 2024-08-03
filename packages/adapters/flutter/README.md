# SkyAnalytics Flutter
SkyAnalytics Flutter is an adapter for [SkyAnalytics](https://github.com/carum98/skyanalytics) that allows you to track your website's traffic and user behavior.

## Installation
```yaml
dependencies:
  skyanalytics_flutter: 
    git: 
        url: 'https://github.com/carum98/skyanalytics.git'
        ref: 'main'
        path: 'packages/adapters/flutter'
```

## Usage
```dart
const skyAnalytics = SkyAnalytics(
    sourceKey: 'sourceKey',
    host: 'https://example.com',
);

skyAnalytics.event(name: 'create_element');
skyAnalytics.navigate(screenName: 'home');
```

### NavigatorObserver
```dart
final navigatorObserver = SkyAnalyticsNavigatorObserver(skyAnalytics: skyAnalytics);

MaterialApp(
    navigatorObservers: [navigatorObserver],
    home: HomeScreen(),
);
```

**Important**: The `SkyAnalyticsNavigatorObserver` needs the `RouteSettings` to be set in order to track the screen name. If you are using the `MaterialApp` widget, the `RouteSettings` are automatically set. If you are using a custom `Navigator`, you need to set the `RouteSettings` manually.