import { ReactNode } from 'react'

import {
  renderHook,
  act,
  waitFor,
  render,
  screen,
} from '@testing-library/react'

import type { Bookmark } from '@/types/bookmarks'
import type { User } from '@supabase/supabase-js'

import { useAuth } from '@/contexts/AuthContext'
import {
  getBookmarks,
  getBookmarkedRecipeIds,
  toggleBookmark as toggleBookmarkApi,
} from '@/lib/supabase/tables/bookmarks'

import { BookmarksProvider, useBookmarksContext } from './BookmarksContext'

// Mock Next.js navigation
const mockPush = jest.fn()
const mockRouter = {
  push: mockPush,
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
}

jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

// Mock the auth context
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}))

// Mock the bookmarks API functions
jest.mock('@/lib/supabase/tables/bookmarks', () => ({
  getBookmarks: jest.fn(),
  getBookmarkedRecipeIds: jest.fn(),
  toggleBookmark: jest.fn(),
}))

describe('BookmarksContext', () => {
  const mockUser: User = {
    id: 'user123',
    email: 'test@example.com',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: '2024-01-01T00:00:00Z',
  } as User

  const mockBookmarks: Partial<Bookmark>[] = [
    { id: '1', recipeId: 'recipe1', userId: 'user123' },
    { id: '2', recipeId: 'recipe2', userId: 'user123' },
  ]

  const mockBookmarkedIds = new Set(['recipe1', 'recipe2'])

  const wrapper = ({ children }: { children: ReactNode }) => (
    <BookmarksProvider>{children}</BookmarksProvider>
  )

  beforeEach(() => {
    jest.clearAllMocks()
    mockPush.mockClear()
    ;(useAuth as jest.Mock).mockReturnValue({ user: mockUser })
    ;(getBookmarks as jest.Mock).mockResolvedValue(mockBookmarks)
    ;(getBookmarkedRecipeIds as jest.Mock).mockResolvedValue(mockBookmarkedIds)
  })

  describe('useBookmarksContext', () => {
    it('should throw error when used outside BookmarksProvider', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation()

      expect(() => {
        renderHook(() => useBookmarksContext())
      }).toThrow('useBookmarksContext must be used within a BookmarksProvider')

      consoleError.mockRestore()
    })

    it('should provide initial context values', async () => {
      const { result } = renderHook(() => useBookmarksContext(), { wrapper })

      // Initially loading
      expect(result.current.isLoading).toBe(true)
      expect(result.current.bookmarks).toEqual([])
      expect(result.current.bookmarkedIds).toEqual(new Set())

      // Wait for bookmarks to load
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })
  })

  describe('initialization', () => {
    it('should load bookmarks on mount when user is authenticated', async () => {
      const { result } = renderHook(() => useBookmarksContext(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
        expect(result.current.bookmarks).toEqual(mockBookmarks)
        expect(result.current.bookmarkedIds).toEqual(mockBookmarkedIds)
      })

      expect(getBookmarks).toHaveBeenCalledWith('user123')
      expect(getBookmarkedRecipeIds).toHaveBeenCalledWith('user123')
    })

    it('should handle no user (unauthenticated)', async () => {
      ;(useAuth as jest.Mock).mockReturnValue({ user: null })

      const { result } = renderHook(() => useBookmarksContext(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
        expect(result.current.bookmarks).toEqual([])
        expect(result.current.bookmarkedIds).toEqual(new Set())
      })

      expect(getBookmarks).not.toHaveBeenCalled()
      expect(getBookmarkedRecipeIds).not.toHaveBeenCalled()
    })

    it('should handle API errors gracefully', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation()
      const error = new Error('API Error')
      ;(getBookmarks as jest.Mock).mockRejectedValue(error)

      const { result } = renderHook(() => useBookmarksContext(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(consoleError).toHaveBeenCalledWith(
        'Error fetching bookmarks:',
        error,
      )

      consoleError.mockRestore()
    })

    it('should fetch bookmarks only once unless forced', async () => {
      const { result, rerender } = renderHook(() => useBookmarksContext(), {
        wrapper,
      })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(getBookmarks).toHaveBeenCalledTimes(1)

      // Rerender should not fetch again
      rerender()

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(getBookmarks).toHaveBeenCalledTimes(1)
    })
  })

  describe('toggleBookmark', () => {
    it('should toggle bookmark on when not bookmarked', async () => {
      ;(toggleBookmarkApi as jest.Mock).mockResolvedValue(true)

      const { result } = renderHook(() => useBookmarksContext(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      let toggleResult: boolean
      await act(async () => {
        toggleResult = await result.current.toggleBookmark('recipe3')
      })

      expect(toggleResult!).toBe(true)
      expect(toggleBookmarkApi).toHaveBeenCalledWith('recipe3', 'user123')
      expect(result.current.bookmarkedIds.has('recipe3')).toBe(true)
    })

    it('should toggle bookmark off when bookmarked', async () => {
      ;(toggleBookmarkApi as jest.Mock).mockResolvedValue(false)

      const { result } = renderHook(() => useBookmarksContext(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      let toggleResult: boolean
      await act(async () => {
        toggleResult = await result.current.toggleBookmark('recipe1')
      })

      expect(toggleResult!).toBe(false)
      expect(toggleBookmarkApi).toHaveBeenCalledWith('recipe1', 'user123')
      expect(result.current.bookmarkedIds.has('recipe1')).toBe(false)
    })

    it('should redirect to login when user is not authenticated', async () => {
      ;(useAuth as jest.Mock).mockReturnValue({ user: null })

      const { result } = renderHook(() => useBookmarksContext(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      let toggleResult: boolean
      await act(async () => {
        toggleResult = await result.current.toggleBookmark('recipe1')
      })

      expect(toggleResult!).toBe(false)
      expect(mockPush).toHaveBeenCalledWith('/login')
      expect(toggleBookmarkApi).not.toHaveBeenCalled()
    })

    it('should handle optimistic updates and revert on mismatch', async () => {
      // API returns true (bookmarked) when we expected false (unbookmarked)
      ;(toggleBookmarkApi as jest.Mock).mockResolvedValue(true)

      const { result } = renderHook(() => useBookmarksContext(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      // Try to unbookmark recipe1
      await act(async () => {
        await result.current.toggleBookmark('recipe1')
      })

      // Should revert to bookmarked state since API returned true
      expect(result.current.bookmarkedIds.has('recipe1')).toBe(true)
    })

    it('should handle toggle errors and revert state', async () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation()
      const error = new Error('Toggle failed')
      ;(toggleBookmarkApi as jest.Mock).mockRejectedValue(error)

      const { result } = renderHook(() => useBookmarksContext(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const initialIds = new Set(result.current.bookmarkedIds)

      let toggleResult: boolean
      await act(async () => {
        toggleResult = await result.current.toggleBookmark('recipe1')
      })

      expect(toggleResult!).toBe(false)
      expect(consoleError).toHaveBeenCalledWith(
        'Error toggling bookmark:',
        error,
      )
      // State should be reverted
      expect(result.current.bookmarkedIds).toEqual(initialIds)

      consoleError.mockRestore()
    })
  })

  describe('refreshBookmarks', () => {
    it('should force fetch bookmarks even if already fetched', async () => {
      const { result } = renderHook(() => useBookmarksContext(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      expect(getBookmarks).toHaveBeenCalledTimes(1)

      // Update the mock to return different data
      const newBookmarks = [{ id: '3', recipeId: 'recipe3', userId: 'user123' }]
      const newIds = new Set(['recipe3'])
      ;(getBookmarks as jest.Mock).mockResolvedValue(newBookmarks)
      ;(getBookmarkedRecipeIds as jest.Mock).mockResolvedValue(newIds)

      await act(async () => {
        await result.current.refreshBookmarks()
      })

      expect(getBookmarks).toHaveBeenCalledTimes(2)
      expect(result.current.bookmarks).toEqual(newBookmarks)
      expect(result.current.bookmarkedIds).toEqual(newIds)
    })
  })

  describe('Provider integration', () => {
    it('should provide bookmarks context to children', async () => {
      const TestComponent = () => {
        const { bookmarks, isLoading } = useBookmarksContext()
        return (
          <div>
            <span data-testid="loading">{String(isLoading)}</span>
            <span data-testid="count">{bookmarks.length}</span>
          </div>
        )
      }

      render(
        <BookmarksProvider>
          <TestComponent />
        </BookmarksProvider>,
      )

      expect(screen.getByTestId('loading')).toHaveTextContent('true')

      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false')
        expect(screen.getByTestId('count')).toHaveTextContent('2')
      })
    })

    it('should share bookmark state between multiple consumers', async () => {
      const Consumer1 = () => {
        const { bookmarkedIds, toggleBookmark } = useBookmarksContext()
        return (
          <div>
            <span data-testid="consumer1">
              {bookmarkedIds.has('recipe3') ? 'bookmarked' : 'not-bookmarked'}
            </span>
            <button onClick={() => toggleBookmark('recipe3')}>Toggle</button>
          </div>
        )
      }

      const Consumer2 = () => {
        const { bookmarkedIds } = useBookmarksContext()
        return (
          <span data-testid="consumer2">
            {bookmarkedIds.has('recipe3') ? 'bookmarked' : 'not-bookmarked'}
          </span>
        )
      }

      ;(toggleBookmarkApi as jest.Mock).mockResolvedValue(true)

      const { getByText, getByTestId } = render(
        <BookmarksProvider>
          <Consumer1 />
          <Consumer2 />
        </BookmarksProvider>,
      )

      await waitFor(() => {
        expect(getByTestId('consumer1')).toHaveTextContent('not-bookmarked')
        expect(getByTestId('consumer2')).toHaveTextContent('not-bookmarked')
      })

      // Toggle bookmark in Consumer1
      await act(async () => {
        getByText('Toggle').click()
      })

      // Both consumers should see the updated state
      expect(getByTestId('consumer1')).toHaveTextContent('bookmarked')
      expect(getByTestId('consumer2')).toHaveTextContent('bookmarked')
    })
  })

  describe('loading states', () => {
    it('should manage loading state during initial fetch', async () => {
      const { result } = renderHook(() => useBookmarksContext(), { wrapper })

      expect(result.current.isLoading).toBe(true)

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })
    })

    it('should not show loading state during toggle', async () => {
      ;(toggleBookmarkApi as jest.Mock).mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(true), 100)),
      )

      const { result } = renderHook(() => useBookmarksContext(), { wrapper })

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false)
      })

      const loadingBeforeToggle = result.current.isLoading

      act(() => {
        result.current.toggleBookmark('recipe3')
      })

      // Loading state should not change during toggle
      expect(result.current.isLoading).toBe(loadingBeforeToggle)
    })
  })
})
