import type { Recipe } from '@/types'

import { validateDirections } from '@/components/pages/Modals/RecipeForm/Parts/DirectionsForm'
import { validateIngredients } from '@/components/pages/Modals/RecipeForm/Parts/IngredientsForm'
import { validateTitle } from '@/components/pages/Modals/RecipeForm/Parts/TitleForm'
import { Ingredient, Direction } from '@/types'

export interface RecipeValidationResult {
  isValid: boolean
  errors: string[]
  validatedData?: {
    ingredients: Ingredient[]
    directions: Direction[]
  }
}

/**
 * Validates all recipe form data using individual component validators
 */
export function validateRecipeForm(
  recipe: Partial<Recipe>,
  userId?: string | null,
): RecipeValidationResult {
  const errors: string[] = []

  // Check if user is logged in (for create mode)
  if (userId === undefined && !recipe.user_id) {
    errors.push('You must be logged in to create a recipe')
  }

  // Validate title
  const titleValidation = validateTitle(recipe.title || '')
  if (!titleValidation.isValid && titleValidation.error) {
    errors.push(titleValidation.error)
  }

  // Validate ingredients
  const ingredientsValidation = validateIngredients(recipe.ingredients || [])
  if (!ingredientsValidation.isValid && ingredientsValidation.error) {
    errors.push(ingredientsValidation.error)
  }

  // Validate directions
  const directionsValidation = validateDirections(recipe.directions || [])
  if (!directionsValidation.isValid && directionsValidation.error) {
    errors.push(directionsValidation.error)
  }

  // Additional validations
  if (recipe.cookTime !== undefined && recipe.cookTime < 0) {
    errors.push('Cook time cannot be negative')
  }

  if (recipe.servings !== undefined && recipe.servings <= 0) {
    errors.push('Servings must be at least 1')
  }

  return {
    isValid: errors.length === 0,
    errors,
    validatedData:
      errors.length === 0
        ? {
            ingredients: ingredientsValidation.validIngredients || [],
            directions: directionsValidation.validDirections || [],
          }
        : undefined,
  }
}

/**
 * Prepares recipe data for submission
 */
export function prepareRecipeData(
  recipe: Partial<Recipe>,
  validatedData: { ingredients: Ingredient[]; directions: Direction[] },
  imageUrl?: string,
  userId?: string,
): Partial<Recipe> {
  const recipeData: Partial<Recipe> = {
    title: recipe.title?.trim(),
    summary: recipe.summary?.trim() || undefined,
    ingredients: validatedData.ingredients,
    directions: validatedData.directions,
    tags: recipe.tags?.length
      ? recipe.tags.filter((tag) => tag.trim())
      : undefined,
    tips: recipe.tips?.trim() || undefined,
    cookTime: recipe.cookTime || 30,
    servings: recipe.servings || 4,
    category: recipe.category,
    imageUrl: imageUrl || recipe.imageUrl || undefined,
    source: recipe.source?.trim() || undefined,
    isPublic: recipe.isPublic ?? true,
  }

  // Add userId for create mode
  if (userId) {
    recipeData.user_id = userId
  }

  return recipeData
}

/**
 * Gets initial recipe state for forms
 */
export function getInitialRecipeState(): Partial<Recipe> {
  return {
    title: '',
    summary: '',
    ingredients: [],
    directions: [],
    tags: [],
    tips: '',
    cookTime: 30,
    servings: 4,
    category: 'Main Course',
    imageUrl: '',
    source: '',
    isPublic: true,
  }
}
