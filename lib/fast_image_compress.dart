export 'package:fast_image_compress/src/core.dart' show ImageFormat;

export 'src/stub.dart' if (dart.library.io) 'src/vm.dart' if (dart.library.js_interop) 'src/web.dart';
