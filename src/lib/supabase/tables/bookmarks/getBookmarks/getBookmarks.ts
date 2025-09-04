import { objectToCamel } from 'ts-case-convert'

import { isValidOf } from '@/lib/functions/isValidOf'
import { bookmarkListSchema } from '@/types/bookmarks'
import { BookmarkList } from '@/types/bookmarks'

import { getSupabaseClient } from '../../../getSupabaseClient'

export async function getBookmarks(): Promise<BookmarkList> {
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

    if (!isValidOf(bookmarkListSchema, objectToCamel(data))) return []
    return objectToCamel(data)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('fetching bookmarks', error)
    return []
  }
}
