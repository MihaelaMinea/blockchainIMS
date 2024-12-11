
import 'dart:convert';
import 'package:http/http.dart' as http;

class HttpService {
  final String baseUrl = 'http://10.0.2.2:3000';

  Future<http.Response> sendQRCode(
      String itemId, String itemName, String qrCodeBase64) async {
    final url = Uri.parse('$baseUrl/api/mobile/history'); // Adjust endpoint as needed
    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: json.encode({
          'itemId': itemId,
          'itemName': itemName,
          'qrCode': qrCodeBase64,
        }),
      );

      return response;
    } catch (e) {
      print('Error sending data: $e');
      rethrow; // Rethrow error to handle it in the calling method.
    }
  }
}
