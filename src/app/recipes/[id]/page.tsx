import { notFound } from 'next/navigation'

import { RecipeDetail } from '@/components/features/Recipe/Recipe'
import { getRecipeById } from '@/lib/db/queries/recipe/getRecipeById'
import { getRecipes } from '@/lib/db/queries/recipe/getRecipes'

export const revalidate = 3600 // 1 hour

export const dynamicParams = true

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
    description: recipe.summary || recipe.title,
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
