import { getBookmarkedRecipeIds } from './getBookmarkedRecipeIds'

import { getBookmarks } from '../getBookmarks'

jest.mock('../getBookmarks')

describe('getBookmarkedRecipeIds', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return a set of recipe IDs from bookmarks', async () => {
    const mockBookmarks = [
      {
        id: 'bookmark1',
        userId: 'user123',
        recipeId: 'recipe123',
        createdAt: '2024-01-02T00:00:00Z',
      },
      {
        id: 'bookmark2',
        userId: 'user123',
        recipeId: 'recipe456',
        createdAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'bookmark3',
        userId: 'user123',
        recipeId: 'recipe789',
        createdAt: '2024-01-03T00:00:00Z',
      },
    ]
    ;(getBookmarks as jest.Mock).mockResolvedValue(mockBookmarks)

    const result = await getBookmarkedRecipeIds()

    expect(getBookmarks).toHaveBeenCalled()
    expect(result).toBeInstanceOf(Set)
    expect(result.size).toBe(3)
    expect(result.has('recipe123')).toBe(true)
    expect(result.has('recipe456')).toBe(true)
    expect(result.has('recipe789')).toBe(true)
  })

  it('should return empty set when no bookmarks exist', async () => {
    ;(getBookmarks as jest.Mock).mockResolvedValue([])

    const result = await getBookmarkedRecipeIds()

    expect(result).toBeInstanceOf(Set)
    expect(result.size).toBe(0)
  })

  it('should handle duplicate recipe IDs correctly', async () => {
    const mockBookmarks = [
      {
        id: 'bookmark1',
        userId: 'user123',
        recipeId: 'recipe123',
        createdAt: '2024-01-02T00:00:00Z',
      },
      {
        id: 'bookmark2',
        userId: 'user123',
        recipeId: 'recipe123',
        createdAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'bookmark3',
        userId: 'user123',
        recipeId: 'recipe456',
        createdAt: '2024-01-03T00:00:00Z',
      },
    ]
    ;(getBookmarks as jest.Mock).mockResolvedValue(mockBookmarks)

    const result = await getBookmarkedRecipeIds()

    expect(result.size).toBe(2)
    expect(result.has('recipe123')).toBe(true)
    expect(result.has('recipe456')).toBe(true)
  })

  it('should handle getBookmarks errors gracefully', async () => {
    const mockError = new Error('Failed to fetch bookmarks')
    ;(getBookmarks as jest.Mock).mockRejectedValue(mockError)

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const result = await getBookmarkedRecipeIds()

    expect(result).toBeInstanceOf(Set)
    expect(result.size).toBe(0)
    expect(consoleSpy).toHaveBeenCalledWith(
      'fetching bookmarked recipe IDs',
      mockError,
    )

    consoleSpy.mockRestore()
  })

  it('should handle bookmarks with missing recipeId gracefully', async () => {
    const mockBookmarks = [
      {
        id: 'bookmark1',
        userId: 'user123',
        recipeId: 'recipe123',
        createdAt: '2024-01-02T00:00:00Z',
      },
      {
        id: 'bookmark2',
        userId: 'user123',
        recipeId: undefined,
        createdAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'bookmark3',
        userId: 'user123',
        recipeId: 'recipe456',
        createdAt: '2024-01-03T00:00:00Z',
      },
    ]
    ;(getBookmarks as jest.Mock).mockResolvedValue(mockBookmarks)

    const result = await getBookmarkedRecipeIds()

    expect(result.size).toBe(3)
    expect(result.has('recipe123')).toBe(true)
    expect(result.has('recipe456')).toBe(true)
    expect(result.has(undefined as any)).toBe(true)
  })

  it('should convert array to Set correctly', async () => {
    const mockBookmarks = [
      {
        id: 'bookmark1',
        userId: 'user123',
        recipeId: 'recipe-abc',
        createdAt: '2024-01-02T00:00:00Z',
      },
    ]
    ;(getBookmarks as jest.Mock).mockResolvedValue(mockBookmarks)

    const result = await getBookmarkedRecipeIds()

    expect(result).toBeInstanceOf(Set)
    expect(Array.from(result)).toEqual(['recipe-abc'])
  })
})
