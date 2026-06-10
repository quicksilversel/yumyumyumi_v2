'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

import { auth } from '@/auth'
import { db } from '@/lib/db'
import { recipes } from '@/lib/db/schema'

export async function deleteRecipe(id: string): Promise<boolean> {
  try {
    const session = await auth()
    if (!session?.user?.id) return false

    await db
      .delete(recipes)
      .where(and(eq(recipes.id, id), eq(recipes.userId, session.user.id)))

    revalidatePath('/')
    revalidatePath('/recipes/[id]', 'page')

    return true
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('deleting recipe', error)
    return false
  }
}
