import styled from '@emotion/styled'

import { H2, Body, Grid, Stack } from '@/components/ui'
import { useRecipeContext } from '@/contexts/RecipeContext'

import { RecipeCard } from './RecipeCard'

export function RecipeGrid() {
  const { filteredRecipes } = useRecipeContext()

  if (filteredRecipes.length === 0) {
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
    <Container cols={3} gap={6} responsive>
      {filteredRecipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </Container>
  )
}

const EmptyState = styled(Stack)`
  padding: ${({ theme }) => theme.spacing[6]};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  text-align: center;
`

const Container = styled(Grid)`
  padding-block: ${({ theme }) => theme.spacing[6]};
`
