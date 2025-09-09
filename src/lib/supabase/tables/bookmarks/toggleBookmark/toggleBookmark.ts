import { addBookmark } from './addBookmark'
import { removeBookmark } from './removeBookmark'

import { isBookmarked } from '../isBookmarked'

export async function toggleBookmark(
  recipeId: string,
  userId?: string,
): Promise<boolean> {
  try {
    const bookmarked = await isBookmarked(recipeId, userId)

    if (bookmarked) {
      await removeBookmark(recipeId, userId)
      return false
    } else {
      await addBookmark(recipeId, userId)
      return true
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('toggling bookmark', error)
    return false
  }
}
