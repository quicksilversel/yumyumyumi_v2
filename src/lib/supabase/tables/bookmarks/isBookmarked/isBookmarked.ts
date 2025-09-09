import { getSupabaseClient } from '../../../getSupabaseClient'

export async function isBookmarked(
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

    const { data, error } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('recipe_id', recipeId)
    if (error) throw error

    return !!(data && data.length > 0)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('checking bookmark status', error)
    return false
  }
}
