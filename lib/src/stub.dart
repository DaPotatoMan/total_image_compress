import 'package:fast_image_compress/src/core.dart';

class FastCompress extends FastCompressBase {
  FastCompress({super.format, super.maxHeight, super.quality}) {
    throw UnimplementedError();
  }

  @override
  process(source) => throw UnimplementedError();
}
