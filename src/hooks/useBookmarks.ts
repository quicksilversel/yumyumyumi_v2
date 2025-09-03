import { useEffect, useState, useCallback } from 'react'

import type { BookmarkedRecipe } from '@/types'

import {
  getBookmarks,
  isBookmarked,
  toggleBookmark,
  getBookmarkedRecipeIds,
} from '@/lib/supabase/supabaseBookmarkService'

interface UseBookmarksOptions {
  recipeId?: string
  onToggle?: () => void
}

export function useBookmarks(options: UseBookmarksOptions = {}) {
  const [bookmarks, setBookmarks] = useState<BookmarkedRecipe[]>([])
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set())
  const [isBookmarkedState, setIsBookmarkedState] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch bookmarks on mount and when they change
  const fetchBookmarks = useCallback(async () => {
    try {
      setIsLoading(true)
      const [bookmarksList, bookmarkedIdsSet] = await Promise.all([
        getBookmarks(),
        getBookmarkedRecipeIds(),
      ])

      setBookmarks(bookmarksList)
      setBookmarkedIds(bookmarkedIdsSet)

      if (options.recipeId) {
        setIsBookmarkedState(bookmarkedIdsSet.has(options.recipeId))
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching bookmarks:', error)
    } finally {
      setIsLoading(false)
    }
  }, [options.recipeId])

  // Check if specific recipe is bookmarked
  const checkBookmarkStatus = useCallback(async () => {
    if (!options.recipeId) return

    try {
      const bookmarked = await isBookmarked(options.recipeId)
      setIsBookmarkedState(bookmarked)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error checking bookmark status:', error)
    }
  }, [options.recipeId])

  useEffect(() => {
    fetchBookmarks()

    // Listen for bookmark changes from other components
    const handleBookmarksChange = (event: CustomEvent<BookmarkedRecipe[]>) => {
      setBookmarks(event.detail)
      const newBookmarkedIds = new Set(event.detail.map((b) => b.recipeId))
      setBookmarkedIds(newBookmarkedIds)

      if (options.recipeId) {
        setIsBookmarkedState(newBookmarkedIds.has(options.recipeId))
      }
    }

    window.addEventListener(
      'bookmarksChanged',
      handleBookmarksChange as EventListener,
    )

    return () => {
      window.removeEventListener(
        'bookmarksChanged',
        handleBookmarksChange as EventListener,
      )
    }
  }, [fetchBookmarks, options.recipeId])

  const handleToggleBookmark = useCallback(
    async (e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault()
        e.stopPropagation()
      }

      if (!options.recipeId) {
        console.warn('Cannot toggle bookmark without recipeId')
        return
      }

      try {
        setIsLoading(true)
        const newState = await toggleBookmark(options.recipeId)
        setIsBookmarkedState(newState)

        // Refresh bookmarks list
        await fetchBookmarks()

        options.onToggle?.()
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error toggling bookmark:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [options, fetchBookmarks],
  )

  return {
    bookmarks,
    bookmarkedIds,
    isBookmarked: isBookmarkedState,
    toggleBookmark: handleToggleBookmark,
    refreshBookmarks: fetchBookmarks,
    isLoading,
  }
}
