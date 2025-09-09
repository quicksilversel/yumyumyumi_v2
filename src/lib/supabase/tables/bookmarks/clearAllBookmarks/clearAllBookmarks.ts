import { getSupabaseClient } from '@/lib/supabase/getSupabaseClient'

export async function clearAllBookmarks(userId?: string): Promise<boolean> {
  try {
    const supabase = getSupabaseClient()

    if (!userId) {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      userId = user?.id
    }

    if (!userId) {
      // eslint-disable-next-line no-console
      console.error('User must be logged in to clear bookmarks')
      return false
    }

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)

    if (error) throw error

    return true
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('clearing all bookmarks', error)
    return false
  }
}
