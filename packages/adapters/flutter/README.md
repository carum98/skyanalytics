[![pub package](https://img.shields.io/pub/v/skyanalytics.svg)](https://pub.dev/packages/skyanalytics)

# SkyAnalytics Flutter
SkyAnalytics Flutter is an adapter for [SkyAnalytics](https://github.com/carum98/skyanalytics) that allows you to track your website's traffic and user behavior.

## Installation
Add the following to your `pubspec.yaml` file:
```yaml
dependencies:
  skyanalytics: ^0.1.0
```

## Usage
```dart
import 'package:skyanalytics/skyanalytics_flutter.dart';

const skyAnalytics = SkyAnalytics(
    sourceKey: 'sourceKey',
    host: 'https://example.com',
    enabled: true, // default is true
    showLogs: false, // default is false
);

skyAnalytics.event(name: 'create_element');
skyAnalytics.navigate(screenName: 'home');
skyAnalytics.metadata({
    'key1': 'value1',
    'key2': 'value2',
});
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