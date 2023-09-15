import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class WebViewApp extends StatefulWidget {
  const WebViewApp({super.key});

  @override
  State<WebViewApp> createState() => _WebViewAppState();
}

class _WebViewAppState extends State<WebViewApp> {
  // initialize webview controller
  // disable javascript enhance security of the app by reducing the risk of malicious script executed
  // within the webview
  // In order to work considering local application:
  // https://stackoverflow.com/questions/55592392/how-to-fix-neterr-cleartext-not-permitted-in-flutter
  final webViewController = WebViewController()
    ..setJavaScriptMode(JavaScriptMode.unrestricted)
    ..loadRequest(Uri.parse('URL OF THE APP'));

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Center(
          child:
              Text('Anne\'s Note App', style: TextStyle(fontFamily: 'Ubuntu')),
        ),
      ),
      body: WebViewWidget(controller: webViewController),
    );
  }
}
