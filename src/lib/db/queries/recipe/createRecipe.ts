'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { objectToCamel, objectToSnake } from 'ts-case-convert'

import type { Recipe } from '@/types/recipe'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { recipes } from '@/lib/db/schema'
import { isValidOf } from '@/lib/functions/isValidOf'
import { recipeSchema } from '@/types/recipe'

export async function createRecipe(
  recipe: Omit<Recipe, 'id'>,
): Promise<Recipe | null> {
  try {
    const session = await auth()
    if (!session?.user?.id) return null

    const { ingredients, directions, ...rest } = recipe

    const [data] = await db
      .insert(recipes)
      .values({
        ...rest,
        userId: session.user.id,
        // nested jsonb keys stored snake_case to match the read path
        ingredients: objectToSnake(ingredients) as never,
        directions: objectToSnake(directions) as never,
      })
      .returning()

    if (!data) return null

    const camelCaseData = objectToCamel(data)
    if (!isValidOf(recipeSchema, camelCaseData)) return null

    revalidateTag('recipes')
    revalidateTag('recipes-list')
    revalidatePath('/')

    return camelCaseData
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('creating recipe', error)
    return null
  }
}
