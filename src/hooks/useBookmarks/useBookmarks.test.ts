import { renderHook, act } from '@testing-library/react'

import { useAuth } from '@/contexts/AuthContext'
import { useBookmarksContext } from '@/contexts/BookmarksContext'

import { useBookmarks } from './useBookmarks'

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

// Mock the contexts
jest.mock('@/contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}))

jest.mock('@/contexts/BookmarksContext', () => ({
  useBookmarksContext: jest.fn(),
}))

describe('useBookmarks', () => {
  const mockUser = { id: 'user123', email: 'test@example.com' }
  const mockBookmarks = [
    { id: '1', recipeId: 'recipe1', userId: 'user123' },
    { id: '2', recipeId: 'recipe2', userId: 'user123' },
  ]
  const mockBookmarkedIds = new Set(['recipe1', 'recipe2'])
  const mockToggleBookmark = jest.fn()
  const mockRefreshBookmarks = jest.fn()

  const mockAuthValue = {
    user: mockUser,
  }

  const mockBookmarksValue = {
    bookmarks: mockBookmarks,
    bookmarkedIds: mockBookmarkedIds,
    isLoading: false,
    toggleBookmark: mockToggleBookmark,
    refreshBookmarks: mockRefreshBookmarks,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    mockPush.mockClear()
    ;(useAuth as jest.Mock).mockReturnValue(mockAuthValue)
    ;(useBookmarksContext as jest.Mock).mockReturnValue(mockBookmarksValue)
  })

  describe('initialization', () => {
    it('should return bookmarks data from context', () => {
      const { result } = renderHook(() => useBookmarks())

      expect(result.current.bookmarks).toEqual(mockBookmarks)
      expect(result.current.bookmarkedIds).toEqual(mockBookmarkedIds)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isToggling).toBe(false)
    })

    it('should check if a recipe is bookmarked', () => {
      const { result } = renderHook(() => useBookmarks({ recipeId: 'recipe1' }))

      expect(result.current.isBookmarked).toBe(true)
    })

    it('should return false for non-bookmarked recipe', () => {
      const { result } = renderHook(() =>
        useBookmarks({ recipeId: 'recipe999' }),
      )

      expect(result.current.isBookmarked).toBe(false)
    })

    it('should return false when no recipeId provided', () => {
      const { result } = renderHook(() => useBookmarks())

      expect(result.current.isBookmarked).toBe(false)
    })
  })

  describe('toggleBookmark', () => {
    it('should toggle bookmark successfully', async () => {
      mockToggleBookmark.mockResolvedValue(undefined)
      const onToggle = jest.fn()

      const { result } = renderHook(() =>
        useBookmarks({ recipeId: 'recipe1', onToggle }),
      )

      await act(async () => {
        await result.current.toggleBookmark()
      })

      expect(mockToggleBookmark).toHaveBeenCalledWith('recipe1')
      expect(onToggle).toHaveBeenCalled()
    })

    it('should handle mouse event properly', async () => {
      const mockEvent = {
        preventDefault: jest.fn(),
        stopPropagation: jest.fn(),
      } as unknown as React.MouseEvent

      const { result } = renderHook(() => useBookmarks({ recipeId: 'recipe1' }))

      await act(async () => {
        await result.current.toggleBookmark(mockEvent)
      })

      expect(mockEvent.preventDefault).toHaveBeenCalled()
      expect(mockEvent.stopPropagation).toHaveBeenCalled()
      expect(mockToggleBookmark).toHaveBeenCalledWith('recipe1')
    })

    it('should warn when no recipeId provided', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      const { result } = renderHook(() => useBookmarks())

      await act(async () => {
        await result.current.toggleBookmark()
      })

      expect(consoleSpy).toHaveBeenCalledWith(
        'Cannot toggle bookmark without recipeId',
      )
      expect(mockToggleBookmark).not.toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('should redirect to login when user is not authenticated', async () => {
      ;(useAuth as jest.Mock).mockReturnValue({ user: null })

      const { result } = renderHook(() => useBookmarks({ recipeId: 'recipe1' }))

      await act(async () => {
        await result.current.toggleBookmark()
      })

      // Verify router.push was called with /login
      expect(mockPush).toHaveBeenCalledWith('/login')

      // Verify bookmark wasn't toggled (user wasn't authenticated)
      expect(mockToggleBookmark).not.toHaveBeenCalled()
    })

    it('should handle toggle error gracefully', async () => {
      const mockError = new Error('Toggle failed')
      mockToggleBookmark.mockRejectedValue(mockError)
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      const { result } = renderHook(() => useBookmarks({ recipeId: 'recipe1' }))

      await act(async () => {
        await result.current.toggleBookmark()
      })

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error toggling bookmark:',
        mockError,
      )

      consoleSpy.mockRestore()
    })

    it('should set isToggling state during operation', async () => {
      let resolveToggle: () => void
      const togglePromise = new Promise<void>((resolve) => {
        resolveToggle = resolve
      })
      mockToggleBookmark.mockReturnValue(togglePromise)

      const { result, rerender } = renderHook(() =>
        useBookmarks({ recipeId: 'recipe1' }),
      )

      expect(result.current.isToggling).toBe(false)

      // Start the toggle operation
      let togglePromiseResult: Promise<void>
      act(() => {
        togglePromiseResult = result.current.toggleBookmark()
      })

      // Force a rerender to check the state
      rerender()
      expect(result.current.isToggling).toBe(true)

      // Resolve the toggle operation
      await act(async () => {
        resolveToggle!()
        await togglePromiseResult!
      })

      expect(result.current.isToggling).toBe(false)
    })
  })

  describe('context integration', () => {
    it('should pass through refreshBookmarks from context', () => {
      const { result } = renderHook(() => useBookmarks())

      result.current.refreshBookmarks()

      expect(mockRefreshBookmarks).toHaveBeenCalled()
    })

    it('should reflect loading state from context', () => {
      ;(useBookmarksContext as jest.Mock).mockReturnValue({
        ...mockBookmarksValue,
        isLoading: true,
      })

      const { result } = renderHook(() => useBookmarks())

      expect(result.current.isLoading).toBe(true)
    })

    it('should update when bookmarkedIds change', () => {
      const { result, rerender } = renderHook(() =>
        useBookmarks({ recipeId: 'recipe3' }),
      )

      expect(result.current.isBookmarked).toBe(false)

      // Update the mock to include recipe3
      const newBookmarkedIds = new Set(['recipe1', 'recipe2', 'recipe3'])
      ;(useBookmarksContext as jest.Mock).mockReturnValue({
        ...mockBookmarksValue,
        bookmarkedIds: newBookmarkedIds,
      })

      rerender()

      expect(result.current.isBookmarked).toBe(true)
    })
  })
})
