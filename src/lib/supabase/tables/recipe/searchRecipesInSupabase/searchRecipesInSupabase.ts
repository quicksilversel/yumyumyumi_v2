import { unstable_cache } from 'next/cache'
import { objectToCamel } from 'ts-case-convert'

import type { Recipe, RecipeFilters } from '@/types/recipe'

import { getSupabaseClient } from '../../../getSupabaseClient'

export const searchRecipesInSupabase = unstable_cache(
  async (filters: RecipeFilters): Promise<Recipe[]> => {
    try {
      const supabase = getSupabaseClient()

      let query = supabase.from('recipes').select('*').eq('is_public', true)

      if (filters.searchTerm) {
        query = query.or(
          `title.ilike.%${filters.searchTerm}%,summary.ilike.%${filters.searchTerm}%`,
        )
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
  },
  ['search-recipes'],
  {
    tags: ['recipes', 'recipes-search'],
    revalidate: 3600,
  },
)
