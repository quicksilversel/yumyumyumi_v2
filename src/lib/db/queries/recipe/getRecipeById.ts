import { eq } from 'drizzle-orm'
import { objectToCamel } from 'ts-case-convert'

import type { Recipe } from '@/types/recipe'

import { db } from '@/lib/db'
import { recipes } from '@/lib/db/schema'
import { isValidOf } from '@/lib/functions/isValidOf'
import { recipeSchema } from '@/types/recipe'

// Caching is handled at the route level via `export const revalidate` and
// on-demand `revalidatePath` calls in the mutation actions.
export async function getRecipeById(id: string): Promise<Recipe | null> {
  try {
    const [data] = await db
      .select()
      .from(recipes)
      .where(eq(recipes.id, id))
      .limit(1)

    if (!data) return null

    const camelCaseData = objectToCamel(data)

    if (!isValidOf(recipeSchema, camelCaseData)) return null
    return camelCaseData
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('fetching recipe by ID', error)
    return null
  }
}
