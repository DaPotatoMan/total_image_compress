import { ImageUtil, log } from './core.mjs'

onmessage = (event) => {
  /**
   * @typedef {Object} Message
   * @property {String} type - MIME type of the image
   * @property {number} [quality=1] - Quality of the image (0 to 1)
   * @property {number|null} maxHeight - Maximum height for resizing
   * @property {Uint8Array} data 
   */

  /** @type {Message} */
  const { type, data, maxHeight, quality } = event.data
  const ALLOWED_TYPES = ['image/png', 'image/jpeg']

  log('got message data', event.data)

  if (!ALLOWED_TYPES.some(e => e === type))
    throw new Error(`Provided format type [${type}] is not yet supported`)

  if (data instanceof Uint8Array === false)
    throw new Error(`Provided data type (${typeof data}) is not Uint8Array`)

  log('compress process started')
  const result = ImageUtil.resize(new Blob([data]), {
    maxHeight,
    quality,
    type: type || 'image/jpeg',
  })

  result.then(async (blob) => {
    const bytes = new Uint8Array(await blob.arrayBuffer())
    postMessage(bytes, [bytes.buffer])
    log('success')
  })
}

log('init')
