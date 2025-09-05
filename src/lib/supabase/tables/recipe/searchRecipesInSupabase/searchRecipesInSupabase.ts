import { objectToCamel } from 'ts-case-convert'

import type { Recipe, RecipeFilters } from '@/types/recipe'

import { getSupabaseClient } from '../../../getSupabaseClient'

export async function searchRecipesInSupabase(
  filters: RecipeFilters,
): Promise<Recipe[]> {
  try {
    const supabase = getSupabaseClient()

    let query = supabase.from('recipes').select('*').eq('is_public', true)

    if (filters.searchTerm) {
      query = query.or(
        `title.ilike.%${filters.searchTerm}%,summary.ilike.%${filters.searchTerm}%`,
      )
    }

    if (filters.category) {
      query = query.eq('category', filters.category)
    }

    if (filters.tag) {
      query = query.contains('tags', [decodeURI(filters.tag)])
    }

    if (filters.maxCookingTime) {
      query = query.lte('cook_time', filters.maxCookingTime)
    }

    const { data, error } = await query.order('created_at', {
      ascending: false,
    })

    if (error) throw error

    return objectToCamel(data)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('searching recipes', error)
    return []
  }
}
