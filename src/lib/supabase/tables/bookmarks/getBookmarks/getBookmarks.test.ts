import { objectToCamel } from 'ts-case-convert'

import type { BookmarkList } from '@/types/bookmarks'

import { isValidOf } from '@/lib/functions/isValidOf'

import { getBookmarks } from './getBookmarks'

import { getSupabaseClient } from '../../../getSupabaseClient'

jest.mock('../../../getSupabaseClient')
jest.mock('ts-case-convert')
jest.mock('@/lib/functions/isValidOf')

describe('getBookmarks', () => {
  const mockSupabaseClient = {
    auth: {
      getUser: jest.fn(),
    },
    from: jest.fn(),
  }

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn(),
  }

  const mockUser = {
    id: 'user123',
    email: 'test@example.com',
  }

  const mockDbBookmarks = [
    {
      id: 'bookmark1',
      user_id: 'user123',
      recipe_id: 'recipe123',
      created_at: '2024-01-02T00:00:00Z',
    },
    {
      id: 'bookmark2',
      user_id: 'user123',
      recipe_id: 'recipe456',
      created_at: '2024-01-01T00:00:00Z',
    },
  ]

  const mockCamelBookmarks: BookmarkList = [
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
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(getSupabaseClient as jest.Mock).mockReturnValue(mockSupabaseClient)
    ;(objectToCamel as jest.Mock).mockImplementation((data) => data)
    ;(isValidOf as unknown as jest.Mock).mockReturnValue(true)

    mockSupabaseClient.from.mockReturnValue(mockQueryBuilder)
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })
  })

  it('should return bookmarks for authenticated user', async () => {
    mockQueryBuilder.order.mockResolvedValue({
      data: mockDbBookmarks,
      error: null,
    })
    ;(objectToCamel as jest.Mock).mockReturnValue(mockCamelBookmarks)

    const result = await getBookmarks()

    expect(mockSupabaseClient.auth.getUser).toHaveBeenCalled()
    expect(mockSupabaseClient.from).toHaveBeenCalledWith('bookmarks')
    expect(mockQueryBuilder.select).toHaveBeenCalledWith('*')
    expect(mockQueryBuilder.eq).toHaveBeenCalledWith('user_id', 'user123')
    expect(mockQueryBuilder.order).toHaveBeenCalledWith('created_at', {
      ascending: false,
    })
    expect(result).toEqual(mockCamelBookmarks)
  })

  it('should return empty array when user is not authenticated', async () => {
    mockSupabaseClient.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    const result = await getBookmarks()

    expect(result).toEqual([])
    expect(mockSupabaseClient.from).not.toHaveBeenCalled()
  })

  it('should return empty array when data is invalid', async () => {
    mockQueryBuilder.order.mockResolvedValue({
      data: mockDbBookmarks,
      error: null,
    })
    ;(isValidOf as unknown as jest.Mock).mockReturnValue(false)

    const result = await getBookmarks()

    expect(result).toEqual([])
  })

  it('should handle database errors gracefully', async () => {
    const mockError = new Error('Database error')
    mockQueryBuilder.order.mockResolvedValue({
      data: null,
      error: mockError,
    })

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const result = await getBookmarks()

    expect(result).toEqual([])
    expect(consoleSpy).toHaveBeenCalledWith('fetching bookmarks', mockError)

    consoleSpy.mockRestore()
  })

  it('should handle auth errors gracefully', async () => {
    mockSupabaseClient.auth.getUser.mockRejectedValue(new Error('Auth error'))

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const result = await getBookmarks()

    expect(result).toEqual([])
    expect(consoleSpy).toHaveBeenCalledWith(
      'fetching bookmarks',
      expect.any(Error),
    )

    consoleSpy.mockRestore()
  })
})
