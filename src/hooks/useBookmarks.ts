import { useEffect, useState } from 'react'

import type { BookmarkedRecipe } from '@/types'

import {
  getBookmarks,
  isBookmarked,
  toggleBookmark,
} from '@/lib/supabase/bookmarkService'

interface UseBookmarksOptions {
  recipeId?: string
  onToggle?: () => void
}

export function useBookmarks(options: UseBookmarksOptions = {}) {
  const [bookmarks, setBookmarks] = useState<BookmarkedRecipe[]>([])
  const [isBookmarkedState, setIsBookmarkedState] = useState(false)

  useEffect(() => {
    setBookmarks(getBookmarks())

    if (options.recipeId) {
      setIsBookmarkedState(isBookmarked(options.recipeId))
    }

    const handleBookmarksChange = (event: CustomEvent<BookmarkedRecipe[]>) => {
      setBookmarks(event.detail)
      if (options.recipeId) {
        setIsBookmarkedState(
          event.detail.some((b) => b.recipeId === options.recipeId)
        )
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
  }, [options.recipeId])

  const handleToggleBookmark = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    
    if (!options.recipeId) {
      console.warn('Cannot toggle bookmark without recipeId')
      return
    }

    const newState = toggleBookmark(options.recipeId)
    setIsBookmarkedState(newState)
    options.onToggle?.()
  }

  return {
    bookmarks,
    isBookmarked: isBookmarkedState,
    toggleBookmark: handleToggleBookmark,
  }
}
