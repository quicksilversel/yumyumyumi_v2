import type { Recipe } from '@/types'

import { Container, Caption } from '@/components/ui'

type RecipeDetailProps = {
  recipe: Recipe
}

export const Source = ({ recipe }: RecipeDetailProps) => {
  if (!recipe.source) return null

  return (
    <Container>
      {recipe.source && <Caption>Source: {recipe.source}</Caption>}
    </Container>
  )
}
