import type { BookmarkedRecipe } from '@/types'

import { getSupabaseClient } from './getSupabaseClient'

// Database schema for bookmarks table
interface DbBookmark {
  id: string
  user_id: string
  recipe_id: string
  created_at: string
}

// Type guard to validate DbBookmark structure
function isDbBookmark(data: unknown): data is DbBookmark {
  if (!data || typeof data !== 'object') return false

  // Check if data has the required properties
  if (
    !(
      'id' in data &&
      'user_id' in data &&
      'recipe_id' in data &&
      'created_at' in data
    )
  ) {
    return false
  }

  // Now TypeScript knows these properties exist
  const record = data as {
    id: unknown
    user_id: unknown
    recipe_id: unknown
    created_at: unknown
  }

  return (
    typeof record.id === 'string' &&
    typeof record.user_id === 'string' &&
    typeof record.recipe_id === 'string' &&
    typeof record.created_at === 'string'
  )
}

// Convert unknown data to DbBookmark array safely
function parseDbBookmarks(data: unknown): DbBookmark[] {
  if (!Array.isArray(data)) return []

  return data.filter((item): item is DbBookmark => isDbBookmark(item))
}

// Convert database bookmark to app format
function dbBookmarkToBookmark(dbBookmark: DbBookmark): BookmarkedRecipe {
  return {
    recipeId: dbBookmark.recipe_id,
    bookmarkedAt: dbBookmark.created_at,
  }
}

// Helper to emit bookmark change events (for UI updates)
const emitBookmarksChanged = (bookmarks: BookmarkedRecipe[]): void => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('bookmarksChanged', { detail: bookmarks }),
    )
  }
}

// Generic error handler
function handleError(operation: string, error: unknown): void {
  // eslint-disable-next-line no-console
  console.error(`Error ${operation}:`, error)
}

// Get all bookmarks for the current user
export async function getBookmarks(): Promise<BookmarkedRecipe[]> {
  try {
    const supabase = getSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return []
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    const dbBookmarks = parseDbBookmarks(data)
    return dbBookmarks.map(dbBookmarkToBookmark)
  } catch (error) {
    handleError('fetching bookmarks', error)
    return []
  }
}

// Check if a recipe is bookmarked by the current user
export async function isBookmarked(recipeId: string): Promise<boolean> {
  try {
    const supabase = getSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return false
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .eq('recipe_id', recipeId)
      .single()

    if (error) {
      // If error is "No rows found", recipe is not bookmarked
      if (error.code === 'PGRST116') {
        return false
      }
      throw error
    }

    return !!data
  } catch (error) {
    handleError('checking bookmark status', error)
    return false
  }
}

// Add a bookmark for the current user
export async function addBookmark(recipeId: string): Promise<boolean> {
  try {
    const supabase = getSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      // eslint-disable-next-line no-console
      console.error('User must be logged in to bookmark recipes')
      return false
    }

    // Check if already bookmarked
    const alreadyBookmarked = await isBookmarked(recipeId)
    if (alreadyBookmarked) {
      return true
    }

    const { error } = await supabase.from('bookmarks').insert({
      user_id: user.id,
      recipe_id: recipeId,
    } as any)

    if (error) throw error

    // Fetch updated bookmarks and emit event
    const bookmarks = await getBookmarks()
    emitBookmarksChanged(bookmarks)

    return true
  } catch (error) {
    handleError('adding bookmark', error)
    return false
  }
}

// Remove a bookmark for the current user
export async function removeBookmark(recipeId: string): Promise<boolean> {
  try {
    const supabase = getSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      // eslint-disable-next-line no-console
      console.error('User must be logged in to remove bookmarks')
      return false
    }

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', user.id)
      .eq('recipe_id', recipeId)

    if (error) throw error

    // Fetch updated bookmarks and emit event
    const bookmarks = await getBookmarks()
    emitBookmarksChanged(bookmarks)

    return true
  } catch (error) {
    handleError('removing bookmark', error)
    return false
  }
}

// Toggle bookmark status for the current user
export async function toggleBookmark(recipeId: string): Promise<boolean> {
  try {
    const bookmarked = await isBookmarked(recipeId)

    if (bookmarked) {
      await removeBookmark(recipeId)
      return false
    } else {
      await addBookmark(recipeId)
      return true
    }
  } catch (error) {
    handleError('toggling bookmark', error)
    return false
  }
}

// Clear all bookmarks for the current user
export async function clearAllBookmarks(): Promise<boolean> {
  try {
    const supabase = getSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      // eslint-disable-next-line no-console
      console.error('User must be logged in to clear bookmarks')
      return false
    }

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', user.id)

    if (error) throw error

    emitBookmarksChanged([])

    return true
  } catch (error) {
    handleError('clearing all bookmarks', error)
    return false
  }
}

// Get bookmarked recipe IDs for quick lookup (useful for lists)
export async function getBookmarkedRecipeIds(): Promise<Set<string>> {
  try {
    const bookmarks = await getBookmarks()
    return new Set(bookmarks.map((b) => b.recipeId))
  } catch (error) {
    handleError('fetching bookmarked recipe IDs', error)
    return new Set()
  }
}
