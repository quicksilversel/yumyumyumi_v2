import { objectToCamel } from 'ts-case-convert'

import type { Recipe } from '@/types/recipe'

import { getSupabaseClient } from '../../../getSupabaseClient'

export async function getAllTagsFromRecipes(): Promise<string[]> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('recipes')
      .select('tags')
      .eq('is_public', true)

    if (error) throw error

    const recipes = objectToCamel(data) as Pick<Recipe, 'tags'>[]

    const allTags = new Set<string>()

    recipes.forEach((recipe) => {
      if (recipe.tags && Array.isArray(recipe.tags)) {
        recipe.tags.forEach((tag) => {
          if (tag) {
            allTags.add(tag)
          }
        })
      }
    })

    return Array.from(allTags).sort()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('fetching all tags', error)
    return []
  }
}
