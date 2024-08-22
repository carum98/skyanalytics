import 'package:skyanalytics/skyanalytics_flutter.dart';

void main(List<String> args) {
  const skyAnalytics = SkyAnalytics(
    sourceKey: 'sourceKey',
    host: 'https://example.com',
  );

  skyAnalytics.event(name: 'create_element');
  skyAnalytics.navigate(screenName: 'home');
}
