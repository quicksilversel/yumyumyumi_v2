import type { Metadata } from 'next'

import { RecipeList } from '@/components/features/Home/RecipeList'
import { getRecipes } from '@/lib/db/queries/recipe/getRecipes'

export const revalidate = 3600 // 1 hour

export const metadata: Metadata = {
  title: 'YumYumYumi',
  description: 'Find, save, and share your favorite recipes with YumYumYumi',
}

export default async function HomePage() {
  const recipes = await getRecipes()

  return <RecipeList initialRecipes={recipes} />
}
