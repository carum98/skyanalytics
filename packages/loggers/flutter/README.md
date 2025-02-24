[![pub package](https://img.shields.io/pub/v/skylogger.svg)](https://pub.dev/packages/skylogger)

# SkyLogger Flutter
SkyLogger Flutter is a logger to [SkyAnalytics](https://github.com/carum98/skyanalytics)

## Installation
Add the following to your `pubspec.yaml` file:
```yaml
dependencies:
  skylogger: ^0.1.0
```

## Usage
```dart
import 'package:skylogger/skylogger_flutter.dart';

SkyLogger.error('This is an error');
SkyLogger.debug('This is a debug');
```

To more control, you can define the folder to store the logs:
```dart
SkyLogger.error('This is an error', folder: 'admin');
SkyLogger.debug('This is a debug', folder: 'admin');
```

## Viewing logs
To view the logs, you can use the `SkyLoggerViewer` widget
```dart
Navigator.push(
	context,
	MaterialPageRoute(builder: (_) => const SkyLoggerViewer()),
),
```

## Exporting logs
To export the logs as a ZIP file, you can use the `LoggerReader.zipLogs()` method
```dart
final zipFile = await LoggerReader.zipLogs();
```