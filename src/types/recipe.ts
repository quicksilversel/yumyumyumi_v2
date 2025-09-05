import { z } from 'zod'

import { RECIPE_CATEGORY } from '@/utils/constants'

const ingredientSchema = z.object({
  name: z.string().min(1, 'Ingredient name is required'),
  amount: z.string().min(1, 'Amount is required'),
  isSpice: z.boolean().optional(),
})

const directionSchema = z
  .object({
    title: z.string(),
    description: z.string().optional(),
  })
  .refine((data) => data.title || data.description, {
    message: 'Either title or description is required',
  })

const recipeCategorySchema = z.enum([...Object.values(RECIPE_CATEGORY)])

export const recipeFormSchema = z.object({
  title: z.string().min(1, 'Title must be at least 1 characters'),
  summary: z.string().optional(),
  ingredients: z
    .array(ingredientSchema)
    .min(1, 'At least one ingredient is required'),
  directions: z
    .array(directionSchema)
    .min(1, 'At least one direction is required'),
  tags: z.array(z.string()).optional(),
  tips: z.string().optional(),
  cookTime: z.number().min(1, 'Cook time must be at least 1 minute'),
  servings: z.number().min(1, 'Servings must be at least 1'),
  category: recipeCategorySchema,
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
  category: recipeCategorySchema.optional(),
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
export type RecipeCategory = z.infer<typeof recipeCategorySchema>
export type RecipeForm = z.infer<typeof recipeFormSchema>
export type RecipeFormInput = z.input<typeof recipeFormSchema>
export type Recipe = z.infer<typeof recipeSchema>
export type RecipeFilters = z.infer<typeof recipeFiltersSchema>
export type BookmarkedRecipe = z.infer<typeof bookmarkedRecipeSchema>
