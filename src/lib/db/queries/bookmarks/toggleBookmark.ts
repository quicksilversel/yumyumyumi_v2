'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath, revalidateTag } from 'next/cache'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { bookmarks } from '@/lib/db/schema'

/**
 * Toggles a bookmark for the current user. Returns the new state
 * (true = now bookmarked, false = now removed).
 */
export async function toggleBookmark(recipeId: string): Promise<boolean> {
  try {
    const session = await auth()
    if (!session?.user?.id) return false

    const userId = session.user.id

    const existing = await db
      .select({ id: bookmarks.id })
      .from(bookmarks)
      .where(
        and(eq(bookmarks.userId, userId), eq(bookmarks.recipeId, recipeId)),
      )
      .limit(1)

    let nowBookmarked: boolean

    if (existing.length > 0) {
      await db
        .delete(bookmarks)
        .where(
          and(eq(bookmarks.userId, userId), eq(bookmarks.recipeId, recipeId)),
        )
      nowBookmarked = false
    } else {
      await db.insert(bookmarks).values({ userId, recipeId })
      nowBookmarked = true
    }

    revalidateTag('bookmarks')
    revalidatePath(`/recipes/${recipeId}`)

    return nowBookmarked
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('toggling bookmark', error)
    return false
  }
}
