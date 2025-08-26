export type Ingredient = {
  name: string
  amount: string
  unit?: string
  isSpice?: boolean
}

export type Direction = {
  title: string
  description?: string
}

export type Recipe = {
  id: string
  user_id?: string | null
  title: string
  summary: string
  ingredients: Ingredient[]
  directions: Direction[]
  tags?: string[]
  tips?: string
  prepTime: number
  cookTime: number
  totalTime: number
  servings: number
  category: RecipeCategory
  imageUrl: string
  source?: string
  isPublic?: boolean
  createdAt: string
  updatedAt: string
}

export const RecipeCategory = {
  APPETIZER: 'Appetizer',
  MAIN_COURSE: 'Main Course',
  DESSERT: 'Dessert',
  BREAKFAST: 'Breakfast',
  LUNCH: 'Lunch',
  DINNER: 'Dinner',
  SNACK: 'Snack',
  BEVERAGE: 'Beverage',
  SALAD: 'Salad',
  SOUP: 'Soup',
  SIDE_DISH: 'Side Dish',
  SAUCE: 'Sauce',
  BAKING: 'Baking',
} as const

export type RecipeCategory =
  (typeof RecipeCategory)[keyof typeof RecipeCategory]

export type RecipeFilters = {
  searchTerm?: string
  category?: RecipeCategory
  maxCookingTime?: number
  ingredients?: string[]
  showBookmarkedOnly?: boolean
}

export type BookmarkedRecipe = {
  recipeId: string
  bookmarkedAt: string
}
