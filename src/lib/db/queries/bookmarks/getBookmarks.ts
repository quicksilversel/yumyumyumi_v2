'use server'

import { desc, eq } from 'drizzle-orm'
import { objectToCamel } from 'ts-case-convert'

import type { BookmarkList } from '@/types/bookmarks'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { bookmarks } from '@/lib/db/schema'
import { isValidOf } from '@/lib/functions/isValidOf'
import { bookmarkListSchema } from '@/types/bookmarks'

export async function getBookmarks(): Promise<BookmarkList> {
  try {
    const session = await auth()
    if (!session?.user?.id) return []

    const data = await db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.userId, session.user.id))
      .orderBy(desc(bookmarks.createdAt))

    const camelCaseData = objectToCamel(data)

    if (!isValidOf(bookmarkListSchema, camelCaseData)) return []
    return camelCaseData
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('fetching bookmarks', error)
    return []
  }
}
