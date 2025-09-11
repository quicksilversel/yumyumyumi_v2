import { objectToCamel } from 'ts-case-convert'

import { isValidOf } from '@/lib/functions/isValidOf'
import { bookmarkListSchema } from '@/types/bookmarks'
import { BookmarkList } from '@/types/bookmarks'

import { getSupabaseClient } from '../../../getSupabaseClient'

export async function getBookmarks(userId?: string): Promise<BookmarkList> {
  try {
    const supabase = getSupabaseClient()

    if (!userId) {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      userId = user?.id
    }

    if (!userId) {
      return []
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error

    const camelCaseData = objectToCamel(data)

    if (!isValidOf(bookmarkListSchema, camelCaseData)) return []

    return camelCaseData
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('fetching bookmarks', error)
    return []
  }
}
