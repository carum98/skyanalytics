part of 'skyanalytics_flutter.dart';

/// A [NavigatorObserver] that sends screen navigation events to SkyAnalytics.
class SkyAnalyticsNavigatorObserver extends NavigatorObserver {
  /// The SkyAnalytics instance to send events to.
  final SkyAnalytics skyAnalytics;

  /// Creates a new [SkyAnalyticsNavigatorObserver] with the given [skyAnalytics].
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
