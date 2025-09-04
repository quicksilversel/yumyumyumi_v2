/* eslint-disable no-console */
import { objectToCamel } from 'ts-case-convert'

import type { Recipe, RecipeFilters } from '@/types/recipe'

import { searchRecipesInSupabase } from './searchRecipesInSupabase'

import { getSupabaseClient } from '../../../getSupabaseClient'

jest.mock('../../../getSupabaseClient')
jest.mock('ts-case-convert')

describe('searchRecipesInSupabase', () => {
  const mockSupabaseClient = {
    from: jest.fn(),
  }

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    lte: jest.fn().mockReturnThis(),
    order: jest.fn(),
  }

  const mockDbRecipes = [
    {
      id: '123',
      user_id: 'user123',
      title: 'Pasta Recipe',
      summary: 'Delicious pasta dish',
      ingredients: [{ name: 'Pasta', amount: '200g', isSpice: false }],
      directions: [{ title: 'Step 1', description: 'Boil water' }],
      tags: ['italian', 'pasta'],
      tips: 'Use fresh ingredients',
      cook_time: 30,
      servings: 4,
      category: 'Main Course',
      image_url: 'https://example.com/pasta.jpg',
      source: 'https://example.com',
      is_public: true,
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    },
    {
      id: '456',
      user_id: 'user456',
      title: 'Salad Recipe',
      summary: 'Fresh green salad',
      ingredients: [{ name: 'Lettuce', amount: '1 head', isSpice: false }],
      directions: [{ title: 'Step 1', description: 'Wash lettuce' }],
      tags: ['healthy', 'salad'],
      tips: 'Use fresh lettuce',
      cook_time: 15,
      servings: 2,
      category: 'Appetizer',
      image_url: 'https://example.com/salad.jpg',
      source: 'https://example.com/salad',
      is_public: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ]

  const mockRecipes: Recipe[] = [
    {
      id: '123',
      userId: 'user123',
      title: 'Pasta Recipe',
      summary: 'Delicious pasta dish',
      ingredients: [{ name: 'Pasta', amount: '200g', isSpice: false }],
      directions: [{ title: 'Step 1', description: 'Boil water' }],
      tags: ['italian', 'pasta'],
      tips: 'Use fresh ingredients',
      cookTime: 30,
      servings: 4,
      category: 'Main Course',
      imageUrl: 'https://example.com/pasta.jpg',
      source: 'https://example.com',
      isPublic: true,
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    },
    {
      id: '456',
      userId: 'user456',
      title: 'Salad Recipe',
      summary: 'Fresh green salad',
      ingredients: [{ name: 'Lettuce', amount: '1 head', isSpice: false }],
      directions: [{ title: 'Step 1', description: 'Wash lettuce' }],
      tags: ['healthy', 'salad'],
      tips: 'Use fresh lettuce',
      cookTime: 15,
      servings: 2,
      category: 'Appetizer',
      imageUrl: 'https://example.com/salad.jpg',
      source: 'https://example.com/salad',
      isPublic: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getSupabaseClient as jest.Mock).mockReturnValue(mockSupabaseClient)
    ;(objectToCamel as jest.Mock).mockImplementation((data) => {
      if (!data) return data
      if (Array.isArray(data)) {
        return data.map((obj) => {
          const result = { ...obj }
          if (obj.user_id !== undefined) {
            result.userId = obj.user_id
            delete result.user_id
          }
          if (obj.cook_time !== undefined) {
            result.cookTime = obj.cook_time
            delete result.cook_time
          }
          if (obj.image_url !== undefined) {
            result.imageUrl = obj.image_url
            delete result.image_url
          }
          if (obj.is_public !== undefined) {
            result.isPublic = obj.is_public
            delete result.is_public
          }
          if (obj.created_at !== undefined) {
            result.createdAt = obj.created_at
            delete result.created_at
          }
          if (obj.updated_at !== undefined) {
            result.updatedAt = obj.updated_at
            delete result.updated_at
          }
          return result
        })
      }
      return data
    })

    mockSupabaseClient.from.mockReturnValue(mockQueryBuilder)
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('successful search', () => {
    it('should search with no filters (get all public recipes)', async () => {
      mockQueryBuilder.order.mockResolvedValue({
        data: mockDbRecipes,
        error: null,
      })

      const filters: RecipeFilters = {}
      const result = await searchRecipesInSupabase(filters)

      expect(getSupabaseClient).toHaveBeenCalled()
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('recipes')
      expect(mockQueryBuilder.select).toHaveBeenCalledWith('*')
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('is_public', true)
      expect(mockQueryBuilder.or).not.toHaveBeenCalled()
      expect(mockQueryBuilder.lte).not.toHaveBeenCalled()
      expect(mockQueryBuilder.order).toHaveBeenCalledWith('created_at', {
        ascending: false,
      })
      expect(objectToCamel).toHaveBeenCalledWith(mockDbRecipes)
      expect(result).toEqual(mockRecipes)
    })

    it('should search with searchTerm filter', async () => {
      mockQueryBuilder.order.mockResolvedValue({
        data: [mockDbRecipes[0]],
        error: null,
      })

      const filters: RecipeFilters = { searchTerm: 'pasta' }
      const result = await searchRecipesInSupabase(filters)

      expect(mockQueryBuilder.or).toHaveBeenCalledWith(
        'title.ilike.%pasta%,summary.ilike.%pasta%',
      )
      expect(result).toEqual([mockRecipes[0]])
    })

    it('should search with category filter', async () => {
      mockQueryBuilder.order.mockResolvedValue({
        data: [mockDbRecipes[0]],
        error: null,
      })

      const filters: RecipeFilters = { category: 'Main Course' }
      const result = await searchRecipesInSupabase(filters)

      expect(mockQueryBuilder.eq).toHaveBeenCalledWith(
        'category',
        'Main Course',
      )
      expect(result).toEqual([mockRecipes[0]])
    })

    it('should search with maxCookingTime filter', async () => {
      mockQueryBuilder.order.mockResolvedValue({
        data: [mockDbRecipes[1]],
        error: null,
      })

      const filters: RecipeFilters = { maxCookingTime: 20 }
      const result = await searchRecipesInSupabase(filters)

      expect(mockQueryBuilder.lte).toHaveBeenCalledWith('cook_time', 20)
      expect(result).toEqual([mockRecipes[1]])
    })

    it('should search with multiple filters combined', async () => {
      mockQueryBuilder.order.mockResolvedValue({
        data: [mockDbRecipes[1]],
        error: null,
      })

      const filters: RecipeFilters = {
        searchTerm: 'salad',
        category: 'Appetizer',
        maxCookingTime: 20,
      }
      const result = await searchRecipesInSupabase(filters)

      expect(mockQueryBuilder.or).toHaveBeenCalledWith(
        'title.ilike.%salad%,summary.ilike.%salad%',
      )
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('category', 'Appetizer')
      expect(mockQueryBuilder.lte).toHaveBeenCalledWith('cook_time', 20)
      expect(result).toEqual([mockRecipes[1]])
    })

    it('should return empty array when no matches found', async () => {
      mockQueryBuilder.order.mockResolvedValue({
        data: [],
        error: null,
      })

      const filters: RecipeFilters = { searchTerm: 'nonexistent' }
      const result = await searchRecipesInSupabase(filters)

      expect(result).toEqual([])
    })
  })

  describe('error handling', () => {
    it('should return empty array and log error when query fails', async () => {
      const queryError = new Error('Query failed')
      mockQueryBuilder.order.mockResolvedValue({
        data: null,
        error: queryError,
      })

      const filters: RecipeFilters = { searchTerm: 'pasta' }
      const result = await searchRecipesInSupabase(filters)

      expect(result).toEqual([])
      expect(console.error).toHaveBeenCalledWith(
        'searching recipes',
        queryError,
      )
    })

    it('should return empty array when an exception occurs', async () => {
      const unexpectedError = new Error('Unexpected error')
      mockQueryBuilder.order.mockRejectedValue(unexpectedError)

      const filters: RecipeFilters = {}
      const result = await searchRecipesInSupabase(filters)

      expect(result).toEqual([])
      expect(console.error).toHaveBeenCalledWith(
        'searching recipes',
        unexpectedError,
      )
    })

    it('should handle database connection errors', async () => {
      mockSupabaseClient.from.mockImplementation(() => {
        throw new Error('Database connection failed')
      })

      const filters: RecipeFilters = {}
      const result = await searchRecipesInSupabase(filters)

      expect(result).toEqual([])
      expect(console.error).toHaveBeenCalledWith(
        'searching recipes',
        expect.any(Error),
      )
    })
  })

  describe('edge cases', () => {
    it('should handle special characters in searchTerm', async () => {
      mockQueryBuilder.order.mockResolvedValue({
        data: [],
        error: null,
      })

      const filters: RecipeFilters = { searchTerm: 'test%_special' }
      const result = await searchRecipesInSupabase(filters)

      expect(mockQueryBuilder.or).toHaveBeenCalledWith(
        'title.ilike.%test%_special%,summary.ilike.%test%_special%',
      )
      expect(result).toEqual([])
    })

    it('should handle empty searchTerm', async () => {
      mockQueryBuilder.order.mockResolvedValue({
        data: mockDbRecipes,
        error: null,
      })

      const filters: RecipeFilters = { searchTerm: '' }
      const result = await searchRecipesInSupabase(filters)

      expect(mockQueryBuilder.or).not.toHaveBeenCalled()
      expect(result).toEqual(mockRecipes)
    })

    it('should handle zero maxCookingTime', async () => {
      mockQueryBuilder.order.mockResolvedValue({
        data: mockDbRecipes,
        error: null,
      })

      const filters: RecipeFilters = { maxCookingTime: 0 }
      const result = await searchRecipesInSupabase(filters)

      // Note: Due to the truthy check in implementation, 0 is treated as falsy and filter is not applied
      expect(mockQueryBuilder.lte).not.toHaveBeenCalled()
      expect(result).toEqual(mockRecipes)
    })

    it('should handle null data from database', async () => {
      mockQueryBuilder.order.mockResolvedValue({
        data: null,
        error: null,
      })
      ;(objectToCamel as jest.Mock).mockImplementation(() => [])

      const filters: RecipeFilters = {}
      const result = await searchRecipesInSupabase(filters)

      expect(result).toEqual([])
    })

    it('should handle very long searchTerm', async () => {
      const longSearchTerm = 'a'.repeat(1000)
      mockQueryBuilder.order.mockResolvedValue({
        data: [],
        error: null,
      })

      const filters: RecipeFilters = { searchTerm: longSearchTerm }
      const result = await searchRecipesInSupabase(filters)

      expect(mockQueryBuilder.or).toHaveBeenCalledWith(
        `title.ilike.%${longSearchTerm}%,summary.ilike.%${longSearchTerm}%`,
      )
      expect(result).toEqual([])
    })

    it('should handle undefined filter properties', async () => {
      mockQueryBuilder.order.mockResolvedValue({
        data: mockDbRecipes,
        error: null,
      })

      const filters: RecipeFilters = {
        searchTerm: undefined,
        category: undefined,
        maxCookingTime: undefined,
      }
      const result = await searchRecipesInSupabase(filters)

      expect(mockQueryBuilder.or).not.toHaveBeenCalled()
      expect(mockQueryBuilder.eq).toHaveBeenCalledTimes(1) // Only for is_public
      expect(mockQueryBuilder.lte).not.toHaveBeenCalled()
      expect(result).toEqual(mockRecipes)
    })

    it('should maintain order from database', async () => {
      const orderedRecipes = [
        { ...mockDbRecipes[0], created_at: '2024-01-03T00:00:00Z' },
        { ...mockDbRecipes[1], created_at: '2024-01-02T00:00:00Z' },
      ]
      mockQueryBuilder.order.mockResolvedValue({
        data: orderedRecipes,
        error: null,
      })

      const filters: RecipeFilters = {}
      const result = await searchRecipesInSupabase(filters)

      expect(result).toHaveLength(2)
      expect(result[0].createdAt).toBe('2024-01-03T00:00:00Z')
      expect(result[1].createdAt).toBe('2024-01-02T00:00:00Z')
    })
  })
})
