import 'dart:io';

import 'package:fast_image_compress/fast_image_compress.dart';
import 'package:flutter_test/flutter_test.dart';

void main() async {
  final input = await File('test/assets/source.jpg').readAsBytes();

  test('can compress: JPG', () async {
    final output = await FastCompress(maxHeight: 1080, quality: 70).process(input);
    expect(output.length < input.length, true);
  });

  test('can compress: PNG', () async {
    final output = await FastCompress(maxHeight: 1080, quality: 70, format: ImageFormat.png).process(input);
    expect(output.isNotEmpty, true);
  });
}
