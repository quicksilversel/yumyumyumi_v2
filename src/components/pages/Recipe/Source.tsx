import type { Recipe } from '@/types'

import { Caption } from '@/components/ui'

type RecipeDetailProps = {
  recipe: Recipe
}

export const Source = ({ recipe }: RecipeDetailProps) => {
  if (!recipe.source) return null

  return (
    <section>
      {recipe.source && <Caption>Source: {recipe.source}</Caption>}
    </section>
  )
}
