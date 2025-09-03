/* eslint-disable no-console */
import type { BookmarkedRecipe } from '@/types'

import { getSupabaseClient } from '../getSupabaseClient'
import {
  getBookmarks,
  isBookmarked,
  addBookmark,
  removeBookmark,
  toggleBookmark,
  clearAllBookmarks,
  getBookmarkedRecipeIds,
} from '../supabaseBookmarkService'

// Mock the getSupabaseClient function
jest.mock('../getSupabaseClient')

describe('supabaseBookmarkService', () => {
  // Helper to create a complete mock query chain
  const createMockQueryChain = () => ({
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
  })

  const mockSupabaseClient = {
    from: jest.fn(() => createMockQueryChain()),
    auth: {
      getUser: jest.fn(),
    },
  }

  const mockDbBookmark = {
    id: '123',
    user_id: 'user123',
    recipe_id: 'recipe456',
    created_at: '2024-01-01T00:00:00Z',
  }

  const mockBookmark: BookmarkedRecipe = {
    recipeId: 'recipe456',
    bookmarkedAt: '2024-01-01T00:00:00Z',
  }

  const mockUser = { id: 'user123' }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getSupabaseClient as jest.Mock).mockReturnValue(mockSupabaseClient)
    // Reset console.error mock
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    // Restore console.error
    jest.restoreAllMocks()
  })

  describe('getBookmarks', () => {
    it('should fetch all bookmarks for the current user', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      })

      const mockQuery = {
        ...createMockQueryChain(),
        order: jest.fn().mockResolvedValue({
          data: [mockDbBookmark],
          error: null,
        }),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const result = await getBookmarks()

      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled()
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('bookmarks')
      expect(mockQuery.select).toHaveBeenCalledWith('*')
      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', 'user123')
      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(mockBookmark)
    })

    it('should return empty array when user is not logged in', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
      })

      const result = await getBookmarks()

      expect(result).toEqual([])
      expect(mockSupabaseClient.from).not.toHaveBeenCalled()
    })

    it('should return empty array on error', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      })

      const mockQuery = {
        ...createMockQueryChain(),
        order: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const result = await getBookmarks()

      expect(result).toEqual([])
      expect(console.error).toHaveBeenCalled()
    })
  })

  describe('isBookmarked', () => {
    it('should return true when recipe is bookmarked', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      })

      const mockQuery = {
        ...createMockQueryChain(),
        single: jest.fn().mockResolvedValue({
          data: { id: '123' },
          error: null,
        }),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const result = await isBookmarked('recipe456')

      expect(result).toBe(true)
      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', 'user123')
      expect(mockQuery.eq).toHaveBeenCalledWith('recipe_id', 'recipe456')
    })

    it('should return false when recipe is not bookmarked', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      })

      const mockQuery = {
        ...createMockQueryChain(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116', message: 'No rows found' },
        }),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const result = await isBookmarked('recipe456')

      expect(result).toBe(false)
    })

    it('should return false when user is not logged in', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
      })

      const result = await isBookmarked('recipe456')

      expect(result).toBe(false)
      expect(mockSupabaseClient.from).not.toHaveBeenCalled()
    })
  })

  describe('addBookmark', () => {
    it('should add a bookmark successfully', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      })

      // Mock isBookmarked check
      const mockCheckQuery = {
        ...createMockQueryChain(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' },
        }),
      }

      // Mock insert
      const mockInsertQuery = {
        ...createMockQueryChain(),
        insert: jest.fn().mockResolvedValue({
          error: null,
        }),
      }

      // Mock getBookmarks for refresh
      const mockGetQuery = {
        ...createMockQueryChain(),
        order: jest.fn().mockResolvedValue({
          data: [mockDbBookmark],
          error: null,
        }),
      }

      mockSupabaseClient.from
        .mockReturnValueOnce(mockCheckQuery) // For isBookmarked
        .mockReturnValueOnce(mockInsertQuery) // For insert
        .mockReturnValueOnce(mockGetQuery) // For getBookmarks

      const result = await addBookmark('recipe456')

      expect(result).toBe(true)
      expect(mockInsertQuery.insert).toHaveBeenCalledWith({
        user_id: 'user123',
        recipe_id: 'recipe456',
      })
    })

    it('should return true if already bookmarked', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      })

      // Mock isBookmarked to return true
      const mockQuery = {
        ...createMockQueryChain(),
        single: jest.fn().mockResolvedValue({
          data: { id: '123' },
          error: null,
        }),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const result = await addBookmark('recipe456')

      expect(result).toBe(true)
      // Should not attempt to insert
      expect(mockQuery.insert).not.toHaveBeenCalled()
    })

    it('should return false when user is not logged in', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
      })

      const result = await addBookmark('recipe456')

      expect(result).toBe(false)
      expect(console.error).toHaveBeenCalledWith(
        'User must be logged in to bookmark recipes',
      )
    })
  })

  describe('removeBookmark', () => {
    it('should remove a bookmark successfully', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      })

      const mockDeleteQuery = {
        ...createMockQueryChain(),
        eq: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
      }

      // The last eq in the chain returns the promise result
      mockDeleteQuery.eq
        .mockReturnValueOnce(mockDeleteQuery) // First eq returns query for chaining
        .mockResolvedValueOnce({ error: null }) // Second eq resolves the promise

      // Mock getBookmarks for refresh
      const mockGetQuery = {
        ...createMockQueryChain(),
        order: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      }

      mockSupabaseClient.from
        .mockReturnValueOnce(mockDeleteQuery) // For delete
        .mockReturnValueOnce(mockGetQuery) // For getBookmarks

      const result = await removeBookmark('recipe456')

      expect(result).toBe(true)
      expect(mockDeleteQuery.delete).toHaveBeenCalled()
      expect(mockDeleteQuery.eq).toHaveBeenNthCalledWith(
        1,
        'user_id',
        'user123',
      )
      expect(mockDeleteQuery.eq).toHaveBeenNthCalledWith(
        2,
        'recipe_id',
        'recipe456',
      )
    })

    it('should return false when user is not logged in', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
      })

      const result = await removeBookmark('recipe456')

      expect(result).toBe(false)
      expect(console.error).toHaveBeenCalledWith(
        'User must be logged in to remove bookmarks',
      )
    })
  })

  describe('toggleBookmark', () => {
    it('should add bookmark when not bookmarked', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      })

      // Mock isBookmarked to return false
      const mockCheckQuery = {
        ...createMockQueryChain(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { code: 'PGRST116' },
        }),
      }

      // Mock insert
      const mockInsertQuery = {
        ...createMockQueryChain(),
        insert: jest.fn().mockResolvedValue({
          error: null,
        }),
      }

      // Mock getBookmarks for refresh
      const mockGetQuery = {
        ...createMockQueryChain(),
        order: jest.fn().mockResolvedValue({
          data: [mockDbBookmark],
          error: null,
        }),
      }

      mockSupabaseClient.from
        .mockReturnValueOnce(mockCheckQuery) // For isBookmarked
        .mockReturnValueOnce(mockCheckQuery) // For isBookmarked in addBookmark
        .mockReturnValueOnce(mockInsertQuery) // For insert
        .mockReturnValueOnce(mockGetQuery) // For getBookmarks

      const result = await toggleBookmark('recipe456')

      expect(result).toBe(true)
    })

    it('should remove bookmark when bookmarked', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      })

      // Mock isBookmarked to return true
      const mockCheckQuery = {
        ...createMockQueryChain(),
        single: jest.fn().mockResolvedValue({
          data: { id: '123' },
          error: null,
        }),
      }

      // Mock delete
      const mockDeleteQuery = {
        ...createMockQueryChain(),
        eq: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
      }

      mockDeleteQuery.eq
        .mockReturnValueOnce(mockDeleteQuery)
        .mockResolvedValueOnce({ error: null })

      // Mock getBookmarks for refresh
      const mockGetQuery = {
        ...createMockQueryChain(),
        order: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      }

      mockSupabaseClient.from
        .mockReturnValueOnce(mockCheckQuery) // For isBookmarked
        .mockReturnValueOnce(mockDeleteQuery) // For delete
        .mockReturnValueOnce(mockGetQuery) // For getBookmarks

      const result = await toggleBookmark('recipe456')

      expect(result).toBe(false)
    })
  })

  describe('clearAllBookmarks', () => {
    it('should clear all bookmarks for the user', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      })

      const mockQuery = {
        ...createMockQueryChain(),
        eq: jest.fn().mockResolvedValue({
          error: null,
        }),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const result = await clearAllBookmarks()

      expect(result).toBe(true)
      expect(mockQuery.delete).toHaveBeenCalled()
      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', 'user123')
    })

    it('should return false when user is not logged in', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
      })

      const result = await clearAllBookmarks()

      expect(result).toBe(false)
      expect(console.error).toHaveBeenCalledWith(
        'User must be logged in to clear bookmarks',
      )
    })
  })

  describe('getBookmarkedRecipeIds', () => {
    it('should return a Set of bookmarked recipe IDs', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      })

      const mockQuery = {
        ...createMockQueryChain(),
        order: jest.fn().mockResolvedValue({
          data: [
            { ...mockDbBookmark, recipe_id: 'recipe1' },
            { ...mockDbBookmark, recipe_id: 'recipe2' },
            { ...mockDbBookmark, recipe_id: 'recipe3' },
          ],
          error: null,
        }),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const result = await getBookmarkedRecipeIds()

      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(3)
      expect(result.has('recipe1')).toBe(true)
      expect(result.has('recipe2')).toBe(true)
      expect(result.has('recipe3')).toBe(true)
    })

    it('should return empty Set when no bookmarks', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
      })

      const mockQuery = {
        ...createMockQueryChain(),
        order: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      }
      mockSupabaseClient.from.mockReturnValue(mockQuery)

      const result = await getBookmarkedRecipeIds()

      expect(result).toBeInstanceOf(Set)
      expect(result.size).toBe(0)
    })
  })
})
