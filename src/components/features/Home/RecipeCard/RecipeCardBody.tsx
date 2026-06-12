import styled from '@emotion/styled'
import {
  Clock as AccessTimeIcon,
  Utensils as LocalDiningIcon,
} from 'lucide-react'

import type { Recipe } from '@/types/recipe'

import { Flex, Caption } from '@/components/ui'

export const RecipeCardBody = ({ recipe }: { recipe: Recipe }) => {
  return (
    <Container>
      <Title>{recipe.title}</Title>
      {recipe.summary && <Summary>{recipe.summary}</Summary>}
      <RecipeInfo gap={3}>
        <Flex align="center" gap={1}>
          <AccessTimeIcon />
          <Caption>{recipe.cookTime} min</Caption>
        </Flex>
        <Flex align="center" gap={1}>
          <LocalDiningIcon />
          <Caption>{recipe.servings} servings</Caption>
        </Flex>
      </RecipeInfo>
    </Container>
  )
}

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
`

const Title = styled.span`
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 1;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  -webkit-box-orient: vertical;
`

const Summary = styled.span`
  display: -webkit-box;
  flex-grow: 1;
  overflow: hidden;
  -webkit-line-clamp: 2;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  -webkit-box-orient: vertical;
`

const RecipeInfo = styled(Flex)`
  margin-top: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[600]};

  svg {
    width: 1em;
    height: 1em;
  }
`
