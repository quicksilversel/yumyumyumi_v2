import type { Recipe, RecipeFilters } from '@/types'

export async function getRecipes(): Promise<Recipe[]> {
  // Check if Supabase is configured
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    // Dynamically import to avoid server component issues
    const { getRecipesFromSupabase } = await import('./supabaseRecipeService')
    const supabaseRecipes = await getRecipesFromSupabase()
    return supabaseRecipes || []
  }

  // No fallback - Supabase only
  return []
}

export async function getRecipeById(id: string): Promise<Recipe | null> {
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const { getRecipeByIdFromSupabase } = await import('./supabaseRecipeService')
    return await getRecipeByIdFromSupabase(id)
  }
  return null
}

export async function searchRecipes(filters: RecipeFilters): Promise<Recipe[]> {
  if (
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    const { searchRecipesInSupabase } = await import('./supabaseRecipeService')
    return await searchRecipesInSupabase(filters)
  }

  // Fallback to client-side filtering if needed
  const recipes = await getRecipes()
  return recipes.filter((recipe) => {
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      const matchesSearch =
        recipe.title.toLowerCase().includes(searchLower) ||
        recipe.summary?.toLowerCase().includes(searchLower) ||
        recipe.ingredients.some((ing) =>
          ing.name.toLowerCase().includes(searchLower),
        )

      if (!matchesSearch) return false
    }

    if (filters.category && recipe.category !== filters.category) {
      return false
    }

    if (filters.maxCookingTime && recipe.cookTime > filters.maxCookingTime) {
      return false
    }

    if (filters.ingredients && filters.ingredients.length > 0) {
      const hasIngredients = filters.ingredients.every((filterIng) =>
        recipe.ingredients.some((recipeIng) =>
          recipeIng.name.toLowerCase().includes(filterIng.toLowerCase()),
        ),
      )
      if (!hasIngredients) return false
    }

    return true
  })
}

export function getRecipeCategories(): string[] {
  return [
    'Appetizer',
    'Main Course',
    'Dessert',
    'Breakfast',
    'Lunch',
    'Dinner',
    'Snack',
    'Beverage',
    'Salad',
    'Soup',
    'Side Dish',
    'Sauce',
    'Baking',
  ]
}

export function getCookingTimeRanges() {
  return [
    { label: 'Under 15 minutes', value: 15 },
    { label: 'Under 30 minutes', value: 30 },
    { label: 'Under 45 minutes', value: 45 },
    { label: 'Under 1 hour', value: 60 },
    { label: 'Over 1 hour', value: null },
  ]
}
