import type { Metadata } from 'next'

import { ClientRecipeList } from '@/components/ClientRecipeList'
import { getRecipes } from '@/lib/recipeService'

export const metadata: Metadata = {
  title: 'YumYumYumi - Discover Amazing Recipes',
  description: 'Find, save, and share your favorite recipes with YumYumYumi',
}

export default async function HomePage() {
  const recipes = await getRecipes()

  return <ClientRecipeList initialRecipes={recipes} />
}
