import type { Metadata } from 'next'

import { RecipeList } from '@/components/pages/Home/RecipeList'
import { getRecipesFromSupabase } from '@/lib/supabase/tables/recipe/getRecipesFromSupabase'

export const metadata: Metadata = {
  title: 'YumYumYumi',
  description: 'Find, save, and share your favorite recipes with YumYumYumi',
}

export default async function HomePage() {
  const recipes = await getRecipesFromSupabase()

  return <RecipeList initialRecipes={recipes} />
}
