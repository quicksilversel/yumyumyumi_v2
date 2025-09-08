import styled from '@emotion/styled'

import type { Recipe } from '@/types/recipe'

import { Caption } from '@/components/ui'

type RecipeDetailProps = {
  recipe: Recipe
}

export const Source = ({ recipe }: RecipeDetailProps) => {
  if (!recipe.source) return null

  return (
    <Section>
      {recipe.source && <Caption>Source: {recipe.source}</Caption>}
    </Section>
  )
}

const Section = styled.section`
  margin-top: ${({ theme }) => theme.spacing[6]};
`
