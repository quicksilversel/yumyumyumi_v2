import { getSupabaseClient } from '@/lib/supabase/getSupabaseClient'

import { isBookmarked } from '../isBookmarked'

export async function addBookmark(recipeId: string): Promise<boolean> {
  try {
    const supabase = getSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert('ログインが必要です')
      return false
    }

    const alreadyBookmarked = await isBookmarked(recipeId)
    if (alreadyBookmarked) {
      return true
    }

    const insertData = {
      user_id: user.id,
      recipe_id: recipeId,
    }

    const { error } = await supabase
      .from('bookmarks')
      .insert(insertData as any)
      .select()
      .single()

    if (error) throw error

    return true
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('adding bookmark', error)
    return false
  }
}
