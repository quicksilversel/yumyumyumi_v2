import { getSupabaseClient } from '@/lib/supabase/getSupabaseClient'

import { addBookmark } from './addBookmark'

import { isBookmarked } from '../isBookmarked'

jest.mock('@/lib/supabase/getSupabaseClient')
jest.mock('../isBookmarked')

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
    ;(isBookmarked as jest.Mock).mockResolvedValue(false)
    mockQueryBuilder.single.mockResolvedValue({
      data: { id: 'bookmark1' },
      error: null,
    })

    const result = await addBookmark(mockRecipeId)

    expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled()
    expect(isBookmarked).toHaveBeenCalledWith(mockRecipeId, 'user123')
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('bookmarks')
    expect(mockQueryBuilder.insert).toHaveBeenCalledWith({
      user_id: 'user123',
      recipe_id: 'recipe123',
    })
    expect(result).toBe(true)
  })

  it('should return true if already bookmarked', async () => {
    ;(isBookmarked as jest.Mock).mockResolvedValue(true)

    const result = await addBookmark(mockRecipeId)

    expect(isBookmarked).toHaveBeenCalledWith(mockRecipeId, 'user123')
    expect(mockQueryBuilder.insert).not.toHaveBeenCalled()
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
    expect(isBookmarked).not.toHaveBeenCalled()
    expect(mockQueryBuilder.insert).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('should handle database insert errors', async () => {
    ;(isBookmarked as jest.Mock).mockResolvedValue(false)
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

  it('should handle isBookmarked check errors', async () => {
    const mockError = new Error('Check failed')
    ;(isBookmarked as jest.Mock).mockRejectedValue(mockError)

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const result = await addBookmark(mockRecipeId)

    expect(result).toBe(false)
    expect(consoleSpy).toHaveBeenCalledWith('adding bookmark', mockError)
    expect(mockQueryBuilder.insert).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })
})
