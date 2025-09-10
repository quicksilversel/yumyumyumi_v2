import { objectToCamel, objectToSnake } from 'ts-case-convert'

import type { Recipe, RecipeForm } from '@/types/recipe'

import { isValidOf } from '@/lib/functions/isValidOf'

import { updateRecipe } from './updateRecipe'

import { getSupabaseClient } from '../../../getSupabaseClient'

jest.mock('../../../getSupabaseClient')
jest.mock('@/lib/functions/isValidOf')
jest.mock('ts-case-convert')

describe('updateRecipe', () => {
  const mockSupabaseClient = {
    from: jest.fn(),
    auth: {
      getUser: jest.fn(),
    },
  }

  const mockQueryBuilder = {
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn(),
  }

  const mockUser = {
    id: 'user123',
    email: 'test@example.com',
  }

  const mockRecipeUpdates: RecipeForm = {
    title: 'Updated Recipe',
    summary: 'An updated test recipe',
    ingredients: [
      { name: 'Updated Ingredient', amount: '2 cups', isSpice: true },
    ],
    directions: [{ title: 'Updated Step', description: 'Do something else' }],
    tags: ['updated', 'test'],
    tips: 'Updated tips',
    cookTime: 45,
    servings: 6,
    imageUrl: 'https://example.com/updated.jpg',
    source: 'https://example.com/updated',
    isPublic: false,
  }

  const mockDbRecipe = {
    id: '123',
    user_id: 'user123',
    title: 'Updated Recipe',
    summary: 'An updated test recipe',
    ingredients: [
      { name: 'Updated Ingredient', amount: '2 cups', isSpice: true },
    ],
    directions: [{ title: 'Updated Step', description: 'Do something else' }],
    tags: ['updated', 'test'],
    tips: 'Updated tips',
    cook_time: 45,
    servings: 6,
    image_url: 'https://example.com/updated.jpg',
    source: 'https://example.com/updated',
    is_public: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  }

  const mockUpdatedRecipe: Recipe = {
    id: '123',
    userId: 'user123',
    title: 'Updated Recipe',
    summary: 'An updated test recipe',
    ingredients: [
      { name: 'Updated Ingredient', amount: '2 cups', isSpice: true },
    ],
    directions: [{ title: 'Updated Step', description: 'Do something else' }],
    tags: ['updated', 'test'],
    tips: 'Updated tips',
    cookTime: 45,
    servings: 6,
    imageUrl: 'https://example.com/updated.jpg',
    source: 'https://example.com/updated',
    isPublic: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getSupabaseClient as jest.Mock).mockReturnValue(mockSupabaseClient)
    ;(objectToSnake as jest.Mock).mockImplementation((obj) => ({
      ...obj,
      cook_time: obj.cookTime,
      image_url: obj.imageUrl,
      is_public: obj.isPublic,
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

  describe('successful update', () => {
    it('should update a recipe and return the updated recipe', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
      mockQueryBuilder.single.mockResolvedValue({
        data: mockDbRecipe,
        error: null,
      })

      const result = await updateRecipe('123', mockRecipeUpdates)

      expect(getSupabaseClient).toHaveBeenCalled()
      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled()
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('recipes')
      expect(mockQueryBuilder.update).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Updated Recipe',
          cook_time: 45,
        }),
      )
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('id', '123')
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('user_id', 'user123')
      expect(mockQueryBuilder.select).toHaveBeenCalled()
      expect(mockQueryBuilder.single).toHaveBeenCalled()
      expect(objectToSnake).toHaveBeenCalledWith(mockRecipeUpdates)
      expect(objectToCamel).toHaveBeenCalledWith(mockDbRecipe)
      expect(isValidOf).toHaveBeenCalled()
      expect(result).toEqual(mockUpdatedRecipe)
    })

    it('should return null when data is null', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
      mockQueryBuilder.single.mockResolvedValue({
        data: null,
        error: null,
      })

      const result = await updateRecipe('123', mockRecipeUpdates)

      expect(result).toBeNull()
    })

    it('should return null when validation fails', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
      mockQueryBuilder.single.mockResolvedValue({
        data: mockDbRecipe,
        error: null,
      })
      ;(isValidOf as unknown as jest.Mock).mockReturnValue(false)

      const result = await updateRecipe('123', mockRecipeUpdates)

      expect(isValidOf).toHaveBeenCalled()
      expect(result).toBeNull()
    })
  })

  describe('authentication failures', () => {
    it('should return null when user is not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const result = await updateRecipe('123', mockRecipeUpdates)

      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled()
      expect(mockSupabaseClient.from).not.toHaveBeenCalled()
      expect(global.alert).toHaveBeenCalledWith('ログインが必要です')
      expect(result).toBeNull()
    })

    it('should return null when auth check fails', async () => {
      const authError = new Error('Auth error')
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: authError,
      })

      const result = await updateRecipe('123', mockRecipeUpdates)

      expect(result).toBeNull()
      expect(global.alert).toHaveBeenCalledWith('ログインが必要です')
    })
  })

  describe('error handling', () => {
    it('should return null and log error when update operation fails', async () => {
      const updateError = new Error('Update failed')
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
      mockQueryBuilder.single.mockResolvedValue({
        data: null,
        error: updateError,
      })

      const result = await updateRecipe('123', mockRecipeUpdates)

      expect(result).toBeNull()
      expect(global.alert).toHaveBeenCalledWith(
        'ご迷惑をお掛けし申し訳ありません。\n時間をおいて再度お試しください。',
      )
    })

    it('should return null when an exception occurs', async () => {
      const unexpectedError = new Error('Unexpected error')
      mockSupabaseClient.auth.getUser.mockRejectedValue(unexpectedError)

      const result = await updateRecipe('123', mockRecipeUpdates)

      expect(result).toBeNull()
      expect(global.alert).toHaveBeenCalledWith(
        'ご迷惑をお掛けし申し訳ありません。\n時間をおいて再度お試しください。',
      )
    })

    it('should handle database connection errors', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
      mockSupabaseClient.from.mockImplementation(() => {
        throw new Error('Database connection failed')
      })

      const result = await updateRecipe('123', mockRecipeUpdates)

      expect(result).toBeNull()
      expect(global.alert).toHaveBeenCalledWith(
        'ご迷惑をお掛けし申し訳ありません。\n時間をおいて再度お試しください。',
      )
    })
  })

  describe('edge cases', () => {
    it('should handle partial updates', async () => {
      const partialUpdates: RecipeForm = {
        title: 'Only Title Updated',
        summary: '',
        ingredients: [],
        directions: [],
        tags: [],
        tips: '',
        cookTime: 0,
        servings: 0,
        imageUrl: '',
        source: '',
        isPublic: true,
      }

      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
      mockQueryBuilder.single.mockResolvedValue({
        data: mockDbRecipe,
        error: null,
      })

      const result = await updateRecipe('123', partialUpdates)

      expect(mockQueryBuilder.update).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Only Title Updated',
        }),
      )
      expect(result).toEqual(mockUpdatedRecipe)
    })

    it('should handle empty recipe ID', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
      mockQueryBuilder.single.mockResolvedValue({
        data: mockDbRecipe,
        error: null,
      })

      const result = await updateRecipe('', mockRecipeUpdates)

      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('id', '')
      expect(result).toEqual(mockUpdatedRecipe)
    })

    it('should handle special characters in recipe ID', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
      mockQueryBuilder.single.mockResolvedValue({
        data: mockDbRecipe,
        error: null,
      })

      const specialId = 'recipe!@#$%^&*()'
      const result = await updateRecipe(specialId, mockRecipeUpdates)

      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('id', specialId)
      expect(result).toEqual(mockUpdatedRecipe)
    })
  })
})
