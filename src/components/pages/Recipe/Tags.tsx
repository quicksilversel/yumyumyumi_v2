'use client'

import styled from '@emotion/styled'

import type { Recipe } from '@/types'

import { Chip, ChipGroup } from '@/components/ui'
type RecipeDetailProps = {
  recipe: Recipe
}

export const Tags = ({ recipe }: RecipeDetailProps) => {
  return (
    <HeaderSection>
      {recipe.tags && recipe.tags.length > 0 && (
        <ChipGroup>
          {recipe.tags.map((tag, index) => (
            <Chip key={index}>{tag}</Chip>
          ))}
        </ChipGroup>
      )}
    </HeaderSection>
  )
}

const HeaderSection = styled.div`
  margin-block: ${({ theme }) => theme.spacing[8]};
`
