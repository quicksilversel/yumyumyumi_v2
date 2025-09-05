import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import { deleteImage } from './deleteImage'

// Mock the auth-helpers-nextjs module
jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: jest.fn(),
}))

describe('deleteImage', () => {
  const mockSupabase = {
    storage: {
      from: jest.fn(),
    },
  }

  const mockStorageClient = {
    remove: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(createClientComponentClient as jest.Mock).mockReturnValue(mockSupabase)
    mockSupabase.storage.from.mockReturnValue(mockStorageClient)
  })

  it('should delete image successfully', async () => {
    const imageUrl =
      'https://example.com/storage/v1/object/public/recipe-images/user123/recipe456/image.webp'

    mockStorageClient.remove.mockResolvedValue({ error: null })

    const result = await deleteImage(imageUrl)

    expect(mockSupabase.storage.from).toHaveBeenCalledWith('recipe-images')
    expect(mockStorageClient.remove).toHaveBeenCalledWith([
      'user123/recipe456/image.webp',
    ])
    expect(result).toBe(true)
  })

  it('should return true for empty imageUrl', async () => {
    const result = await deleteImage('')

    expect(mockSupabase.storage.from).not.toHaveBeenCalled()
    expect(result).toBe(true)
  })

  it('should return true for null-like imageUrl', async () => {
    const result = await deleteImage(null as any)

    expect(mockSupabase.storage.from).not.toHaveBeenCalled()
    expect(result).toBe(true)
  })

  it('should return true for URL without storage bucket', async () => {
    const imageUrl = 'https://example.com/some-other-path/image.jpg'

    const result = await deleteImage(imageUrl)

    expect(mockSupabase.storage.from).not.toHaveBeenCalled()
    expect(result).toBe(true)
  })

  it('should handle storage deletion errors', async () => {
    const imageUrl =
      'https://example.com/storage/v1/object/public/recipe-images/user123/recipe456/image.webp'

    const mockError = new Error('Storage error')
    mockStorageClient.remove.mockResolvedValue({ error: mockError })

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const result = await deleteImage(imageUrl)

    expect(result).toBe(false)
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error in deleteRecipeImage:',
      mockError,
    )

    consoleSpy.mockRestore()
  })

  it('should handle unexpected errors', async () => {
    const imageUrl =
      'https://example.com/storage/v1/object/public/recipe-images/user123/recipe456/image.webp'

    mockStorageClient.remove.mockRejectedValue(new Error('Unexpected error'))

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const result = await deleteImage(imageUrl)

    expect(result).toBe(false)
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error in deleteRecipeImage:',
      expect.any(Error),
    )

    consoleSpy.mockRestore()
  })

  it('should extract correct file path from different URL formats', async () => {
    const testCases = [
      {
        url: 'https://supabase.co/storage/v1/object/public/recipe-images/path/to/file.jpg',
        expectedPath: 'path/to/file.jpg',
      },
      {
        url: 'https://example.com/recipe-images/simple.png',
        expectedPath: 'simple.png',
      },
      {
        url: 'http://localhost:54321/storage/v1/object/public/recipe-images/local/test.webp',
        expectedPath: 'local/test.webp',
      },
    ]

    for (const { url, expectedPath } of testCases) {
      mockStorageClient.remove.mockResolvedValue({ error: null })

      await deleteImage(url)

      expect(mockStorageClient.remove).toHaveBeenCalledWith([expectedPath])
      jest.clearAllMocks()
      mockSupabase.storage.from.mockReturnValue(mockStorageClient)
    }
  })

  it('should handle malformed URLs gracefully', async () => {
    const malformedUrl = 'recipe-images/'

    const result = await deleteImage(malformedUrl)

    expect(mockSupabase.storage.from).not.toHaveBeenCalled()
    expect(result).toBe(true)
  })
})
