import { z } from 'zod'

export const bookmarkSchema = z.object({
  id: z.string(),
  userId: z.string(),
  recipeId: z.string(),
  createdAt: z.union([z.string(), z.date()]).transform((val) => 
    val instanceof Date ? val.toISOString() : val
  ),
})

export const bookmarkListSchema = z.array(bookmarkSchema)

export type Bookmark = z.infer<typeof bookmarkSchema>
export type BookmarkList = z.infer<typeof bookmarkListSchema>
