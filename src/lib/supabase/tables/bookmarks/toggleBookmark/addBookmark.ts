import { getSupabaseClient } from '@/lib/supabase/getSupabaseClient'

export async function addBookmark(
  recipeId: string,
  userId?: string,
): Promise<boolean> {
  try {
    const supabase = getSupabaseClient()

    if (!userId) {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      userId = user?.id
    }

    if (!userId) {
      alert('ログインが必要です')
      return false
    }

    const insertData = {
      user_id: userId,
      recipe_id: recipeId,
    }

    const { error } = await supabase
      .from('bookmarks')
      .insert(insertData as any)
      .select()
      .single()

    if (error && error.code === '23505') {
      return true
    }

    if (error) throw error

    return true
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('adding bookmark', error)
    return false
  }
}
