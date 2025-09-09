import { getSupabaseClient } from '@/lib/supabase/getSupabaseClient'

export async function removeBookmark(
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
      return false
    }

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('recipe_id', recipeId)

    if (error) throw error

    return true
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('removing bookmark', error)
    return false
  }
}
