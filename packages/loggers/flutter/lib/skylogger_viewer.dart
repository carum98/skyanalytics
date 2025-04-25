import 'package:flutter/material.dart';

import 'skylogger.dart';

class SkyLoggerViewer extends StatelessWidget {
  const SkyLoggerViewer({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Logs')),
      body: FutureBuilder(
        future: LoggerReader.folders(),
        builder: (_, snapshot) {
          if (!snapshot.hasData) return const SizedBox();
          final folders = snapshot.data!;

          if (folders.isEmpty) {
            return const Center(child: Text('No logs available'));
          }

          return _Grid(
            items: folders,
            onTap: (item) => _LogsPage(folder: item),
          );
        },
      ),
    );
  }
}

// Logs

class _LogsPage extends StatelessWidget {
  final String folder;

  const _LogsPage({required this.folder});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(folder)),
      body: FutureBuilder(
        future: LoggerReader.logs(folder),
        builder: (_, snapshot) {
          if (!snapshot.hasData) return const SizedBox();
          final logs = snapshot.data!;

          return _Grid(
            items: logs,
            onTap: (item) => _LogPage(folder: folder, log: item),
          );
        },
      ),
    );
  }
}

// Log Content

class _LogPage extends StatelessWidget {
  final String folder;
  final String log;

  const _LogPage({
    required this.folder,
    required this.log,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(log)),
      body: FutureBuilder(
        future: LoggerReader.readLog(folder, log),
        builder: (_, snapshot) {
          if (!snapshot.hasData) return const SizedBox();
          final log = snapshot.data!;

          return SingleChildScrollView(
            reverse: true,
            padding: const EdgeInsets.all(20),
            child: Text(log),
          );
        },
      ),
    );
  }
}

// Utils

class _Grid<T> extends StatelessWidget {
  final List<T> items;
  final Widget Function(T) onTap;

  const _Grid({
    super.key,
    required this.items,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      crossAxisCount: 2,
      childAspectRatio: (2 / 1),
      padding: const EdgeInsets.all(20),
      mainAxisSpacing: 20,
      crossAxisSpacing: 20,
      children: items.map((item) {
        return Ink(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(10),
          ),
          child: InkWell(
            onTap: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => onTap(item)),
              );
            },
            child: Center(
              child:
                  Text(item.toString(), style: const TextStyle(fontSize: 15)),
            ),
          ),
        );
      }).toList(),
    );
  }
}
