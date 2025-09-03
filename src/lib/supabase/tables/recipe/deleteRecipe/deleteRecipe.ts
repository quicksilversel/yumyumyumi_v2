import { getSupabaseClient } from '../../../getSupabaseClient'

export async function deleteRecipe(id: string): Promise<boolean> {
  try {
    const supabase = getSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      // eslint-disable-next-line no-console
      console.error('User must be logged in to delete recipes')
      return false
    }

    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    return true
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('deleting recipe', error)
    return false
  }
}
