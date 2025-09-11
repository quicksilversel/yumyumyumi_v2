import { getSupabaseClient } from '@/lib/supabase/getSupabaseClient'

import { addBookmark } from './addBookmark'

jest.mock('@/lib/supabase/getSupabaseClient')

describe('addBookmark', () => {
  const mockSupabaseClient = {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  }

  const mockQueryBuilder = {
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn(),
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
  })

  it('should add bookmark successfully', async () => {
    mockQueryBuilder.single.mockResolvedValue({
      data: { id: 'bookmark1' },
      error: null,
    })

    const result = await addBookmark(mockRecipeId)

    expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled()
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('bookmarks')
    expect(mockQueryBuilder.insert).toHaveBeenCalledWith({
      user_id: 'user123',
      recipe_id: 'recipe123',
    })
    expect(result).toBe(true)
  })

  it('should return true if bookmark already exists (duplicate key error)', async () => {
    mockQueryBuilder.single.mockResolvedValue({
      data: null,
      error: { code: '23505', message: 'Duplicate key' },
    })

    const result = await addBookmark(mockRecipeId)

    expect(mockQueryBuilder.insert).toHaveBeenCalled()
    expect(result).toBe(true)
  })

  it('should return false when user is not authenticated', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const result = await addBookmark(mockRecipeId)

    expect(result).toBe(false)
    expect(global.alert).toHaveBeenCalledWith('ログインが必要です')
    expect(mockQueryBuilder.insert).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('should handle database insert errors', async () => {
    const mockError = new Error('Insert failed')
    mockQueryBuilder.single.mockResolvedValue({
      data: null,
      error: mockError,
    })

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const result = await addBookmark(mockRecipeId)

    expect(result).toBe(false)
    expect(consoleSpy).toHaveBeenCalledWith('adding bookmark', mockError)

    consoleSpy.mockRestore()
  })

  it('should handle auth errors gracefully', async () => {
    const mockError = new Error('Auth failed')
    mockSupabaseClient.auth.getUser.mockRejectedValue(mockError)

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const result = await addBookmark(mockRecipeId)

    expect(result).toBe(false)
    expect(consoleSpy).toHaveBeenCalledWith('adding bookmark', mockError)

    consoleSpy.mockRestore()
  })

  it('should use provided userId when given', async () => {
    const providedUserId = 'user456'
    mockQueryBuilder.single.mockResolvedValue({
      data: { id: 'bookmark1' },
      error: null,
    })

    const result = await addBookmark(mockRecipeId, providedUserId)

    expect(mockSupabaseClient.auth.getUser).not.toHaveBeenCalled()
    expect(mockQueryBuilder.insert).toHaveBeenCalledWith({
      user_id: providedUserId,
      recipe_id: mockRecipeId,
    })
    expect(result).toBe(true)
  })
})
