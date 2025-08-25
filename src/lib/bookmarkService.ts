import type { BookmarkedRecipe } from '@/types'

const BOOKMARKS_KEY = 'yumyumyumi_bookmarks'

export function getBookmarks(): BookmarkedRecipe[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function isBookmarked(recipeId: string): boolean {
  const bookmarks = getBookmarks()
  return bookmarks.some((b) => b.recipeId === recipeId)
}

export function addBookmark(recipeId: string): void {
  if (typeof window === 'undefined') return

  const bookmarks = getBookmarks()

  if (!isBookmarked(recipeId)) {
    const newBookmark: BookmarkedRecipe = {
      recipeId,
      bookmarkedAt: new Date().toISOString(),
    }

    const updated = [...bookmarks, newBookmark]
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated))

    window.dispatchEvent(
      new CustomEvent('bookmarksChanged', { detail: updated }),
    )
  }
}

export function removeBookmark(recipeId: string): void {
  if (typeof window === 'undefined') return

  const bookmarks = getBookmarks()
  const updated = bookmarks.filter((b) => b.recipeId !== recipeId)

  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated))
  window.dispatchEvent(new CustomEvent('bookmarksChanged', { detail: updated }))
}

export function toggleBookmark(recipeId: string): boolean {
  if (isBookmarked(recipeId)) {
    removeBookmark(recipeId)
    return false
  } else {
    addBookmark(recipeId)
    return true
  }
}

export function clearAllBookmarks(): void {
  if (typeof window === 'undefined') return

  localStorage.removeItem(BOOKMARKS_KEY)
  window.dispatchEvent(new CustomEvent('bookmarksChanged', { detail: [] }))
}
