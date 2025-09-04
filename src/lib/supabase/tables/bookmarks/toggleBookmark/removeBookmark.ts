import { getSupabaseClient } from '@/lib/supabase/getSupabaseClient'

export async function removeBookmark(recipeId: string): Promise<boolean> {
  try {
    const supabase = getSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return false
    }

    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', user.id)
      .eq('recipe_id', recipeId)

    if (error) throw error

    return true
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('removing bookmark', error)
    return false
  }
}
