library skyanalytics_flutter;

import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';

part 'skyanalytics_navigator_observer.dart';

class SkyAnalytics {
  final String sourceKey;
  final String host;

  const SkyAnalytics({
    required this.sourceKey,
    required this.host,
  });

  Future<void> event({
    required String name,
    Map<String, dynamic>? parameters,
  }) async {
    await _send({
      'event': name,
    });
  }

  Future<void> navigate({
    required String screenName,
  }) async {
    await _send({
      'navigation': screenName,
    });
  }

  Future<void> _send(Map<String, dynamic> params) async {
    try {
      HttpClient client = HttpClient();

      final uri = Uri.parse(host).replace(path: '/send');

      String operatingSystem = Platform.operatingSystem;
      String operatingSystemVersion = Platform.operatingSystemVersion;

      final userAgent =
          '($operatingSystem $operatingSystemVersion) ${client.userAgent}';

      HttpClientRequest request = await client.postUrl(uri);

      request.headers.set('User-Agent', userAgent);
      request.headers.set('Content-Type', 'application/json');
      request.headers.set('X-SkyAnalytics-Key', sourceKey);

      request.write(json.encode(params));

      await request.close();
      client.close();
    } catch (e) {
      if (kDebugMode) {
        print('Error: $e');
      }
    }
  }
}
