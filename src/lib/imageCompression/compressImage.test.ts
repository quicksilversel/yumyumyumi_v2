import imageCompression from 'browser-image-compression'

import { compressImage } from './compressImage'

jest.mock('browser-image-compression')

describe('compressImage', () => {
  const mockFile = new File(['test content'], 'test.jpg', {
    type: 'image/jpeg',
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should compress image successfully with default config', async () => {
    const mockCompressedBlob = new Blob(['compressed'], { type: 'image/webp' })
    Object.defineProperty(mockCompressedBlob, 'size', { value: 1024 * 1024 }) // 1MB
    ;(imageCompression as unknown as jest.Mock).mockResolvedValue(
      mockCompressedBlob,
    )

    const result = await compressImage(mockFile)

    expect(imageCompression).toHaveBeenCalledTimes(1)
    expect(imageCompression).toHaveBeenCalledWith(mockFile, {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp',
    })
    expect(result).toBe(mockCompressedBlob)
  })

  it('should apply aggressive compression when default compression exceeds size limit', async () => {
    const largeMockBlob = new Blob(['large compressed'], { type: 'image/webp' })
    Object.defineProperty(largeMockBlob, 'size', { value: 3 * 1024 * 1024 }) // 3MB

    const smallMockBlob = new Blob(['small compressed'], { type: 'image/webp' })
    Object.defineProperty(smallMockBlob, 'size', { value: 1 * 1024 * 1024 }) // 1MB
    ;(imageCompression as unknown as jest.Mock)
      .mockResolvedValueOnce(largeMockBlob)
      .mockResolvedValueOnce(smallMockBlob)

    const result = await compressImage(mockFile)

    expect(imageCompression).toHaveBeenCalledTimes(2)

    expect(imageCompression).toHaveBeenNthCalledWith(1, mockFile, {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: 'image/webp',
    })

    expect(imageCompression).toHaveBeenNthCalledWith(2, mockFile, {
      maxSizeMB: 1.5,
      maxWidthOrHeight: 1280,
      useWebWorker: true,
      fileType: 'image/webp',
      quality: 0.8,
    })

    expect(result).toBe(smallMockBlob)
  })

  it('should return file at exactly 2MB without aggressive compression', async () => {
    const exactSizeBlob = new Blob(['exact size'], { type: 'image/webp' })
    Object.defineProperty(exactSizeBlob, 'size', { value: 2 * 1024 * 1024 }) // 2MB
    ;(imageCompression as unknown as jest.Mock).mockResolvedValue(exactSizeBlob)

    const result = await compressImage(mockFile)

    expect(imageCompression).toHaveBeenCalledTimes(1)
    expect(result).toBe(exactSizeBlob)
  })

  it('should throw error when compression fails', async () => {
    const originalError = new Error('Compression library error')
    ;(imageCompression as unknown as jest.Mock).mockRejectedValue(originalError)

    await expect(compressImage(mockFile)).rejects.toThrow(
      'Failed to compress image',
    )

    expect(imageCompression).toHaveBeenCalledTimes(1)
  })

  it('should throw error when aggressive compression also fails', async () => {
    const largeMockBlob = new Blob(['large compressed'], { type: 'image/webp' })
    Object.defineProperty(largeMockBlob, 'size', { value: 3 * 1024 * 1024 }) // 3MB
    ;(imageCompression as unknown as jest.Mock)
      .mockResolvedValueOnce(largeMockBlob)
      .mockRejectedValueOnce(new Error('Aggressive compression failed'))

    await expect(compressImage(mockFile)).rejects.toThrow(
      'Failed to compress image',
    )

    expect(imageCompression).toHaveBeenCalledTimes(2)
  })

  it('should handle different file types', async () => {
    const pngFile = new File(['png content'], 'test.png', {
      type: 'image/png',
    })

    const mockCompressedBlob = new Blob(['compressed'], { type: 'image/webp' })
    Object.defineProperty(mockCompressedBlob, 'size', { value: 500 * 1024 }) // 500KB
    ;(imageCompression as unknown as jest.Mock).mockResolvedValue(
      mockCompressedBlob,
    )

    const result = await compressImage(pngFile)

    expect(imageCompression).toHaveBeenCalledWith(pngFile, expect.any(Object))
    expect(result).toBe(mockCompressedBlob)
  })

  it('should convert all images to WebP format', async () => {
    const jpegFile = new File(['jpeg content'], 'test.jpg', {
      type: 'image/jpeg',
    })

    const webpBlob = new Blob(['webp content'], { type: 'image/webp' })
    Object.defineProperty(webpBlob, 'size', { value: 800 * 1024 }) // 800KB
    ;(imageCompression as unknown as jest.Mock).mockResolvedValue(webpBlob)

    const result = await compressImage(jpegFile)

    expect(imageCompression).toHaveBeenCalledWith(
      jpegFile,
      expect.objectContaining({
        fileType: 'image/webp',
      }),
    )
    expect(result.type).toBe('image/webp')
  })

  it('should use web worker for compression', async () => {
    const mockCompressedBlob = new Blob(['compressed'], { type: 'image/webp' })
    Object.defineProperty(mockCompressedBlob, 'size', { value: 1024 * 1024 }) // 1MB
    ;(imageCompression as unknown as jest.Mock).mockResolvedValue(
      mockCompressedBlob,
    )

    await compressImage(mockFile)

    expect(imageCompression).toHaveBeenCalledWith(
      mockFile,
      expect.objectContaining({
        useWebWorker: true,
      }),
    )
  })

  it('should handle very small files', async () => {
    const tinyFile = new File(['tiny'], 'tiny.jpg', {
      type: 'image/jpeg',
    })
    Object.defineProperty(tinyFile, 'size', { value: 1024 }) // 1KB

    const tinyCompressedBlob = new Blob(['tiny compressed'], {
      type: 'image/webp',
    })
    Object.defineProperty(tinyCompressedBlob, 'size', { value: 512 }) // 512 bytes
    ;(imageCompression as unknown as jest.Mock).mockResolvedValue(
      tinyCompressedBlob,
    )

    const result = await compressImage(tinyFile)

    expect(imageCompression).toHaveBeenCalledTimes(1)
    expect(result).toBe(tinyCompressedBlob)
  })

  it('should handle non-Error exceptions from image compression library', async () => {
    ;(imageCompression as unknown as jest.Mock).mockRejectedValue(
      'String error',
    )

    await expect(compressImage(mockFile)).rejects.toThrow(
      'Failed to compress image',
    )
  })

  it('should return larger file if aggressive compression still exceeds limit', async () => {
    const largeMockBlob1 = new Blob(['large compressed 1'], {
      type: 'image/webp',
    })
    Object.defineProperty(largeMockBlob1, 'size', { value: 3 * 1024 * 1024 }) // 3MB

    const largeMockBlob2 = new Blob(['large compressed 2'], {
      type: 'image/webp',
    })
    Object.defineProperty(largeMockBlob2, 'size', { value: 2.5 * 1024 * 1024 }) // 2.5MB
    ;(imageCompression as unknown as jest.Mock)
      .mockResolvedValueOnce(largeMockBlob1)
      .mockResolvedValueOnce(largeMockBlob2)

    const result = await compressImage(mockFile)

    expect(imageCompression).toHaveBeenCalledTimes(2)
    expect(result).toBe(largeMockBlob2)
  })
})
