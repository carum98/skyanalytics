part of 'skyanalytics_flutter.dart';

class SkyAnalyticsNavigatorObserver extends NavigatorObserver {
  final SkyAnalytics skyAnalytics;

  SkyAnalyticsNavigatorObserver({
    required this.skyAnalytics,
  });

  @override
  void didPush(Route<dynamic> route, Route<dynamic>? previousRoute) {
    super.didPush(route, previousRoute);

    final routeName = route.settings.name;

    if (routeName != null) {
      skyAnalytics.navigate(screenName: routeName);
    }
  }
}
