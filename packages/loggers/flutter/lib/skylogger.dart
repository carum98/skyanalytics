import 'dart:io';

import 'package:archive/archive.dart';
import 'package:flutter/foundation.dart';
import 'package:path_provider/path_provider.dart';

enum LogLevel { debug, info, warning, error }

/// Logger class to write logs to the file system
///
/// Logs are stored in the `logger` directory in the app's documents directory
///
/// Logs are stored in files with the format `yyyy-mm-dd.log`, one file per day.
///
/// By default, logs are stored in the `others` folder, but you can specify a module
/// to store logs in a specific folder.
///
class SkyLogger {
  /// Debugging logs
  ///
  static Future<void> debug(
    String message, {
    String? folder,
  }) {
    return _writeLog(LogLevel.debug, message, folder: folder);
  }

  /// Error logs
  ///
  static Future<void> error(
    String message, {
    String folder = 'others',
    Object? error,
    StackTrace? stackTrace,
  }) {
    return _writeLog(
      LogLevel.error,
      message,
      folder: folder,
      error: error,
      stackTrace: stackTrace,
    );
  }

  /// Clear all logs older than 7 days
  ///
  static Future<void> clearLogs() async {
    try {
      final directory = await getApplicationDocumentsDirectory();
      final logDirectory = Directory('${directory.path}/logger');

      if (!await logDirectory.exists()) {
        return;
      }

      final modules = await logDirectory.list().toList();

      for (final module in modules) {
        final files = await (module as Directory).list().toList();
        final lastWeek = DateTime.now().subtract(const Duration(days: 7));

        for (final file in files) {
          final date = file.path.split('/').last.split('.').first;
          final fileDate = DateTime.parse(date);

          if (fileDate.isBefore(lastWeek)) {
            await file.delete();
          }
        }
      }
    } catch (e) {
      if (kDebugMode) {
        print('[Logger] Error clearing logs: $e');
      }
    }
  }

  /// Write logs to the file system and print to the console in debug mode
  ///
  static Future<void> _writeLog(
    LogLevel level,
    String message, {
    String? folder = 'others',
    Object? error,
    StackTrace? stackTrace,
  }) async {
    try {
      final logFile = await _getLogFile(
        folder!,
      );

      final logMessage = _formatLog(
        level,
        folder,
        message,
        error: error,
        stackTrace: stackTrace,
      );
      await logFile.writeAsString(logMessage, mode: FileMode.append);

      if (kDebugMode) {
        print('[Logger] $logMessage');
      }
    } catch (e) {
      if (kDebugMode) {
        print('[Logger] Error writing log: $e');
      }
    }
  }

  /// Get a [File] object to write logs
  ///
  /// It creates a directory or file if it doesn't exist
  ///
  /// File name format: `yyyy-mm-dd.log`
  ///
  static Future<File> _getLogFile(String folder) async {
    final directory = await getApplicationDocumentsDirectory();
    final date = DateTime.now().toIso8601String().split('T').first;

    final filePath = '${directory.path}/logger/$folder/$date.log';
    return File(filePath).create(recursive: true);
  }

  /// Format the log message to be written to the file
  ///
  static String _formatLog(
    LogLevel level,
    String folder,
    String message, {
    Object? error,
    StackTrace? stackTrace,
  }) {
    final logMessage = error != null ? '$message\n$error' : message;
    final logStackTrace = stackTrace != null ? '$stackTrace' : '';
    final logDate = DateTime.now().toUtc().toIso8601String();
    return '[$logDate] [${level.name}] [$folder] $logMessage\n$logStackTrace\n';
  }
}

/// Read logs from the file system
///
class LoggerReader {
  /// Get all modules folders in the logger directory
  ///
  static Future<List<String>> folders() async {
    final directory = await _directory('');
    final modules = await directory.list().toList();

    return modules.map((e) {
      return e.path.split('/').last;
    }).toList();
  }

  /// Get all log files names in a module folder
  ///
  static Future<List<String>> logs(String folder) async {
    final directory = await _directory('/$folder');
    final files = await directory.list().toList();

    return files.map((file) => file.path.split('/').last).toList();
  }

  /// Read a log file content
  ///
  static Future<String> readLog(String folder, String name) async {
    final directory = await getApplicationDocumentsDirectory();
    final filePath = '${directory.path}/logger/$folder/$name';
    final file = File(filePath);

    return file.readAsString();
  }

  /// Get the directory path of the logger
  static Future<Directory> _directory(String path) async {
    final directory = await getApplicationDocumentsDirectory();
    return Directory('${directory.path}/logger$path');
  }

  /// Generate Zip file of logs
  ///
  static Future<File> zipLogs() async {
    final directory = await getApplicationDocumentsDirectory();
    final loggerDirectory = Directory('${directory.path}/logger');
    final zipFile = File('${directory.path}/logs.zip');

    if (await zipFile.exists()) {
      await zipFile.delete();
    }

    final archive = Archive();

    for (var file in loggerDirectory.listSync(recursive: true)) {
      if (file is File) {
        final bytes = file.readAsBytesSync();
        final relativePath = file.path.replaceFirst('${directory.path}/', '');
        archive.addFile(ArchiveFile(relativePath, bytes.length, bytes));
      }
    }

    final zipBytes = ZipEncoder().encode(archive);
    return zipFile.writeAsBytes(zipBytes);
  }
}
