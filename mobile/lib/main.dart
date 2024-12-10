//
// import 'dart:convert';
// import 'package:flutter/material.dart';
// import 'package:flutter/services.dart';
// import 'http_service.dart'; // Import the HTTP service
//
// void main() {
//   runApp(MyApp());
// }
//
// class MyApp extends StatelessWidget {
//   const MyApp({super.key});
//
//   @override
//   Widget build(BuildContext context) {
//     return MaterialApp(
//       home: QRCodeScreen(),
//     );
//   }
// }
//
// class QRCodeScreen extends StatefulWidget {
//   const QRCodeScreen({super.key});
//
//   @override
//   _QRCodeScreenState createState() => _QRCodeScreenState();
// }
//
// class _QRCodeScreenState extends State<QRCodeScreen> {
//   List<Map<String, dynamic>> qrCodes = [];
//   final HttpService httpService = HttpService(); // Initialize HttpService
//
//   @override
//   void initState() {
//     super.initState();
//     loadQRData();
//   }
//
//   void loadQRData() async {
//     try {
//       final jsonString = await rootBundle.loadString('assets/qrcodes.txt');
//       final jsonData = json.decode(jsonString) as List<dynamic>;
//       setState(() {
//         qrCodes = jsonData.map((e) => e as Map<String, dynamic>).toList();
//       });
//     } catch (e) {
//       print('Error loading QR data: $e');
//     }
//   }
//
//   @override
//   Widget build(BuildContext context) {
//     return Scaffold(
//       appBar: AppBar(title: const Text('QR Code Reader')),
//       body: qrCodes.isEmpty
//           ? const Center(child: CircularProgressIndicator())
//           : ListView.builder(
//         itemCount: qrCodes.length,
//         itemBuilder: (context, index) {
//           final item = qrCodes[index];
//           final String itemId = item['itemId'] ?? 'Unknown ID';
//           final String itemName = item['itemName'] ?? 'Unknown Name';
//           final String qrCodeBase64 = item['qrCodeBase64'] ?? '';
//
//           // Shorten the ID dynamically if it's too long
//           final String shortItemId = itemId.length > 10
//               ? '${itemId.substring(0, 5)}...${itemId.substring(itemId.length - 5)}'
//               : itemId;
//
//           return Padding(
//             padding: const EdgeInsets.symmetric(vertical: 8.0, horizontal: 16.0),
//             child: Card(
//               elevation: 4.0,
//               child: ListTile(
//                 title: Text(
//                   'QR Code ${index + 1}',
//                   style: const TextStyle(fontWeight: FontWeight.bold),
//                 ),
//                 subtitle: Column(
//                   crossAxisAlignment: CrossAxisAlignment.start,
//                   children: [
//                     Text(
//                       'ID: $shortItemId',
//                       style: TextStyle(color: Colors.grey[700]),
//                     ),
//                     Text(
//                       'Name: $itemName',
//                       style: TextStyle(color: Colors.grey[700]),
//                     ),
//                     const SizedBox(height: 10),
//                     qrCodeBase64.isNotEmpty
//                         ? Row(
//                       children: [
//                         // Image section
//                         Image.memory(
//                           base64Decode(qrCodeBase64.split(',').last.trim()),
//                           height: 150,
//                           fit: BoxFit.contain,
//                         ),
//                         const SizedBox(width: 10),
//                         // Button section (to the right of the image)
//                         ElevatedButton(
//                           onPressed: () async {
//                             print('Sending QR code for item $itemId');
//                             await httpService.sendQRCode(itemId, itemName,qrCodeBase64);
//                           },
//                           child: const Text('Item History'),
//                         ),
//                       ],
//                     )
//                         : const Text('QR Code image missing'),
//                     const SizedBox(height: 10),
//                   ],
//                 ),
//                 isThreeLine: true,
//               ),
//             ),
//           );
//         },
//       ),
//     );
//   }
// }


import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'http_service.dart';
import 'qr_display_screen.dart'; // Import the QRDisplayScreen

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: const QRCodeScreen(),
    );
  }
}

class QRCodeScreen extends StatefulWidget {
  const QRCodeScreen({super.key});

  @override
  _QRCodeScreenState createState() => _QRCodeScreenState();
}

class _QRCodeScreenState extends State<QRCodeScreen> {
  List<Map<String, dynamic>> qrCodes = [];
  final HttpService httpService = HttpService();

  @override
  void initState() {
    super.initState();
    loadQRData();
  }

  void loadQRData() async {
    try {
      final jsonString = await rootBundle.loadString('assets/qrcodes.txt');
      final jsonData = json.decode(jsonString) as List<dynamic>;
      setState(() {
        qrCodes = jsonData.map((e) => e as Map<String, dynamic>).toList();
      });
    } catch (e) {
      print('Error loading QR data: $e');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('QR Code Reader')),
      body: qrCodes.isEmpty
          ? const Center(child: CircularProgressIndicator())
          : ListView.builder(
        itemCount: qrCodes.length,
        itemBuilder: (context, index) {
          final item = qrCodes[index];
          final String itemId = item['itemId'] ?? 'Unknown ID';
          final String itemName = item['itemName'] ?? 'Unknown Name';
          final String qrCodeBase64 = item['qrCodeBase64'] ?? '';

          final String shortItemId = itemId.length > 10
              ? '${itemId.substring(0, 5)}...${itemId.substring(itemId.length - 5)}'
              : itemId;

          return Padding(
            padding: const EdgeInsets.symmetric(
                vertical: 8.0, horizontal: 16.0),
            child: Card(
              elevation: 4.0,
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // QR code image
                    if (qrCodeBase64.isNotEmpty)
                      Image.memory(
                        base64Decode(
                            qrCodeBase64.split(',').last.trim()),
                        height: 100,
                        width: 100,
                        fit: BoxFit.contain,
                      )
                    else
                      const SizedBox(
                        height: 100,
                        width: 100,
                        child: Center(
                          child: Text(
                            'No QR\nImage',
                            textAlign: TextAlign.center,
                            style: TextStyle(color: Colors.grey),
                          ),
                        ),
                      ),
                    const SizedBox(width: 16),
                    // Details and button
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'QR Code ${index + 1}',
                            style: const TextStyle(
                                fontWeight: FontWeight.bold),
                          ),
                          Text(
                            'ID: $shortItemId',
                            style:
                            TextStyle(color: Colors.grey[700]),
                          ),
                          Text(
                            'Name: $itemName',
                            style:
                            TextStyle(color: Colors.grey[700]),
                          ),
                          const SizedBox(height: 10),
                          ElevatedButton(
                            onPressed: () async {
                              try {
                                final response = await httpService
                                    .sendQRCode(itemId, itemName,
                                    qrCodeBase64);

                                if (response.statusCode == 200) {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) =>
                                          QRDisplayScreen(
                                            responseBody: response.body,
                                          ),
                                    ),
                                  );
                                } else {
                                  print(
                                      'Failed to fetch history: ${response.body}');
                                }
                              } catch (e) {
                                print('Error fetching history: $e');
                              }
                            },
                            child: const Text('Item History'),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
