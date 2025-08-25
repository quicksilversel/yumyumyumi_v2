'use client'

import dynamic from 'next/dynamic'

import type { Recipe } from '@/types'

const RecipeList = dynamic(() => import('./RecipeList').then(mod => ({ default: mod.RecipeList })), {
  ssr: false,
})

type ClientRecipeListProps = {
  initialRecipes: Recipe[]
}

export function ClientRecipeList({ initialRecipes }: ClientRecipeListProps) {
  return <RecipeList initialRecipes={initialRecipes} />
}