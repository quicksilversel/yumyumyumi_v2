import { useState, useCallback } from 'react'

import { useRouter } from 'next/navigation'

import { useAuth } from '@/contexts/AuthContext'
import { useBookmarksContext } from '@/contexts/BookmarksContext'

interface UseBookmarksOptions {
  recipeId?: string
  onToggle?: () => void
}

export function useBookmarks(options: UseBookmarksOptions = {}) {
  const [isToggling, setIsToggling] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const {
    bookmarks,
    bookmarkedIds,
    isLoading,
    toggleBookmark,
    refreshBookmarks,
  } = useBookmarksContext()

  const isBookmarked = options.recipeId
    ? bookmarkedIds.has(options.recipeId)
    : false

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
        router.push('/login')
        return
      }

      try {
        setIsToggling(true)
        await toggleBookmark(options.recipeId)
        options.onToggle?.()
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error toggling bookmark:', error)
      } finally {
        setIsToggling(false)
      }
    },
    [options, user, toggleBookmark, router],
  )

  return {
    bookmarks,
    bookmarkedIds,
    isBookmarked,
    toggleBookmark: handleToggleBookmark,
    refreshBookmarks,
    isLoading,
    isToggling,
  }
}
