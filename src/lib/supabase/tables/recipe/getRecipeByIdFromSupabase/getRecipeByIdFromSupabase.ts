import { unstable_cache } from 'next/cache'
import { objectToCamel } from 'ts-case-convert'

import type { Recipe } from '@/types/recipe'

import { isValidOf } from '@/lib/functions/isValidOf'
import { recipeSchema } from '@/types/recipe'

import { getSupabaseClient } from '../../../getSupabaseClient'

export const getRecipeByIdFromSupabase = unstable_cache(
  async (id: string): Promise<Recipe | null> => {
    try {
      const supabase = getSupabaseClient()

      const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      if (!isValidOf(recipeSchema, objectToCamel(data))) return null

      return objectToCamel(data)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('fetching recipe by ID', error)
      return null
    }
  },
  ['recipe-by-id'],
  {
    tags: ['recipes'],
    revalidate: 3600,
  },
)
