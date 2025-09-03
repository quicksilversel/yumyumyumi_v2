/* eslint-disable no-console */
import { deleteRecipe } from './deleteRecipe'

import { getSupabaseClient } from '../../../getSupabaseClient'

jest.mock('../../../getSupabaseClient')

describe('deleteRecipe', () => {
  const mockSupabaseClient = {
    from: jest.fn(),
    auth: {
      getUser: jest.fn(),
    },
  }

  const mockQueryBuilder = {
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
  }

  const mockUser = {
    id: 'user123',
    email: 'test@example.com',
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getSupabaseClient as jest.Mock).mockReturnValue(mockSupabaseClient)
    mockSupabaseClient.from.mockReturnValue(mockQueryBuilder)
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('successful deletion', () => {
    it('should delete a recipe and return true when user is authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
      mockQueryBuilder.eq
        .mockReturnValueOnce(mockQueryBuilder)
        .mockResolvedValue({
          error: null,
        })

      const result = await deleteRecipe('recipe123')

      expect(getSupabaseClient).toHaveBeenCalled()
      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled()
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('recipes')
      expect(mockQueryBuilder.delete).toHaveBeenCalled()
      expect(mockQueryBuilder.eq).toHaveBeenNthCalledWith(1, 'id', 'recipe123')
      expect(mockQueryBuilder.eq).toHaveBeenNthCalledWith(
        2,
        'user_id',
        'user123',
      )
      expect(result).toBe(true)
    })
  })

  describe('authentication failures', () => {
    it('should return false when user is not authenticated', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      const result = await deleteRecipe('recipe123')

      expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled()
      expect(mockSupabaseClient.from).not.toHaveBeenCalled()
      expect(console.error).toHaveBeenCalledWith(
        'User must be logged in to delete recipes',
      )
      expect(result).toBe(false)
    })

    it('should return false when auth check fails', async () => {
      const authError = new Error('Auth error')
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: null },
        error: authError,
      })

      const result = await deleteRecipe('recipe123')

      expect(result).toBe(false)
      expect(console.error).toHaveBeenCalledWith(
        'User must be logged in to delete recipes',
      )
    })
  })

  describe('error handling', () => {
    it('should return false and log error when delete operation fails', async () => {
      const deleteError = new Error('Delete failed')
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
      mockQueryBuilder.eq
        .mockReturnValueOnce(mockQueryBuilder)
        .mockResolvedValue({
          error: deleteError,
        })

      const result = await deleteRecipe('recipe123')

      expect(result).toBe(false)
      expect(console.error).toHaveBeenCalledWith('deleting recipe', deleteError)
    })

    it('should return false when an exception occurs', async () => {
      const unexpectedError = new Error('Unexpected error')
      mockSupabaseClient.auth.getUser.mockRejectedValue(unexpectedError)

      const result = await deleteRecipe('recipe123')

      expect(result).toBe(false)
      expect(console.error).toHaveBeenCalledWith(
        'deleting recipe',
        unexpectedError,
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

      const result = await deleteRecipe('recipe123')

      expect(result).toBe(false)
      expect(console.error).toHaveBeenCalledWith(
        'deleting recipe',
        expect.any(Error),
      )
    })
  })

  describe('edge cases', () => {
    it('should handle empty recipe ID', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
      mockQueryBuilder.eq
        .mockReturnValueOnce(mockQueryBuilder)
        .mockResolvedValue({
          error: null,
        })

      const result = await deleteRecipe('')

      expect(mockQueryBuilder.eq).toHaveBeenNthCalledWith(1, 'id', '')
      expect(result).toBe(true)
    })

    it('should handle special characters in recipe ID', async () => {
      mockSupabaseClient.auth.getUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
      mockQueryBuilder.eq
        .mockReturnValueOnce(mockQueryBuilder)
        .mockResolvedValue({
          error: null,
        })

      const specialId = 'recipe!@#$%^&*()'
      const result = await deleteRecipe(specialId)

      expect(mockQueryBuilder.eq).toHaveBeenNthCalledWith(1, 'id', specialId)
      expect(result).toBe(true)
    })
  })
})
