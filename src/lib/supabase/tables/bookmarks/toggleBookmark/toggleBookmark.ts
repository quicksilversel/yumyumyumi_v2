import { addBookmark } from './addBookmark'
import { removeBookmark } from './removeBookmark'

import { isBookmarked } from '../isBookmarked'

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
    // eslint-disable-next-line no-console
    console.error('toggling bookmark', error)
    return false
  }
}
