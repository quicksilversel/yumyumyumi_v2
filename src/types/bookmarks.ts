import { z } from 'zod'

export const bookmarkSchema = z.object({
  id: z.string(),
  userId: z.string(),
  recipeId: z.string(),
  createdAt: z.string(),
})

export const bookmarkListSchema = z.array(bookmarkSchema)

export type Bookmark = z.infer<typeof bookmarkSchema>
export type BookmarkList = z.infer<typeof bookmarkListSchema>
