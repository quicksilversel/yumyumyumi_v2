import type { Metadata } from 'next'

import { RecipeList } from '@/components/Pages/Home/RecipeList'
import { getRecipes } from '@/lib/supabase/recipeService'

export const metadata: Metadata = {
  title: 'YumYumYumi - Discover Amazing Recipes',
  description: 'Find, save, and share your favorite recipes with YumYumYumi',
}

export default async function HomePage() {
  const recipes = await getRecipes()

  return <RecipeList initialRecipes={recipes} />
}
