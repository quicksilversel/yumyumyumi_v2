import { useEffect, useState } from 'react'

import type { BookmarkedRecipe } from '@/types'

import { getBookmarks } from '@/lib/bookmarkService'

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkedRecipe[]>([])

  useEffect(() => {
    setBookmarks(getBookmarks())

    const handleBookmarksChange = (event: CustomEvent<BookmarkedRecipe[]>) => {
      setBookmarks(event.detail)
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
  }, [])

  return bookmarks
}
