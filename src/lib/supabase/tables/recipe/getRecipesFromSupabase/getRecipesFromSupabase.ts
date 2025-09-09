import { unstable_cache } from 'next/cache'
import { objectToCamel } from 'ts-case-convert'

import type { Recipe } from '@/types/recipe'

import { isValidOf } from '@/lib/functions/isValidOf'
import { recipeListSchema } from '@/types/recipe'

import { getSupabaseClient } from '../../../getSupabaseClient'

export const getRecipesFromSupabase = unstable_cache(
  async (): Promise<Recipe[]> => {
    try {
      const supabase = getSupabaseClient()

      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      if (!isValidOf(recipeListSchema, objectToCamel(data))) return []
      return objectToCamel(data)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('fetching recipes from Supabase', error)
      return []
    }
  },
  ['recipes-list'],
  {
    tags: ['recipes', 'recipes-list'],
    revalidate: 3600,
  },
)
