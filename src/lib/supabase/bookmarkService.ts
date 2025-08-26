import type { BookmarkedRecipe } from '@/types'

const BOOKMARKS_KEY = 'yumyumyumi_bookmarks'

// Helper to check if we're in browser environment
const isBrowser = () => typeof window !== 'undefined'

// Helper to emit bookmark change events
const emitBookmarksChanged = (bookmarks: BookmarkedRecipe[]): void => {
  if (isBrowser()) {
    window.dispatchEvent(
      new CustomEvent('bookmarksChanged', { detail: bookmarks }),
    )
  }
}

// Helper to safely access localStorage
const getStoredBookmarks = (): BookmarkedRecipe[] => {
  if (!isBrowser()) return []

  try {
    const stored = localStorage.getItem(BOOKMARKS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error reading bookmarks from localStorage:', error)
    return []
  }
}

// Helper to safely save to localStorage
const saveBookmarks = (bookmarks: BookmarkedRecipe[]): void => {
  if (!isBrowser()) return

  try {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks))
    emitBookmarksChanged(bookmarks)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error saving bookmarks to localStorage:', error)
  }
}

// Public API
export function getBookmarks(): BookmarkedRecipe[] {
  return getStoredBookmarks()
}

export function isBookmarked(recipeId: string): boolean {
  return getStoredBookmarks().some((b) => b.recipeId === recipeId)
}

export function addBookmark(recipeId: string): void {
  if (!isBrowser() || isBookmarked(recipeId)) return

  const bookmarks = getStoredBookmarks()
  const newBookmark: BookmarkedRecipe = {
    recipeId,
    bookmarkedAt: new Date().toISOString(),
  }

  saveBookmarks([...bookmarks, newBookmark])
}

export function removeBookmark(recipeId: string): void {
  if (!isBrowser()) return

  const bookmarks = getStoredBookmarks()
  const updated = bookmarks.filter((b) => b.recipeId !== recipeId)
  saveBookmarks(updated)
}

export function toggleBookmark(recipeId: string): boolean {
  const bookmarked = isBookmarked(recipeId)

  if (bookmarked) {
    removeBookmark(recipeId)
  } else {
    addBookmark(recipeId)
  }

  return !bookmarked
}

export function clearAllBookmarks(): void {
  if (!isBrowser()) return

  localStorage.removeItem(BOOKMARKS_KEY)
  emitBookmarksChanged([])
}
