import { z } from 'zod'

const ingredientSchema = z.object({
  name: z.string().min(1, '材料名を入力してください'),
  amount: z.string().min(1, '分量を入力してください'),
  isSpice: z.boolean().optional(),
})

const directionSchema = z
  .object({
    title: z.string(),
    description: z.string().optional(),
  })
  .refine((data) => data.title || data.description, {
    message: '手順の見出しか説明のどちらかを入力してください',
  })

export const recipeFormSchema = z.object({
  title: z.string().min(1, 'タイトルを入力してください'),
  summary: z.string().optional(),
  ingredients: z
    .array(ingredientSchema)
    .min(1, '材料を1つ以上入力してください'),
  directions: z.array(directionSchema).min(1, '手順を1つ以上入力してください'),
  tags: z.array(z.string()).optional(),
  tips: z.string().optional(),
  cookTime: z.number().min(1, '調理時間は1分以上を入力してください'),
  servings: z.number().min(1, '人数は1人分以上を入力してください'),
  imageUrl: z.string().optional(),
  source: z.string().optional(),
  isPublic: z.boolean(),
})

export const recipeSchema = recipeFormSchema.extend({
  id: z.string(),
  userId: z.string().nullable().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
})

export const recipeListSchema = z.array(recipeSchema)

const recipeFiltersSchema = z.object({
  searchTerm: z.string().optional(),
  maxCookingTime: z.number().optional(),
  tag: z.string().optional(),
  showBookmarkedOnly: z.boolean().optional(),
})

const bookmarkedRecipeSchema = z.object({
  recipeId: z.string(),
  bookmarkedAt: z.string(),
})

export type Ingredient = z.input<typeof ingredientSchema>
export type Direction = z.infer<typeof directionSchema>
export type RecipeForm = z.infer<typeof recipeFormSchema>
export type RecipeFormInput = z.input<typeof recipeFormSchema>
export type Recipe = z.infer<typeof recipeSchema>
export type RecipeFilters = z.infer<typeof recipeFiltersSchema>
export type BookmarkedRecipe = z.infer<typeof bookmarkedRecipeSchema>
