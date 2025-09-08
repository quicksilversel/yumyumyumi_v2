/* eslint-disable no-console */
import { objectToCamel } from 'ts-case-convert'

import type { Recipe } from '@/types/recipe'

import { getAllTagsFromRecipes } from './getAllTagsFromRecipes'

import { getSupabaseClient } from '../../../getSupabaseClient'

jest.mock('../../../getSupabaseClient')
jest.mock('ts-case-convert')

describe('getAllTagsFromRecipes', () => {
  const mockSupabaseClient = {
    from: jest.fn(),
  }

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn(),
  }

  const mockDbRecipes = [
    {
      tags: ['italian', 'pasta', 'dinner'],
    },
    {
      tags: ['healthy', 'salad', 'lunch'],
    },
    {
      tags: ['italian', 'pizza', 'dinner'],
    },
    {
      tags: ['dessert', 'chocolate'],
    },
    {
      tags: null,
    },
    {
      tags: [],
    },
    {
      tags: ['breakfast', 'healthy'],
    },
  ]

  const mockCamelCaseRecipes: Pick<Recipe, 'tags'>[] = [
    {
      tags: ['italian', 'pasta', 'dinner'],
    },
    {
      tags: ['healthy', 'salad', 'lunch'],
    },
    {
      tags: ['italian', 'pizza', 'dinner'],
    },
    {
      tags: ['dessert', 'chocolate'],
    },
    {
      tags: null as any,
    },
    {
      tags: [],
    },
    {
      tags: ['breakfast', 'healthy'],
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getSupabaseClient as jest.Mock).mockReturnValue(mockSupabaseClient)
    ;(objectToCamel as jest.Mock).mockImplementation(
      (data) => mockCamelCaseRecipes,
    )

    mockSupabaseClient.from.mockReturnValue(mockQueryBuilder)

    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('successful fetching', () => {
    it('should fetch and return unique sorted tags', async () => {
      mockQueryBuilder.eq.mockResolvedValue({
        data: mockDbRecipes,
        error: null,
      })

      const result = await getAllTagsFromRecipes()

      expect(getSupabaseClient).toHaveBeenCalled()
      expect(mockSupabaseClient.from).toHaveBeenCalledWith('recipes')
      expect(mockQueryBuilder.select).toHaveBeenCalledWith('tags')
      expect(mockQueryBuilder.eq).toHaveBeenCalledWith('is_public', true)
      expect(objectToCamel).toHaveBeenCalledWith(mockDbRecipes)

      // Should return unique tags in alphabetical order
      expect(result).toEqual([
        'breakfast',
        'chocolate',
        'dessert',
        'dinner',
        'healthy',
        'italian',
        'lunch',
        'pasta',
        'pizza',
        'salad',
      ])
    })

    it('should handle recipes with no tags', async () => {
      const recipesWithNoTags = [
        { tags: null },
        { tags: [] },
        { tags: undefined },
      ]

      mockQueryBuilder.eq.mockResolvedValue({
        data: recipesWithNoTags,
        error: null,
      })
      ;(objectToCamel as jest.Mock).mockImplementation(() => [
        { tags: null },
        { tags: [] },
        { tags: undefined },
      ])

      const result = await getAllTagsFromRecipes()

      expect(result).toEqual([])
    })

    it('should handle empty recipe list', async () => {
      mockQueryBuilder.eq.mockResolvedValue({
        data: [],
        error: null,
      })
      ;(objectToCamel as jest.Mock).mockImplementation(() => [])

      const result = await getAllTagsFromRecipes()

      expect(result).toEqual([])
    })

    it('should handle duplicate tags across recipes', async () => {
      const recipesWithDuplicates = [
        { tags: ['italian', 'pasta'] },
        { tags: ['italian', 'pasta'] },
        { tags: ['italian', 'pasta'] },
      ]

      mockQueryBuilder.eq.mockResolvedValue({
        data: recipesWithDuplicates,
        error: null,
      })
      ;(objectToCamel as jest.Mock).mockImplementation(() => [
        { tags: ['italian', 'pasta'] },
        { tags: ['italian', 'pasta'] },
        { tags: ['italian', 'pasta'] },
      ])

      const result = await getAllTagsFromRecipes()

      // Should only return unique tags
      expect(result).toEqual(['italian', 'pasta'])
    })

    it('should handle tags with empty strings', async () => {
      const recipesWithEmptyTags = [
        { tags: ['valid', '', 'another'] },
        { tags: ['', 'tag'] },
      ]

      mockQueryBuilder.eq.mockResolvedValue({
        data: recipesWithEmptyTags,
        error: null,
      })
      ;(objectToCamel as jest.Mock).mockImplementation(() => [
        { tags: ['valid', '', 'another'] },
        { tags: ['', 'tag'] },
      ])

      const result = await getAllTagsFromRecipes()

      // Should filter out empty strings
      expect(result).toEqual(['another', 'tag', 'valid'])
    })

    it('should handle mixed case tags as distinct', async () => {
      const recipesWithMixedCase = [
        { tags: ['Italian', 'ITALIAN', 'italian'] },
        { tags: ['Pasta', 'pasta'] },
      ]

      mockQueryBuilder.eq.mockResolvedValue({
        data: recipesWithMixedCase,
        error: null,
      })
      ;(objectToCamel as jest.Mock).mockImplementation(() => [
        { tags: ['Italian', 'ITALIAN', 'italian'] },
        { tags: ['Pasta', 'pasta'] },
      ])

      const result = await getAllTagsFromRecipes()

      // Should treat different cases as distinct tags
      expect(result).toEqual([
        'ITALIAN',
        'Italian',
        'Pasta',
        'italian',
        'pasta',
      ])
    })

    it('should handle tags with special characters', async () => {
      const recipesWithSpecialChars = [
        { tags: ['gluten-free', 'dairy_free', 'nut free'] },
        { tags: ['30-minute', '5-ingredient'] },
      ]

      mockQueryBuilder.eq.mockResolvedValue({
        data: recipesWithSpecialChars,
        error: null,
      })
      ;(objectToCamel as jest.Mock).mockImplementation(() => [
        { tags: ['gluten-free', 'dairy_free', 'nut free'] },
        { tags: ['30-minute', '5-ingredient'] },
      ])

      const result = await getAllTagsFromRecipes()

      expect(result).toEqual([
        '30-minute',
        '5-ingredient',
        'dairy_free',
        'gluten-free',
        'nut free',
      ])
    })

    it('should handle null data from database', async () => {
      mockQueryBuilder.eq.mockResolvedValue({
        data: null,
        error: null,
      })
      ;(objectToCamel as jest.Mock).mockImplementation(() => null)

      const result = await getAllTagsFromRecipes()

      expect(result).toEqual([])
    })
  })

  describe('error handling', () => {
    it('should return empty array and log error when query fails', async () => {
      const queryError = new Error('Query failed')
      mockQueryBuilder.eq.mockResolvedValue({
        data: null,
        error: queryError,
      })

      const result = await getAllTagsFromRecipes()

      expect(result).toEqual([])
      expect(console.error).toHaveBeenCalledWith(
        'fetching all tags',
        queryError,
      )
    })

    it('should return empty array when an exception occurs', async () => {
      const unexpectedError = new Error('Unexpected error')
      mockQueryBuilder.eq.mockRejectedValue(unexpectedError)

      const result = await getAllTagsFromRecipes()

      expect(result).toEqual([])
      expect(console.error).toHaveBeenCalledWith(
        'fetching all tags',
        unexpectedError,
      )
    })

    it('should handle database connection errors', async () => {
      mockSupabaseClient.from.mockImplementation(() => {
        throw new Error('Database connection failed')
      })

      const result = await getAllTagsFromRecipes()

      expect(result).toEqual([])
      expect(console.error).toHaveBeenCalledWith(
        'fetching all tags',
        expect.any(Error),
      )
    })

    it('should handle objectToCamel errors gracefully', async () => {
      mockQueryBuilder.eq.mockResolvedValue({
        data: mockDbRecipes,
        error: null,
      })
      ;(objectToCamel as jest.Mock).mockImplementation(() => {
        throw new Error('Conversion failed')
      })

      const result = await getAllTagsFromRecipes()

      expect(result).toEqual([])
      expect(console.error).toHaveBeenCalledWith(
        'fetching all tags',
        expect.any(Error),
      )
    })
  })

  describe('edge cases', () => {
    it('should handle very large tag lists', async () => {
      const largeTags = Array.from({ length: 1000 }, (_, i) => `tag${i}`)
      const recipesWithLargeTags = [{ tags: largeTags }]

      mockQueryBuilder.eq.mockResolvedValue({
        data: recipesWithLargeTags,
        error: null,
      })
      ;(objectToCamel as jest.Mock).mockImplementation(() => [
        { tags: largeTags },
      ])

      const result = await getAllTagsFromRecipes()

      expect(result).toHaveLength(1000)
      expect(result[0]).toBe('tag0')
      expect(result[999]).toBe('tag999')
    })

    it('should handle non-array tags property gracefully', async () => {
      mockQueryBuilder.eq.mockResolvedValue({
        data: [
          { tags: 'not-an-array' },
          { tags: 123 },
          { tags: { invalid: 'object' } },
        ],
        error: null,
      })
      ;(objectToCamel as jest.Mock).mockImplementation(() => [
        { tags: 'not-an-array' as any },
        { tags: 123 as any },
        { tags: { invalid: 'object' } as any },
      ])

      const result = await getAllTagsFromRecipes()

      expect(result).toEqual([])
    })

    it('should handle tags with only whitespace', async () => {
      const recipesWithWhitespaceTags = [{ tags: ['  ', '\t', '\n', 'valid'] }]

      mockQueryBuilder.eq.mockResolvedValue({
        data: recipesWithWhitespaceTags,
        error: null,
      })
      ;(objectToCamel as jest.Mock).mockImplementation(() => [
        { tags: ['  ', '\t', '\n', 'valid'] },
      ])

      const result = await getAllTagsFromRecipes()

      // Whitespace-only tags are not filtered out (they have truthy value)
      expect(result).toEqual(['\t', '\n', '  ', 'valid'])
    })

    it('should preserve tag order after sorting', async () => {
      const unsortedTags = [
        { tags: ['zebra', 'apple', 'mango'] },
        { tags: ['banana', 'orange'] },
      ]

      mockQueryBuilder.eq.mockResolvedValue({
        data: unsortedTags,
        error: null,
      })
      ;(objectToCamel as jest.Mock).mockImplementation(() => [
        { tags: ['zebra', 'apple', 'mango'] },
        { tags: ['banana', 'orange'] },
      ])

      const result = await getAllTagsFromRecipes()

      expect(result).toEqual(['apple', 'banana', 'mango', 'orange', 'zebra'])
    })
  })
})
