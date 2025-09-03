import { objectToCamel, objectToSnake } from 'ts-case-convert'

import type { RecipeForm, Recipe } from '@/types'

import { isValidOf } from '@/lib/functions/isValidOf'
import { recipeSchema } from '@/types'

import { getSupabaseClient } from '../../../getSupabaseClient'

export async function updateRecipe(
  id: Recipe['id'],
  updates: RecipeForm,
): Promise<Recipe | null> {
  try {
    const supabase = getSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      // eslint-disable-next-line no-console
      console.error('User must be logged in to update recipes')
      return null
    }

    const { data, error } = await supabase
      .from('recipes')
      // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'Partial<RecipeForm>' is not assign... Remove this comment to see the full error message
      .update(objectToSnake(updates))
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    if (!data) return null

    if (!isValidOf(recipeSchema, objectToCamel(data))) return null

    return objectToCamel(data)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('updating recipe', error)
    return null
  }
}
