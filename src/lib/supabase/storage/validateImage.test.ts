import { validateImage } from './validateImage'

describe('validateImage', () => {
  it('should return null for valid image file', () => {
    const validFile = new File(['content'], 'test.jpg', {
      type: 'image/jpeg',
    })
    Object.defineProperty(validFile, 'size', { value: 1024 * 1024 }) // 1MB

    const result = validateImage(validFile)

    expect(result).toBeNull()
  })

  it('should return null for null file', () => {
    const result = validateImage(null)

    expect(result).toBeNull()
  })

  it('should return error for non-image file', () => {
    const textFile = new File(['content'], 'document.txt', {
      type: 'text/plain',
    })

    const result = validateImage(textFile)

    expect(result).toBe('Please select an image file')
  })

  it('should return error for file exceeding max size', () => {
    const largeFile = new File(['content'], 'large.jpg', {
      type: 'image/jpeg',
    })
    Object.defineProperty(largeFile, 'size', { value: 5 * 1024 * 1024 })

    const result = validateImage(largeFile)

    expect(result).toBe('Image size must be less than 4.00MB')
  })

  it('should accept file at exactly max size', () => {
    const maxSizeFile = new File(['content'], 'max.jpg', {
      type: 'image/jpeg',
    })
    Object.defineProperty(maxSizeFile, 'size', { value: 4 * 1024 * 1024 })

    const result = validateImage(maxSizeFile)

    expect(result).toBeNull()
  })

  it('should accept various image mime types', () => {
    const imageTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'image/bmp',
    ]

    imageTypes.forEach((type) => {
      const file = new File(['content'], 'test', { type })
      Object.defineProperty(file, 'size', { value: 1024 }) // 1KB

      const result = validateImage(file)
      expect(result).toBeNull()
    })
  })

  it('should reject non-image mime types', () => {
    const nonImageTypes = [
      'application/pdf',
      'text/html',
      'video/mp4',
      'audio/mpeg',
      'application/json',
    ]

    nonImageTypes.forEach((type) => {
      const file = new File(['content'], 'test', { type })
      Object.defineProperty(file, 'size', { value: 1024 }) // 1KB

      const result = validateImage(file)
      expect(result).toBe('Please select an image file')
    })
  })

  it('should handle edge case file sizes', () => {
    const testCases = [
      { size: 0, expected: null },
      { size: 1, expected: null },
      { size: 4 * 1024 * 1024 - 1, expected: null },
      { size: 4 * 1024 * 1024, expected: null },
      {
        size: 4 * 1024 * 1024 + 1,
        expected: 'Image size must be less than 4.00MB',
      },
    ]

    testCases.forEach(({ size, expected }) => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: size })

      const result = validateImage(file)
      expect(result).toBe(expected)
    })
  })

  it('should format file sizes correctly', () => {
    const testSizes = [
      { size: 5.5 * 1024 * 1024 },
      { size: 10 * 1024 * 1024 },
      { size: 4.123456 * 1024 * 1024 },
    ]

    testSizes.forEach(({ size }) => {
      const file = new File([''], 'test.jpg', { type: 'image/jpeg' })
      Object.defineProperty(file, 'size', { value: Math.floor(size) })

      const result = validateImage(file)
      expect(result).toBe('Image size must be less than 4.00MB')
    })
  })

  it('should handle files without type property', () => {
    const file = new File(['content'], 'test.jpg', {})
    Object.defineProperty(file, 'type', { value: '' })
    Object.defineProperty(file, 'size', { value: 1024 })

    const result = validateImage(file)

    expect(result).toBe('Please select an image file')
  })
})
