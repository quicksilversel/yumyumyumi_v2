import { getSupabaseClient } from '@/lib/supabase/getSupabaseClient'

import { clearAllBookmarks } from './clearAllBookmarks'

jest.mock('@/lib/supabase/getSupabaseClient')

describe('clearAllBookmarks', () => {
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

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getSupabaseClient as jest.Mock).mockReturnValue(mockSupabaseClient)
    mockSupabaseClient.from.mockReturnValue(mockQueryBuilder)
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
  })

  it('should clear all bookmarks successfully', async () => {
    mockQueryBuilder.eq.mockResolvedValue({
      data: null,
      error: null,
    })

    const result = await clearAllBookmarks()

    expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled()
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('bookmarks')
    expect(mockQueryBuilder.delete).toHaveBeenCalled()
    expect(mockQueryBuilder.eq).toHaveBeenCalledWith('user_id', 'user123')
    expect(result).toBe(true)
  })

  it('should return false when user is not authenticated', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const result = await clearAllBookmarks()

    expect(result).toBe(false)
    expect(consoleSpy).toHaveBeenCalledWith(
      'User must be logged in to clear bookmarks',
    )
    expect(mockSupabaseClient.from).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('should handle database delete errors', async () => {
    const mockError = new Error('Delete failed')
    mockQueryBuilder.eq.mockResolvedValue({
      data: null,
      error: mockError,
    })

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const result = await clearAllBookmarks()

    expect(result).toBe(false)
    expect(consoleSpy).toHaveBeenCalledWith('clearing all bookmarks', mockError)

    consoleSpy.mockRestore()
  })

  it('should handle auth errors gracefully', async () => {
    const mockError = new Error('Auth failed')
    mockSupabaseClient.auth.getUser.mockRejectedValue(mockError)

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const result = await clearAllBookmarks()

    expect(result).toBe(false)
    expect(consoleSpy).toHaveBeenCalledWith('clearing all bookmarks', mockError)

    consoleSpy.mockRestore()
  })

  it('should only delete bookmarks for the authenticated user', async () => {
    mockQueryBuilder.eq.mockResolvedValue({
      data: null,
      error: null,
    })

    await clearAllBookmarks()

    expect(mockQueryBuilder.eq).toHaveBeenCalledWith('user_id', 'user123')
    expect(mockQueryBuilder.eq).toHaveBeenCalledTimes(1)
  })

  it('should handle successful deletion with no bookmarks', async () => {
    mockQueryBuilder.eq.mockResolvedValue({
      data: [],
      error: null,
    })

    const result = await clearAllBookmarks()

    expect(result).toBe(true)
  })
})
