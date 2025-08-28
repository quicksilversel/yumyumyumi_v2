import styled from '@emotion/styled'

import type { Recipe } from '@/types'

import { H2, Body, Grid, Stack } from '@/components/ui'

import { RecipeCard } from './RecipeCard'

type RecipeGridProps = {
  recipes: Recipe[]
  onBookmarkChange?: () => void
  onEdit?: (recipe: Recipe) => void
  onDelete?: () => void
}

export function RecipeGrid({
  recipes,
  onBookmarkChange,
  onEdit,
  onDelete,
}: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <EmptyState align="center" gap={2}>
        <H2>No recipes found</H2>
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

const EmptyState = styled(Stack)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`

const RecipeGridContainer = styled(Grid)`
  margin-top: ${({ theme }) => theme.spacing[6]};
`
