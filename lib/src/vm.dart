import 'package:image/image.dart' deferred as image;
import 'package:total_image_compress/src/core.dart';

class TotalCompress extends TotalCompressBase {
  TotalCompress({super.format, super.maxHeight, super.quality});

  @override
  process(source) async {
    await image.loadLibrary();

    final decoder = await (image.Command()..decodeImage(source)).executeThread();
    final input = await decoder.getImageThread();

    if (input == null) throw Exception('Failed to decode base image');

    final cmd = image.Command()..image(input);

    // Resize
    if (maxHeight != null && input.height > maxHeight!) cmd.copyResize(height: maxHeight, maintainAspect: true);

    // Convert to format
    switch (format) {
      case ImageFormat.jpg:
        cmd.encodeJpg(quality: quality);

      default:
        cmd.encodePng();
    }

    await cmd.executeThread();
    final result = await cmd.getBytesThread();

    if (result == null) throw Exception('Failed to convert image');
    return result;
  }
}
