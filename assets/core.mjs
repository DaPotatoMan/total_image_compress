export const log = console.log.bind(null, '[fast_image_compress]')

export class ImageUtil {
  /**
   * Converts an image URL to a Base64 string.
   * @param {string} url - The URL of the image.
   * @param {RequestInit} [init] - Optional fetch initialization options.
   * @returns {Promise<string>} A promise that resolves to the Base64 string.
   */
  static async toBase64(url, init) {
    const response = await fetch(url, init);
    const blob = await response.blob();

    if (!response.ok) {
      throw new Error('Failed to load image');
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;

        if (typeof base64data === 'string') {
          resolve(base64data);
        } else {
          throw new Error('Null parsing image');
        }
      };
    });
  }


  /**
   * Resizes an image.
   * @param {ImageBitmapSource} source - The image source file.
   * @param {Object} [options] - The resize options.
   * @param {ImageBitmap|null} [options.image=null] - An optional preloaded image.
   * @param {number} [options.maxHeight] - The target height (calculated if null).
   * @param {number|null} [options.step=0.5] - The step size for resizing.
   * @param {string} [options.type='image/jpeg'] - The MIME type of the output image.
   * @param {number} [options.quality=1] - The quality of the output image (0 to 1).
   * @returns {Promise<Blob>} A promise that resolves to the resized image as a Blob.
   */
  static async resize(source, {
    image = null,
    maxHeight = Number.POSITIVE_INFINITY,
    step = 0.5,
    type = 'image/jpeg',
    quality = 1
  } = {}) {
    image ??= await self.createImageBitmap(source);

    const height = Math.min(image.height, maxHeight);
    const width = Math.floor(height * (image.width / image.height));

    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');

    log('resizing image:', {
      width, height,
      image: { width: image.width, height: image.height }
    });

    if (image.width * step > width) {
      const multiplier = 1 / step;

      let size = {
        width: Math.floor(image.width * step),
        height: Math.floor(image.height * step)
      };

      const drawer = new OffscreenCanvas(size.width, size.height);
      const dctx = drawer.getContext('2d');
      dctx.drawImage(image, 0, 0, size.width, size.height);

      while (size.width * step > width) {
        size = {
          width: Math.floor(size.width * step),
          height: Math.floor(size.height * step)
        };

        const source = await createImageBitmap(drawer);
        dctx.clearRect(0, 0, drawer.width, drawer.height);
        dctx.drawImage(source, 0, 0, size.width * multiplier, size.height * multiplier, 0, 0, size.width, size.height);
      }

      ctx.drawImage(drawer, 0, 0, size.width, size.height, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    }


    // Cleanup
    image.close()

    return canvas.convertToBlob({ type, quality });
  }
}
