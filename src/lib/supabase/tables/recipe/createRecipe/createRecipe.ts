import { objectToCamel, objectToSnake } from 'ts-case-convert'

import type { Recipe } from '@/types'

import { isValidOf } from '@/lib/functions/isValidOf'
import { recipeSchema } from '@/types'

import { getSupabaseClient } from '../../../getSupabaseClient'

export async function createRecipe(
  recipe: Omit<Recipe, 'id'>,
): Promise<Recipe | null> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('recipes')
      .insert(objectToSnake(recipe) as any)
      .select()
      .single()

    if (error) throw error
    if (!data) return null

    if (!isValidOf(recipeSchema, objectToCamel(data))) return null

    return objectToCamel(data)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('creating recipe', error)
    return null
  }
}
