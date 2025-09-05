import { useEffect, useState, useCallback } from 'react'

import type { Bookmark } from '@/types/bookmarks'

import { useAuth } from '@/contexts/AuthContext'

import {
  getBookmarks,
  toggleBookmark,
  getBookmarkedRecipeIds,
} from '@/lib/supabase/tables/bookmarks'

interface UseBookmarksOptions {
  recipeId?: string
  onToggle?: () => void
}

export function useBookmarks(options: UseBookmarksOptions = {}) {
  const [bookmarks, setBookmarks] = useState<Partial<Bookmark>[]>([])
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set())
  const [isBookmarkedState, setIsBookmarkedState] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isToggling, setIsToggling] = useState(false)

  const { user } = useAuth()

  const fetchBookmarks = useCallback(async () => {
    try {
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
      setIsInitialLoading(false)
    }
  }, [options.recipeId])

  useEffect(() => {
    fetchBookmarks()
  }, [fetchBookmarks])

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

      if (!user) {
        window.location.href = '/login'
        return
      }

      try {
        setIsToggling(true)

        const newState = !isBookmarkedState
        setIsBookmarkedState(newState)

        const newBookmarkedIds = new Set(bookmarkedIds)
        if (newState) {
          newBookmarkedIds.add(options.recipeId)
        } else {
          newBookmarkedIds.delete(options.recipeId)
        }
        setBookmarkedIds(newBookmarkedIds)

        const actualState = await toggleBookmark(options.recipeId)

        if (actualState !== newState) {
          setIsBookmarkedState(actualState)
          const updatedIds = new Set(bookmarkedIds)
          if (actualState) {
            updatedIds.add(options.recipeId)
          } else {
            updatedIds.delete(options.recipeId)
          }
          setBookmarkedIds(updatedIds)
        }

        options.onToggle?.()
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error toggling bookmark:', error)
        setIsBookmarkedState(!isBookmarkedState)
        const revertedIds = new Set(bookmarkedIds)
        if (isBookmarkedState) {
          revertedIds.add(options.recipeId)
        } else {
          revertedIds.delete(options.recipeId)
        }
        setBookmarkedIds(revertedIds)
      } finally {
        setIsToggling(false)
      }
    },
    [options, isBookmarkedState, bookmarkedIds],
  )

  return {
    bookmarks,
    bookmarkedIds,
    isBookmarked: isBookmarkedState,
    toggleBookmark: handleToggleBookmark,
    refreshBookmarks: fetchBookmarks,
    isLoading: isInitialLoading,
    isToggling,
  }
}
