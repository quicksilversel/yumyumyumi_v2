'use server'

import { eq } from 'drizzle-orm'

import { db } from '@/lib/db'
import { recipes } from '@/lib/db/schema'

export async function getAllTags(): Promise<string[]> {
  try {
    const rows = await db
      .select({ tags: recipes.tags })
      .from(recipes)
      .where(eq(recipes.isPublic, true))

    const allTags = new Set<string>()

    rows.forEach((row) => {
      row.tags?.forEach((tag) => {
        if (tag) allTags.add(tag)
      })
    })

    return Array.from(allTags).sort()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('fetching all tags', error)
    return []
  }
}
