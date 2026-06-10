'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath, revalidateTag } from 'next/cache'
import { objectToCamel, objectToSnake } from 'ts-case-convert'

import type { Recipe, RecipeForm } from '@/types/recipe'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { recipes } from '@/lib/db/schema'
import { isValidOf } from '@/lib/functions/isValidOf'
import { recipeSchema } from '@/types/recipe'

export async function updateRecipe(
  id: Recipe['id'],
  updates: RecipeForm,
): Promise<Recipe | null> {
  try {
    const session = await auth()
    if (!session?.user?.id) return null

    const { ingredients, directions, ...rest } = updates

    const [data] = await db
      .update(recipes)
      .set({
        ...rest,
        updatedAt: new Date().toISOString(),
        ingredients: objectToSnake(ingredients) as never,
        directions: objectToSnake(directions) as never,
      })
      .where(and(eq(recipes.id, id), eq(recipes.userId, session.user.id)))
      .returning()

    if (!data) return null

    const camelCaseData = objectToCamel(data)
    if (!isValidOf(recipeSchema, camelCaseData)) return null

    revalidateTag('recipes')
    revalidateTag('recipes-list')
    revalidatePath('/')
    revalidatePath(`/recipes/${id}`)

    return camelCaseData
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('updating recipe', error)
    return null
  }
}
