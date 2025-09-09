import { compressImage } from '@/lib/imageCompression/compressImage'

import { uploadImage } from './uploadImage'
import { validateImage } from './validateImage'

jest.mock('./validateImage')
jest.mock('@/lib/imageCompression/compressImage')

// Mock fetch globally
global.fetch = jest.fn()

describe('uploadImage', () => {
  const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
  const mockUserId = 'user123'
  const mockRecipeId = 'recipe123'

  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockReset()
  })

  it('should upload image successfully', async () => {
    const mockCompressedFile = new Blob(['compressed'], { type: 'image/webp' })
    const mockUrl = 'https://example.com/image.webp'

    ;(validateImage as jest.Mock).mockReturnValue(null)
    ;(compressImage as jest.Mock).mockResolvedValue(mockCompressedFile)
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ url: mockUrl }),
    })

    const result = await uploadImage(mockFile, mockUserId, mockRecipeId)

    expect(validateImage).toHaveBeenCalledWith(mockFile)
    expect(compressImage).toHaveBeenCalledWith(mockFile)
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/upload-image',
      expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData),
      }),
    )
    expect(result).toEqual({ url: mockUrl })
  })

  it('should return error when validation fails', async () => {
    const mockError = 'Invalid file type'
    ;(validateImage as jest.Mock).mockReturnValue(mockError)

    const result = await uploadImage(mockFile, mockUserId, mockRecipeId)

    expect(validateImage).toHaveBeenCalledWith(mockFile)
    expect(compressImage).not.toHaveBeenCalled()
    expect(global.fetch).not.toHaveBeenCalled()
    expect(result).toEqual({ url: '', error: mockError })
  })

  it('should return error when compressed image is too large', async () => {
    const largeBlob = new Blob(['x'.repeat(3 * 1024 * 1024)], {
      type: 'image/webp',
    })

    ;(validateImage as jest.Mock).mockReturnValue(null)
    ;(compressImage as jest.Mock).mockResolvedValue(largeBlob)

    const result = await uploadImage(mockFile, mockUserId, mockRecipeId)

    expect(result).toEqual({
      url: '',
      error: 'Unable to compress image below 2MB',
    })
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('should handle upload failure', async () => {
    const mockCompressedFile = new Blob(['compressed'], { type: 'image/webp' })

    ;(validateImage as jest.Mock).mockReturnValue(null)
    ;(compressImage as jest.Mock).mockResolvedValue(mockCompressedFile)
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Upload failed' }),
    })

    const result = await uploadImage(mockFile, mockUserId, mockRecipeId)

    expect(result).toEqual({ url: '', error: 'Upload failed' })
  })

  it('should handle network errors', async () => {
    const mockCompressedFile = new Blob(['compressed'], { type: 'image/webp' })

    ;(validateImage as jest.Mock).mockReturnValue(null)
    ;(compressImage as jest.Mock).mockResolvedValue(mockCompressedFile)
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

    const result = await uploadImage(mockFile, mockUserId, mockRecipeId)

    expect(result).toEqual({ url: '', error: 'Network error' })
  })

  it('should handle compression errors', async () => {
    ;(validateImage as jest.Mock).mockReturnValue(null)
    ;(compressImage as jest.Mock).mockRejectedValue(
      new Error('Compression failed'),
    )

    const result = await uploadImage(mockFile, mockUserId, mockRecipeId)

    expect(result).toEqual({ url: '', error: 'Compression failed' })
  })

  it('should handle non-Error exceptions', async () => {
    ;(validateImage as jest.Mock).mockReturnValue(null)
    ;(compressImage as jest.Mock).mockRejectedValue('Unknown error')

    const result = await uploadImage(mockFile, mockUserId, mockRecipeId)

    expect(result).toEqual({ url: '', error: 'Failed to process image' })
  })

  it('should send correct FormData to API', async () => {
    const mockCompressedFile = new Blob(['compressed'], { type: 'image/webp' })

    ;(validateImage as jest.Mock).mockReturnValue(null)
    ;(compressImage as jest.Mock).mockResolvedValue(mockCompressedFile)

    let capturedFormData: FormData | null = null
    ;(global.fetch as jest.Mock).mockImplementation((url, options) => {
      capturedFormData = options.body as FormData
      return Promise.resolve({
        ok: true,
        json: async () => ({ url: 'test-url' }),
      })
    })

    await uploadImage(mockFile, mockUserId, mockRecipeId)

    expect(capturedFormData).toBeInstanceOf(FormData)
  })
})
