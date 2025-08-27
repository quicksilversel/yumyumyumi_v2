import { notFound } from 'next/navigation'

import { RecipeDetail } from '@/components/Pages/Recipe/Recipe'
import { getRecipeById, getRecipes } from '@/lib/supabase/recipeService'

export async function generateStaticParams() {
  const recipes = await getRecipes()

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
  const recipe = await getRecipeById(id)

  if (!recipe) {
    return {
      title: 'Recipe Not Found',
    }
  }

  return {
    title: `${recipe.title} - YumYumYumi`,
    description: recipe.summary,
  }
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const recipe = await getRecipeById(id)

  if (!recipe) {
    notFound()
  }

  return <RecipeDetail recipe={recipe} />
}
