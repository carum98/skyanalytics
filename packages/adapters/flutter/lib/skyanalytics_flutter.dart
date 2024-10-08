library skyanalytics_flutter;

import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';

part 'skyanalytics_navigator_observer.dart';

/// A class that sends events to SkyAnalytics.
class SkyAnalytics {
  /// The HTTP client.
  final HttpClient client = HttpClient();

  /// The cookie manager.
  final CookieManager cookieManager = CookieManager();

  /// The SkyAnalytics source key.
  final String sourceKey;

  /// The SkyAnalytics host.
  final String host;

  /// Creates a new [SkyAnalytics] instance with the given [sourceKey] and [host].
  SkyAnalytics({
    required this.sourceKey,
    required this.host,
  });

  /// Sends an event with the given [name] and [parameters] to SkyAnalytics.
  Future<void> event({
    required String name,
    Map<String, dynamic>? parameters,
  }) async {
    await _send({
      'event': name,
    });
  }

  /// Navigates to the screen with the given [screenName].
  Future<void> navigate({
    required String screenName,
  }) async {
    await _send({
      'navigation': screenName,
    });
  }

  /// Disposes the [SkyAnalytics] instance.
  void dispose() {
    client.close(force: true);
    cookieManager.clearCookies();
  }

  Future<void> _send(Map<String, dynamic> params) async {
    try {
      final uri = Uri.parse(host).replace(path: '/send');

      String operatingSystem = Platform.operatingSystem;
      String operatingSystemVersion = Platform.operatingSystemVersion;

      final userAgent =
          '($operatingSystem $operatingSystemVersion) ${client.userAgent}';

      HttpClientRequest request = await client.postUrl(uri);

      request.headers.set('User-Agent', userAgent);
      request.headers.set('Content-Type', 'application/json');
      request.headers.set('X-SkyAnalytics-Key', sourceKey);

      cookieManager.setCookies(request);
      request.write(json.encode(params));

      final response = await request.close();
      await response.transform(utf8.decoder).join();

      cookieManager.updateCookies(response);
    } catch (e) {
      if (kDebugMode) {
        print('Error: $e');
      }
    }
  }
}

/// A class that manages cookies for HTTP requests.
class CookieManager {
  /// Store the cookies
  Map<String, String> cookies = {};

  /// Updates the cookies from the given [response].
  void updateCookies(HttpClientResponse response) {
    List<String>? setCookies = response.headers[HttpHeaders.setCookieHeader];
    if (setCookies != null) {
      for (var cookie in setCookies) {
        var cookieParts = cookie.split(';').first.split('=');
        var key = cookieParts[0].trim();
        var value = cookieParts[1].trim();
        cookies[key] = value;
      }
    }
  }

  /// Sets the cookies for the given [request].
  void setCookies(HttpClientRequest request) {
    if (cookies.isNotEmpty) {
      var cookieHeader =
          cookies.entries.map((e) => '${e.key}=${e.value}').join('; ');
      request.headers.set(HttpHeaders.cookieHeader, cookieHeader);
    }
  }

  /// Clears the cookies.
  void clearCookies() {
    cookies.clear();
  }
}
