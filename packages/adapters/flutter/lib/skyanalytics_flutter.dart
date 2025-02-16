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

  /// The flag to enable or disable the analytics.
  final bool isEnable;

  /// The flag to show logs.
  final bool showLogs;

  /// Private constructor for singleton pattern.
  SkyAnalytics._internal({
    required this.sourceKey,
    required this.host,
    required this.isEnable,
    required this.showLogs,
  }) {
    if (showLogs) {
      print('SkyAnalytics instance');
    }
  }

  /// The singleton instance.
  static SkyAnalytics? _instance;

  /// Factory constructor to provide the singleton instance.
  factory SkyAnalytics({
    required String sourceKey,
    required String host,
    required bool enabled,
    showLogs = false,
  }) {
    return _instance ??= SkyAnalytics._internal(
      sourceKey: sourceKey,
      host: host,
      isEnable: enabled,
      showLogs: showLogs,
    );
  }

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

  /// Sets the global metadata with the given [payload].
  Future<void> metadata(
    Map<String, String> payload,
  ) async {
    await _send({
      'metadata': payload,
    });
  }

  /// Send bug report with the given
  Future<void> bugReport({
    required String description,
    required String name,
    required String contact,
    Map<String, dynamic>? metadata,
    List<File>? files,
  }) async {
    await _send({
      'bugReport': {
        'description': description,
        'user': {
          'name': name,
          'contact': contact,
        },
        'files': files,
      },
      'metadata': metadata,
    }, formData: true);
  }

  /// Clears the metadata.
  Future<void> clearMetadata() async {
    await _send({
      'metadata': {},
    });
  }

  /// Sends the given [params] to the SkyAnalytics API.
  Future<void> _send(Map<String, dynamic> params, {
    bool formData = false,
  }) async {
    if (!isEnable) {
      return;
    }

    if (showLogs) {
      print('SkyAnalytics send: $params');
    }

    try {
      final uri = Uri.parse(host).replace(path: '/send');

      String operatingSystem = Platform.operatingSystem;
      String operatingSystemVersion = Platform.operatingSystemVersion;

      final userAgent =
          '($operatingSystem $operatingSystemVersion) ${client.userAgent}';

      HttpClientRequest request = await client.postUrl(uri);

      request.headers.set('User-Agent', userAgent);
      request.headers.set('X-SkyAnalytics-Key', sourceKey);

      cookieManager.setCookies(request);

      if (formData) {
        final boundary = '----SkyAnalyticsBoundary${DateTime.now().millisecondsSinceEpoch}';
        request.headers.set(HttpHeaders.contentTypeHeader, 'multipart/form-data; boundary=$boundary');

        final buffer = StringBuffer();
        final List<int> bodyBytes = [];

        for (var entry in params.entries) {
          if (entry.value is File) {
            File file = entry.value;
            final fileBytes = await file.readAsBytes();
            final fileName = file.path.split('/').last;

            buffer.writeln('--$boundary');
            buffer.writeln('Content-Disposition: form-data; name="${entry.key}"; filename="$fileName"');
            buffer.writeln('Content-Type: application/octet-stream');
            buffer.writeln();

            bodyBytes.addAll(utf8.encode(buffer.toString()));
            bodyBytes.addAll(fileBytes);
            bodyBytes.addAll(utf8.encode('\r\n'));
            buffer.clear();
          } else {
            buffer.writeln('--$boundary');
            buffer.writeln('Content-Disposition: form-data; name="${entry.key}"');
            buffer.writeln();
            buffer.writeln(entry.value);
          }
        }

        buffer.writeln('--$boundary--');
        bodyBytes.addAll(utf8.encode(buffer.toString()));

        request.add(bodyBytes);
      } else {
        request.headers.set('Content-Type', 'application/json');
        request.write(json.encode(params));
      }

      final response = await request.close();
      await response.transform(utf8.decoder).join();

      cookieManager.updateCookies(response);
    } catch (e) {
      if (kDebugMode) {
        print('Error: $e');
      }
    }
  }

  /// Disposes the [SkyAnalytics] instance.
  void dispose() {
    client.close(force: true);
    cookieManager.clearCookies();
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
