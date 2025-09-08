/* eslint-disable no-console */
import { objectToCamel } from 'ts-case-convert'

import type { Recipe } from '@/types/recipe'

import { isValidOf } from '@/lib/functions/isValidOf'

import { getRecipesFromSupabase } from './getRecipesFromSupabase'

import { getSupabaseClient } from '../../../getSupabaseClient'

jest.mock('../../../getSupabaseClient')
jest.mock('@/lib/functions/isValidOf')
jest.mock('ts-case-convert')

describe('getRecipesFromSupabase', () => {
  const mockSupabaseClient = {
    from: jest.fn(),
  }

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
  }

  const mockDbRecipes = [
    {
      id: '123',
      user_id: 'user123',
      title: 'First Recipe',
      summary: 'A test recipe',
      ingredients: [{ name: 'Ingredient 1', amount: '1 cup', isSpice: false }],
      directions: [{ title: 'Step 1', description: 'Do something' }],
      tags: ['test', 'recipe'],
      tips: 'Some tips',
      cook_time: 30,
      servings: 4,
      image_url: 'https://example.com/image1.jpg',
      source: 'https://example.com',
      is_public: true,
      created_at: '2024-01-02T00:00:00Z',
      updated_at: '2024-01-02T00:00:00Z',
    },
    {
      id: '456',
      user_id: 'user456',
      title: 'Second Recipe',
      summary: 'Another test recipe',
      ingredients: [{ name: 'Ingredient 2', amount: '2 cups', isSpice: true }],
      directions: [{ title: 'Step 2', description: 'Do something else' }],
      tags: ['another', 'test'],
      tips: 'More tips',
      cook_time: 45,
      servings: 6,
      image_url: 'https://example.com/image2.jpg',
      source: 'https://example.com/source2',
      is_public: true,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ]

  const mockRecipes: Recipe[] = [
    {
      id: '123',
      userId: 'user123',
      title: 'First Recipe',
      summary: 'A test recipe',
      ingredients: [{ name: 'Ingredient 1', amount: '1 cup', isSpice: false }],
      directions: [{ title: 'Step 1', description: 'Do something' }],
      tags: ['test', 'recipe'],
      tips: 'Some tips',
      cookTime: 30,
      servings: 4,
      imageUrl: 'https://example.com/image1.jpg',
      source: 'https://example.com',
      isPublic: true,
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
    },
    {
      id: '456',
      userId: 'user456',
      title: 'Second Recipe',
      summary: 'Another test recipe',
      ingredients: [{ name: 'Ingredient 2', amount: '2 cups', isSpice: true }],
      directions: [{ title: 'Step 2', description: 'Do something else' }],
      tags: ['another', 'test'],
      tips: 'More tips',
      cookTime: 45,
      servings: 6,
      imageUrl: 'https://example.com/image2.jpg',
      source: 'https://example.com/source2',
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
    ;(isValidOf as unknown as jest.Mock).mockReturnValue(true)

    mockSupabaseClient.from.mockReturnValue(mockQueryBuilder)
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('successful fetch', () => {
    it('should fetch all public recipes ordered by creation date', async () => {
      mockQueryBuilder.order.mockResolvedValue({
        data: mockDbRecipes,
        error: null,
      })

      const result = await getRecipesFromSupabase()

      expect(getSupabaseClient).toHaveBeenCalled()
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('recipes')
      expect(mockQueryBuilder.select).toHaveBeenCalledWith('*')
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('is_public', true)
      expect(mockQueryBuilder.order).toHaveBeenCalledWith('created_at', {
        ascending: false,
      })
      expect(objectToCamel).toHaveBeenCalledWith(mockDbRecipes)
      expect(isValidOf).toHaveBeenCalled()
      expect(result).toEqual(mockRecipes)
    })

    it('should return empty array when no recipes found', async () => {
      mockQueryBuilder.order.mockResolvedValue({
        data: [],
        error: null,
      })

      const result = await getRecipesFromSupabase()

      expect(result).toEqual([])
      expect(isValidOf).toHaveBeenCalled()
    })

    it('should return empty array when validation fails', async () => {
      mockQueryBuilder.order.mockResolvedValue({
        data: mockDbRecipes,
        error: null,
      })
      ;(isValidOf as unknown as jest.Mock).mockReturnValue(false)

      const result = await getRecipesFromSupabase()

      expect(isValidOf).toHaveBeenCalled()
      expect(result).toEqual([])
    })

    it('should handle single recipe result', async () => {
      const singleRecipe = [mockDbRecipes[0]]
      mockQueryBuilder.order.mockResolvedValue({
        data: singleRecipe,
        error: null,
      })

      const result = await getRecipesFromSupabase()

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual(mockRecipes[0])
    })

    it('should handle large number of recipes', async () => {
      const manyRecipes = Array(100)
        .fill(mockDbRecipes[0])
        .map((recipe, index) => ({
          ...recipe,
          id: `recipe-${index}`,
        }))
      mockQueryBuilder.order.mockResolvedValue({
        data: manyRecipes,
        error: null,
      })

      const result = await getRecipesFromSupabase()

      expect(result).toHaveLength(100)
    })
  })

  describe('error handling', () => {
    it('should return empty array and log error when query fails', async () => {
      const queryError = new Error('Query failed')
      mockQueryBuilder.order.mockResolvedValue({
        data: null,
        error: queryError,
      })

      const result = await getRecipesFromSupabase()

      expect(result).toEqual([])
      expect(console.error).toHaveBeenCalledWith(
        'fetching recipes from Supabase',
        queryError,
      )
    })

    it('should return empty array when an exception occurs', async () => {
      const unexpectedError = new Error('Unexpected error')
      mockQueryBuilder.order.mockRejectedValue(unexpectedError)

      const result = await getRecipesFromSupabase()

      expect(result).toEqual([])
      expect(console.error).toHaveBeenCalledWith(
        'fetching recipes from Supabase',
        unexpectedError,
      )
    })

    it('should handle database connection errors', async () => {
      mockSupabaseClient.from.mockImplementation(() => {
        throw new Error('Database connection failed')
      })

      const result = await getRecipesFromSupabase()

      expect(result).toEqual([])
      expect(console.error).toHaveBeenCalledWith(
        'fetching recipes from Supabase',
        expect.any(Error),
      )
    })

    it('should handle timeout errors', async () => {
      const timeoutError = new Error('Request timeout')
      mockQueryBuilder.order.mockRejectedValue(timeoutError)

      const result = await getRecipesFromSupabase()

      expect(result).toEqual([])
      expect(console.error).toHaveBeenCalledWith(
        'fetching recipes from Supabase',
        timeoutError,
      )
    })
  })

  describe('edge cases', () => {
    it('should handle null data from database', async () => {
      mockQueryBuilder.order.mockResolvedValue({
        data: null,
        error: null,
      })
      ;(objectToCamel as jest.Mock).mockImplementation(() => [])

      const result = await getRecipesFromSupabase()

      expect(result).toEqual([])
    })

    it('should handle recipes with missing fields', async () => {
      const incompleteRecipes = [
        {
          id: '789',
          user_id: 'user789',
          title: 'Minimal Recipe',
          is_public: true,
          created_at: '2024-01-03T00:00:00Z',
        },
      ]
      mockQueryBuilder.order.mockResolvedValue({
        data: incompleteRecipes,
        error: null,
      })

      const result = await getRecipesFromSupabase()

      expect(objectToCamel).toHaveBeenCalledWith(incompleteRecipes)
      expect(result).toBeDefined()
    })

    it('should handle malformed data', async () => {
      const malformedData = { not: 'an array' }
      mockQueryBuilder.order.mockResolvedValue({
        data: malformedData,
        error: null,
      })
      ;(objectToCamel as jest.Mock).mockImplementation((data) => data)
      ;(isValidOf as unknown as jest.Mock).mockReturnValue(false)

      const result = await getRecipesFromSupabase()

      expect(result).toEqual([])
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

      const result = await getRecipesFromSupabase()

      expect(result).toHaveLength(2)
      expect(result[0].createdAt).toBe('2024-01-03T00:00:00Z')
      expect(result[1].createdAt).toBe('2024-01-02T00:00:00Z')
    })
  })
})
