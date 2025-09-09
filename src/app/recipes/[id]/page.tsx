import { notFound } from 'next/navigation'

import { RecipeDetail } from '@/components/pages/Recipe/Recipe'
import { getRecipeByIdFromSupabase } from '@/lib/supabase/tables/recipe/getRecipeByIdFromSupabase'
import { getRecipesFromSupabase } from '@/lib/supabase/tables/recipe/getRecipesFromSupabase'

export const revalidate = 3600 // 1 hour

export const dynamicParams = true

export async function generateStaticParams() {
  const recipes = await getRecipesFromSupabase()

  return recipes.map((recipe) => ({
    id: recipe.id,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const recipe = await getRecipeByIdFromSupabase(id)

  if (!recipe) {
    return {
      title: 'Recipe Not Found',
    }
  }

  return {
    title: `${recipe.title} - YumYumYumi`,
    description: recipe.summary || recipe.title,
  }
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const recipe = await getRecipeByIdFromSupabase(id)

  if (!recipe) {
    notFound()
  }

  return <RecipeDetail recipe={recipe} />
}
