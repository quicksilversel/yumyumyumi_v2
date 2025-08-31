import type {
  Recipe,
  RecipeFilters,
  Ingredient,
  Direction,
  RecipeCategory,
} from '@/types'

import { getSupabaseClient } from './getSupabaseClient'

// Helper to safely parse JSON fields
function parseJsonField<T>(field: unknown, defaultValue: T): T {
  try {
    // If field is a string, parse it as JSON
    if (typeof field === 'string') {
      return JSON.parse(field) as T
    }
    // If field is already an object/array, return it
    return (field as T) || defaultValue
  } catch {
    return defaultValue
  }
}

// Convert database recipe to app recipe format
function mapDbRecipeToRecipe(dbRecipe: Record<string, unknown>): Recipe {
  // Parse ingredients - handle both array of strings and array of objects
  let ingredients: Ingredient[] = []
  const rawIngredients = dbRecipe.ingredients
  if (Array.isArray(rawIngredients)) {
    ingredients = rawIngredients.map(item => {
      if (typeof item === 'string') {
        try {
          return JSON.parse(item) as Ingredient
        } catch {
          return { name: item, amount: '' } as Ingredient
        }
      }
      return item as Ingredient
    })
  } else {
    ingredients = parseJsonField<Ingredient[]>(rawIngredients, [])
  }

  // Parse directions similarly
  let directions: Direction[] = []
  const rawDirections = dbRecipe.directions
  if (Array.isArray(rawDirections)) {
    directions = rawDirections.map(item => {
      if (typeof item === 'string') {
        try {
          return JSON.parse(item) as Direction
        } catch {
          // Fallback: use the string as the title
          return { title: item } as Direction
        }
      }
      return item as Direction
    })
  } else {
    directions = parseJsonField<Direction[]>(rawDirections, [])
  }

  return {
    id: dbRecipe.id as string,
    user_id: dbRecipe.user_id as string | null,
    title: dbRecipe.title as string,
    summary: (dbRecipe.summary as string) || '',
    ingredients,
    directions,
    tags: parseJsonField<string[] | undefined>(dbRecipe.tags, undefined),
    tips: (dbRecipe.tips as string) || undefined,
    cookTime: dbRecipe.cook_time as number,
    servings: dbRecipe.servings as number,
    category:
      (dbRecipe.category as RecipeCategory) ||
      ('Main Course' as RecipeCategory),
    imageUrl: (dbRecipe.image_url as string) || '',
    source: (dbRecipe.source as string) || undefined,
    isPublic: dbRecipe.is_public as boolean,
    createdAt: dbRecipe.created_at as string,
    updatedAt: dbRecipe.updated_at as string,
  }
}

// Convert app recipe to database format for insert
function mapRecipeToInsert(
  recipe: Partial<Recipe>,
  userId: string,
): Record<string, unknown> {
  const insertData: Record<string, unknown> = {
    user_id: userId,
    title: recipe.title || '',
    summary: recipe.summary || null,
    ingredients: recipe.ingredients || [],
    directions: recipe.directions || [],
    tags: recipe.tags || null,
    tips: recipe.tips || null,
    cook_time: recipe.cookTime || 0,
    servings: recipe.servings || 1,
    category: recipe.category || null,
    image_url: recipe.imageUrl || null,
    source: recipe.source || null,
    is_public: recipe.isPublic ?? true,
  }

  return insertData
}

// Convert app recipe updates to database format
function mapRecipeToUpdate(updates: Partial<Recipe>): Record<string, unknown> {
  const updateData: Record<string, unknown> = {}

  // Map all possible fields
  const fieldMappings: Array<[keyof Recipe, string]> = [
    ['title', 'title'],
    ['summary', 'summary'],
    ['ingredients', 'ingredients'],
    ['directions', 'directions'],
    ['tags', 'tags'],
    ['tips', 'tips'],
    ['cookTime', 'cook_time'],
    ['servings', 'servings'],
    ['category', 'category'],
    ['imageUrl', 'image_url'],
    ['source', 'source'],
    ['isPublic', 'is_public'],
  ]

  fieldMappings.forEach(([appField, dbField]) => {
    if (updates[appField] !== undefined) {
      updateData[dbField] = updates[appField]
    }
  })

  return updateData
}

// Generic error handler
function handleError(operation: string, error: unknown): void {
  // Using console.error for error logging
  // eslint-disable-next-line no-console
  console.error(`Error ${operation}:`, error)
}

// Get all public recipes
export async function getRecipesFromSupabase(): Promise<Recipe[]> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })

    if (error) throw error

    return (data || []).map(mapDbRecipeToRecipe)
  } catch (error) {
    handleError('fetching recipes from Supabase', error)
    return []
  }
}

// Get a single recipe by ID
export async function getRecipeByIdFromSupabase(
  id: string,
): Promise<Recipe | null> {
  try {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    if (!data) return null

    return mapDbRecipeToRecipe(data)
  } catch (error) {
    handleError('fetching recipe', error)
    return null
  }
}

// Search recipes with filters
export async function searchRecipesInSupabase(
  filters: RecipeFilters,
): Promise<Recipe[]> {
  try {
    const supabase = getSupabaseClient()

    let query = supabase
      .from('recipes')
      .select('*')
      .eq('is_public', true)

    // Apply search filter
    if (filters.searchTerm) {
      query = query.or(
        `title.ilike.%${filters.searchTerm}%,summary.ilike.%${filters.searchTerm}%`,
      )
    }

    // Apply category filter
    if (filters.category) {
      query = query.eq('category', filters.category)
    }

    // Apply cooking time filter
    if (filters.maxCookingTime) {
      query = query.lte('cook_time', filters.maxCookingTime)
    }

    const { data, error } = await query.order('created_at', {
      ascending: false,
    })

    if (error) throw error

    return (data || []).map(mapDbRecipeToRecipe)
  } catch (error) {
    handleError('searching recipes', error)
    return []
  }
}

// Create a new recipe
export async function createRecipe(
  recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<Recipe | null> {
  try {
    const supabase = getSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      // eslint-disable-next-line no-console
      console.error('User must be logged in to create recipes')
      return null
    }

    const insertData = mapRecipeToInsert(recipe, user.id)

    const { data, error } = await supabase
      .from('recipes')
      .insert([insertData] as never)
      .select()
      .single()

    if (error) throw error
    if (!data) return null

    return mapDbRecipeToRecipe(data)
  } catch (error) {
    handleError('creating recipe', error)
    return null
  }
}

// Update an existing recipe
export async function updateRecipe(
  id: string,
  updates: Partial<Recipe>,
): Promise<Recipe | null> {
  try {
    const supabase = getSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      // eslint-disable-next-line no-console
      console.error('User must be logged in to update recipes')
      return null
    }

    const updateData = mapRecipeToUpdate(updates)

    const { data, error } = await supabase
      .from('recipes')
      .update(updateData as never)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    if (!data) return null

    return mapDbRecipeToRecipe(data)
  } catch (error) {
    handleError('updating recipe', error)
    return null
  }
}

// Delete a recipe
export async function deleteRecipe(id: string): Promise<boolean> {
  try {
    const supabase = getSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      // eslint-disable-next-line no-console
      console.error('User must be logged in to delete recipes')
      return false
    }

    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error

    return true
  } catch (error) {
    handleError('deleting recipe', error)
    return false
  }
}

// Get all recipes for the current user
export async function getUserRecipes(): Promise<Recipe[]> {
  try {
    const supabase = getSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return (data || []).map(mapDbRecipeToRecipe)
  } catch (error) {
    handleError('fetching user recipes', error)
    return []
  }
}