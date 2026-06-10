import { desc, eq } from 'drizzle-orm'
import { objectToCamel } from 'ts-case-convert'

import type { Recipe } from '@/types/recipe'

import { db } from '@/lib/db'
import { recipes } from '@/lib/db/schema'
import { isValidOf } from '@/lib/functions/isValidOf'
import { recipeListSchema } from '@/types/recipe'

export async function getRecipes(): Promise<Recipe[]> {
  try {
    const data = await db
      .select()
      .from(recipes)
      .where(eq(recipes.isPublic, true))
      .orderBy(desc(recipes.createdAt))

    const camelCaseData = objectToCamel(data)

    if (!isValidOf(recipeListSchema, camelCaseData)) return []
    return camelCaseData
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('fetching recipes', error)
    return []
  }
}
