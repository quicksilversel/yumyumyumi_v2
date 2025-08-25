import { notFound } from 'next/navigation'

import { RecipeDetail } from '@/components/RecipeDetail'
import { getRecipeById, getRecipes } from '@/lib/recipeService'

export async function generateStaticParams() {
  const recipes = await getRecipes()

  return recipes.map((recipe) => ({
    id: recipe.id,
  }))
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const recipe = await getRecipeById(params.id)

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
  params: { id: string }
}) {
  const recipe = await getRecipeById(params.id)

  if (!recipe) {
    notFound()
  }

  return <RecipeDetail recipe={recipe} />
}
