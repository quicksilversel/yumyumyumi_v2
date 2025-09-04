import { getSupabaseClient } from '@/lib/supabase/getSupabaseClient'

import { removeBookmark } from './removeBookmark'

jest.mock('@/lib/supabase/getSupabaseClient')

describe('removeBookmark', () => {
  const mockSupabaseClient = {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  }

  const mockQueryBuilder = {
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn(),
  }

  const mockUser = {
    id: 'user123',
    email: 'test@example.com',
  }

  const mockRecipeId = 'recipe123'

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getSupabaseClient as jest.Mock).mockReturnValue(mockSupabaseClient)
    mockSupabaseClient.from.mockReturnValue(mockQueryBuilder)
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    mockQueryBuilder.eq.mockReturnThis()
  })

  it('should remove bookmark successfully', async () => {
    mockQueryBuilder.eq
      .mockReturnValueOnce(mockQueryBuilder)
      .mockResolvedValueOnce({
        data: null,
        error: null,
      })

    const result = await removeBookmark(mockRecipeId)

    expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled()
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('bookmarks')
    expect(mockQueryBuilder.delete).toHaveBeenCalled()
    expect(mockQueryBuilder.eq).toHaveBeenCalledWith('user_id', 'user123')
    expect(mockQueryBuilder.eq).toHaveBeenCalledWith('recipe_id', 'recipe123')
    expect(result).toBe(true)
  })

  it('should return false when user is not authenticated', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    const result = await removeBookmark(mockRecipeId)

    expect(result).toBe(false)
    expect(mockSupabaseClient.from).not.toHaveBeenCalled()
  })

  it('should handle database delete errors', async () => {
    const mockError = new Error('Delete failed')
    mockQueryBuilder.eq
      .mockReturnValueOnce(mockQueryBuilder)
      .mockResolvedValueOnce({
        data: null,
        error: mockError,
      })

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const result = await removeBookmark(mockRecipeId)

    expect(result).toBe(false)
    expect(consoleSpy).toHaveBeenCalledWith('removing bookmark', mockError)

    consoleSpy.mockRestore()
  })

  it('should handle auth errors gracefully', async () => {
    const mockError = new Error('Auth failed')
    mockSupabaseClient.auth.getUser.mockRejectedValue(mockError)

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const result = await removeBookmark(mockRecipeId)

    expect(result).toBe(false)
    expect(consoleSpy).toHaveBeenCalledWith('removing bookmark', mockError)

    consoleSpy.mockRestore()
  })

  it('should call eq methods in correct order', async () => {
    mockQueryBuilder.eq
      .mockReturnValueOnce(mockQueryBuilder)
      .mockResolvedValueOnce({
        data: null,
        error: null,
      })

    await removeBookmark(mockRecipeId)

    expect(mockQueryBuilder.eq).toHaveBeenNthCalledWith(1, 'user_id', 'user123')
    expect(mockQueryBuilder.eq).toHaveBeenNthCalledWith(
      2,
      'recipe_id',
      'recipe123',
    )
  })
})
