import { getBookmarks } from '../getBookmarks'

export async function getBookmarkedRecipeIds(): Promise<Set<string>> {
  try {
    const bookmarks = await getBookmarks()
    return new Set(bookmarks.map((b) => b.recipeId))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('fetching bookmarked recipe IDs', error)
    return new Set()
  }
}
