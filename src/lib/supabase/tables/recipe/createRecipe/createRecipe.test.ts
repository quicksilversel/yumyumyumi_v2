import { objectToCamel, objectToSnake } from 'ts-case-convert'

import type { Recipe } from '@/types/recipe'

import { isValidOf } from '@/lib/functions/isValidOf'

import { createRecipe } from './createRecipe'

import { getSupabaseClient } from '../../../getSupabaseClient'

jest.mock('../../../getSupabaseClient')
jest.mock('@/lib/functions/isValidOf')
jest.mock('ts-case-convert')

describe('createRecipe', () => {
  const mockSupabaseClient = {
    from: jest.fn(),
  }

  const mockQueryBuilder = {
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn(),
  }

  const mockRecipeInput: Omit<Recipe, 'id'> = {
    userId: 'user123',
    title: 'Test Recipe',
    summary: 'A test recipe',
    ingredients: [{ name: 'Ingredient 1', amount: '1 cup', isSpice: false }],
    directions: [{ title: 'Step 1', description: 'Do something' }],
    tags: ['test', 'recipe'],
    tips: 'Some tips',
    cookTime: 30,
    servings: 4,
    category: 'Main Course',
    imageUrl: 'https://example.com/image.jpg',
    source: 'https://example.com',
    isPublic: true,
    updatedAt: '2024-01-01T00:00:00Z',
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
    category: 'Main Course',
    image_url: 'https://example.com/image.jpg',
    source: 'https://example.com',
    is_public: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  }

  const mockRecipeOutput: Recipe = {
    ...mockRecipeInput,
    id: '123',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getSupabaseClient as jest.Mock).mockReturnValue(mockSupabaseClient)
    ;(objectToSnake as jest.Mock).mockImplementation((obj) => ({
      ...obj,
      user_id: obj.userId,
      cook_time: obj.cookTime,
      image_url: obj.imageUrl,
      is_public: obj.isPublic,
      created_at: obj.createdAt,
      updated_at: obj.updatedAt,
    }))
    ;(objectToCamel as jest.Mock).mockImplementation((obj) => {
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

  describe('successful creation', () => {
    it('should create a recipe and return the created recipe', async () => {
      mockQueryBuilder.single.mockResolvedValue({
        data: mockDbRecipe,
        error: null,
      })

      const result = await createRecipe(mockRecipeInput)

      expect(getSupabaseClient).toHaveBeenCalled()
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('recipes')
      expect(mockQueryBuilder.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'user123',
          title: 'Test Recipe',
        }),
      )
      expect(mockQueryBuilder.select).toHaveBeenCalled()
      expect(mockQueryBuilder.single).toHaveBeenCalled()
      expect(objectToSnake).toHaveBeenCalledWith(mockRecipeInput)
      expect(objectToCamel).toHaveBeenCalledWith(mockDbRecipe)
      expect(isValidOf).toHaveBeenCalled()
      expect(result).toEqual(mockRecipeOutput)
    })

    it('should return null when data is null', async () => {
      mockQueryBuilder.single.mockResolvedValue({
        data: null,
        error: null,
      })

      const result = await createRecipe(mockRecipeInput)

      expect(result).toBeNull()
    })

    it('should return null when validation fails', async () => {
      mockQueryBuilder.single.mockResolvedValue({
        data: mockDbRecipe,
        error: null,
      })
      ;(isValidOf as unknown as jest.Mock).mockReturnValue(false)

      const result = await createRecipe(mockRecipeInput)

      expect(isValidOf).toHaveBeenCalled()
      expect(result).toBeNull()
    })
  })

  describe('error handling', () => {
    it('should return null and log error when Supabase throws an error', async () => {
      const mockError = new Error('Database error')
      mockQueryBuilder.single.mockResolvedValue({
        data: null,
        error: mockError,
      })

      const result = await createRecipe(mockRecipeInput)

      expect(result).toBeNull()
      // eslint-disable-next-line no-console
      expect(console.error).toHaveBeenCalledWith('creating recipe', mockError)
    })

    it('should return null and log error when an exception occurs', async () => {
      const mockError = new Error('Unexpected error')
      mockQueryBuilder.single.mockRejectedValue(mockError)

      const result = await createRecipe(mockRecipeInput)

      expect(result).toBeNull()
      // eslint-disable-next-line no-console
      expect(console.error).toHaveBeenCalledWith('creating recipe', mockError)
    })
  })
})
