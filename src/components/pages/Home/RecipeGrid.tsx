'use client'

import styled from '@emotion/styled'

import type { Recipe } from '@/types'

import { Grid, Stack } from '@/components/ui/Layout'
import { H5, Body } from '@/components/ui/Typography'
import { spacing, colors } from '@/styles/designTokens'

import { RecipeCard } from './RecipeCard'

type RecipeGridProps = {
  recipes: Recipe[]
  onBookmarkChange?: () => void
  onEdit?: (recipe: Recipe) => void
  onDelete?: () => void
}

const EmptyState = styled(Stack)`
  text-align: center;
  padding: ${spacing[12]} ${spacing[6]};
  color: ${colors.gray[600]};
`

const RecipeGridContainer = styled(Grid)`
  margin-top: ${spacing[6]};
`

export function RecipeGrid({
  recipes,
  onBookmarkChange,
  onEdit,
  onDelete,
}: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <EmptyState align="center" gap={2}>
        <H5>No recipes found</H5>
        <Body size="sm" muted>
          Try adjusting your search or filters to find more recipes
        </Body>
      </EmptyState>
    )
  }

  return (
    <RecipeGridContainer cols={3} gap={6} responsive>
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onBookmarkChange={onBookmarkChange}
          onEdit={onEdit ? () => onEdit(recipe) : undefined}
          onDelete={onDelete}
        />
      ))}
    </RecipeGridContainer>
  )
}
