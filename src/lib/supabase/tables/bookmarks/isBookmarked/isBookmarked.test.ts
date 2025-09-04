import { isBookmarked } from './isBookmarked'

import { getSupabaseClient } from '../../../getSupabaseClient'

jest.mock('../../../getSupabaseClient')

describe('isBookmarked', () => {
  const mockSupabaseClient = {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  }

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
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

    // Setup default chaining for eq calls
    mockQueryBuilder.eq.mockReturnThis()
  })

  it('should return true when bookmark exists', async () => {
    mockQueryBuilder.eq
      .mockReturnValueOnce(mockQueryBuilder) // First eq returns queryBuilder
      .mockResolvedValueOnce({
        // Second eq resolves
        data: [{ id: 'bookmark1' }],
        error: null,
      })

    const result = await isBookmarked(mockRecipeId)

    expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled()
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('bookmarks')
    expect(mockQueryBuilder.select).toHaveBeenCalledWith('id')
    expect(mockQueryBuilder.eq).toHaveBeenCalledWith('user_id', 'user123')
    expect(mockQueryBuilder.eq).toHaveBeenCalledWith('recipe_id', 'recipe123')
    expect(result).toBe(true)
  })

  it('should return false when bookmark does not exist', async () => {
    mockQueryBuilder.eq
      .mockReturnValueOnce(mockQueryBuilder) // First eq returns queryBuilder
      .mockResolvedValueOnce({
        // Second eq resolves
        data: [],
        error: null,
      })

    const result = await isBookmarked(mockRecipeId)

    expect(result).toBe(false)
  })

  it('should return false when data is null', async () => {
    mockQueryBuilder.eq
      .mockReturnValueOnce(mockQueryBuilder) // First eq returns queryBuilder
      .mockResolvedValueOnce({
        // Second eq resolves
        data: null,
        error: null,
      })

    const result = await isBookmarked(mockRecipeId)

    expect(result).toBe(false)
  })

  it('should return false when user is not authenticated', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    const result = await isBookmarked(mockRecipeId)

    expect(result).toBe(false)
    expect(mockSupabaseClient.from).not.toHaveBeenCalled()
  })

  it('should handle database query errors', async () => {
    const mockError = new Error('Query failed')
    mockQueryBuilder.eq
      .mockReturnValueOnce(mockQueryBuilder) // First eq returns queryBuilder
      .mockResolvedValueOnce({
        // Second eq resolves with error
        data: null,
        error: mockError,
      })

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const result = await isBookmarked(mockRecipeId)

    expect(result).toBe(false)
    expect(consoleSpy).toHaveBeenCalledWith(
      'checking bookmark status',
      mockError,
    )

    consoleSpy.mockRestore()
  })

  it('should handle auth errors gracefully', async () => {
    const mockError = new Error('Auth failed')
    mockSupabaseClient.auth.getUser.mockRejectedValue(mockError)

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const result = await isBookmarked(mockRecipeId)

    expect(result).toBe(false)
    expect(consoleSpy).toHaveBeenCalledWith(
      'checking bookmark status',
      mockError,
    )

    consoleSpy.mockRestore()
  })

  it('should call eq methods in correct order', async () => {
    mockQueryBuilder.eq
      .mockReturnValueOnce(mockQueryBuilder) // First eq returns queryBuilder
      .mockResolvedValueOnce({
        // Second eq resolves
        data: [],
        error: null,
      })

    await isBookmarked(mockRecipeId)

    expect(mockQueryBuilder.eq).toHaveBeenNthCalledWith(1, 'user_id', 'user123')
    expect(mockQueryBuilder.eq).toHaveBeenNthCalledWith(
      2,
      'recipe_id',
      'recipe123',
    )
  })

  it('should handle multiple bookmarks in result', async () => {
    // This shouldn't happen due to unique constraint, but testing edge case
    mockQueryBuilder.eq
      .mockReturnValueOnce(mockQueryBuilder) // First eq returns queryBuilder
      .mockResolvedValueOnce({
        // Second eq resolves
        data: [{ id: 'bookmark1' }, { id: 'bookmark2' }],
        error: null,
      })

    const result = await isBookmarked(mockRecipeId)

    expect(result).toBe(true)
  })
})
