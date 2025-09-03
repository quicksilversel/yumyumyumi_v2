import styled from '@emotion/styled'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import LocalDiningIcon from '@mui/icons-material/LocalDining'

import type { Recipe } from '@/types'

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
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const Summary = styled.span`
  display: -webkit-box;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  flex-grow: 1;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`

const RecipeInfo = styled(Flex)`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  svg {
    font-size: 18px;
  }
`
