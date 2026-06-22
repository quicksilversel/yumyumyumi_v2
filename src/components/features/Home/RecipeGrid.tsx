import styled from '@emotion/styled'

import { H2, Body, Grid, Stack } from '@/components/ui'
import { useRecipeContext } from '@/contexts/RecipeContext'

import { RecipeCard } from './RecipeCard'

export function RecipeGrid() {
  const { filteredRecipes } = useRecipeContext()

  if (filteredRecipes.length === 0) {
    return (
      <EmptyState align="center" gap={2}>
        <H2>レシピが見つかりませんでした</H2>
        <Body size="sm" muted>
          検索条件やフィルターを変えてお試しください
        </Body>
      </EmptyState>
    )
  }

  return (
    <Container cols={3} gap={6} responsive>
      {filteredRecipes.map((recipe, index) => (
        <RecipeCard key={recipe.id} recipe={recipe} index={index} />
      ))}
    </Container>
  )
}

const EmptyState = styled(Stack)`
  padding: ${({ theme }) => theme.spacing[6]};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-align: center;
`

const Container = styled(Grid)`
  padding-block: ${({ theme }) => theme.spacing[6]};
`
