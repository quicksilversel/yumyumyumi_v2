import { getSupabaseClient } from '../../../getSupabaseClient'

export async function isBookmarked(recipeId: string): Promise<boolean> {
  try {
    const supabase = getSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return false
    }

    const { data, error } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .eq('recipe_id', recipeId)
    if (error) throw error

    return !!(data && data.length > 0)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('checking bookmark status', error)
    return false
  }
}
