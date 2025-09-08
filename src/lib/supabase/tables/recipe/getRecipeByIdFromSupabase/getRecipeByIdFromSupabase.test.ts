/* eslint-disable no-console */
import { objectToCamel } from 'ts-case-convert'

import type { Recipe } from '@/types/recipe'

import { isValidOf } from '@/lib/functions/isValidOf'

import { getRecipeByIdFromSupabase } from './getRecipeByIdFromSupabase'

import { getSupabaseClient } from '../../../getSupabaseClient'

jest.mock('../../../getSupabaseClient')
jest.mock('@/lib/functions/isValidOf')
jest.mock('ts-case-convert')

describe('getRecipeByIdFromSupabase', () => {
  const mockSupabaseClient = {
    from: jest.fn(),
  }

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  }

  const mockDbRecipe = {
    id: '123',
    user_id: 'user123',
    title: 'Test Recipe',
    summary: 'A test recipe',
    ingredients: [{ name: 'Ingredient 1', amount: '1 cup', isSpice: false }],
    directions: [{ title: 'Step 1', description: 'Do something' }],
    tags: ['test', 'recipe'],
    tips: 'Some tips',
    cook_time: 30,
    servings: 4,
    image_url: 'https://example.com/image.jpg',
    source: 'https://example.com',
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  }

  const mockRecipe: Recipe = {
    id: '123',
    userId: 'user123',
    title: 'Test Recipe',
    summary: 'A test recipe',
    ingredients: [{ name: 'Ingredient 1', amount: '1 cup', isSpice: false }],
    directions: [{ title: 'Step 1', description: 'Do something' }],
    tags: ['test', 'recipe'],
    tips: 'Some tips',
    cookTime: 30,
    servings: 4,
    imageUrl: 'https://example.com/image.jpg',
    source: 'https://example.com',
    isPublic: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getSupabaseClient as jest.Mock).mockReturnValue(mockSupabaseClient)
    ;(objectToCamel as jest.Mock).mockImplementation((obj) => {
      if (!obj) return obj
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
    ;(isValidOf as unknown as jest.Mock).mockReturnValue(true)

    mockSupabaseClient.from.mockReturnValue(mockQueryBuilder)
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('successful fetch', () => {
    it('should fetch a recipe by ID and return the recipe', async () => {
      mockQueryBuilder.single.mockResolvedValue({
        data: mockDbRecipe,
        error: null,
      })

      const result = await getRecipeByIdFromSupabase('123')

      expect(getSupabaseClient).toHaveBeenCalled()
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('recipes')
      expect(mockQueryBuilder.select).toHaveBeenCalledWith('*')
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('id', '123')
      expect(mockQueryBuilder.single).toHaveBeenCalled()
      expect(objectToCamel).toHaveBeenCalledWith(mockDbRecipe)
      expect(isValidOf).toHaveBeenCalled()
      expect(result).toEqual(mockRecipe)
    })

    it('should return null when validation fails', async () => {
      mockQueryBuilder.single.mockResolvedValue({
        data: mockDbRecipe,
        error: null,
      })
      ;(isValidOf as unknown as jest.Mock).mockReturnValue(false)

      const result = await getRecipeByIdFromSupabase('123')

      expect(isValidOf).toHaveBeenCalled()
      expect(result).toBeNull()
    })

    it('should handle recipes with minimal data', async () => {
      const minimalDbRecipe = {
        id: '456',
        user_id: 'user456',
        title: 'Minimal Recipe',
        summary: '',
        ingredients: [],
        directions: [],
        tags: [],
        tips: '',
        cook_time: 0,
        servings: 1,
        image_url: '',
        source: '',
        is_public: false,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      }

      mockQueryBuilder.single.mockResolvedValue({
        data: minimalDbRecipe,
        error: null,
      })

      const result = await getRecipeByIdFromSupabase('456')

      expect(result).not.toBeNull()
      expect(objectToCamel).toHaveBeenCalledWith(minimalDbRecipe)
    })
  })

  describe('error handling', () => {
    it('should return null and log error when query fails', async () => {
      const queryError = new Error('Query failed')
      mockQueryBuilder.single.mockResolvedValue({
        data: null,
        error: queryError,
      })

      const result = await getRecipeByIdFromSupabase('123')

      expect(result).toBeNull()
      expect(console.error).toHaveBeenCalledWith(
        'fetching recipe by ID',
        queryError,
      )
    })

    it('should return null when recipe not found', async () => {
      const notFoundError = new Error('Recipe not found')
      mockQueryBuilder.single.mockResolvedValue({
        data: null,
        error: notFoundError,
      })

      const result = await getRecipeByIdFromSupabase('nonexistent')

      expect(result).toBeNull()
      expect(console.error).toHaveBeenCalledWith(
        'fetching recipe by ID',
        notFoundError,
      )
    })

    it('should return null when an exception occurs', async () => {
      const unexpectedError = new Error('Unexpected error')
      mockQueryBuilder.single.mockRejectedValue(unexpectedError)

      const result = await getRecipeByIdFromSupabase('123')

      expect(result).toBeNull()
      expect(console.error).toHaveBeenCalledWith(
        'fetching recipe by ID',
        unexpectedError,
      )
    })

    it('should handle database connection errors', async () => {
      mockSupabaseClient.from.mockImplementation(() => {
        throw new Error('Database connection failed')
      })

      const result = await getRecipeByIdFromSupabase('123')

      expect(result).toBeNull()
      expect(console.error).toHaveBeenCalledWith(
        'fetching recipe by ID',
        expect.any(Error),
      )
    })
  })

  describe('edge cases', () => {
    it('should handle empty recipe ID', async () => {
      mockQueryBuilder.single.mockResolvedValue({
        data: mockDbRecipe,
        error: null,
      })

      const result = await getRecipeByIdFromSupabase('')

      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('id', '')
      expect(result).toEqual(mockRecipe)
    })

    it('should handle special characters in recipe ID', async () => {
      mockQueryBuilder.single.mockResolvedValue({
        data: mockDbRecipe,
        error: null,
      })

      const specialId = 'recipe!@#$%^&*()'
      const result = await getRecipeByIdFromSupabase(specialId)

      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('id', specialId)
      expect(result).toEqual(mockRecipe)
    })

    it('should handle UUID format recipe ID', async () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000'
      mockQueryBuilder.single.mockResolvedValue({
        data: { ...mockDbRecipe, id: uuid },
        error: null,
      })

      const result = await getRecipeByIdFromSupabase(uuid)

      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('id', uuid)
      expect(result).toEqual(expect.objectContaining({ id: uuid }))
    })

    it('should handle null data from database', async () => {
      mockQueryBuilder.single.mockResolvedValue({
        data: null,
        error: null,
      })
      ;(objectToCamel as jest.Mock).mockImplementation(() => null)

      const result = await getRecipeByIdFromSupabase('123')

      expect(result).toBeNull()
    })
  })
})
