import styled from '@emotion/styled'
import InfoIcon from '@mui/icons-material/Info'

import type { Recipe } from '@/types'

import { H2, Body } from '@/components/ui'

type RecipeDetailProps = {
  recipe: Recipe
}

export const Tips = ({ recipe }: RecipeDetailProps) => {
  if (!recipe.tips) return null

  return (
    <TipsBox>
      <TitleContainer>
        <StyledInfoIcon />
        <H2>Tips</H2>
      </TitleContainer>
      <Body size="sm">{recipe.tips}</Body>
    </TipsBox>
  )
}

const TipsBox = styled.div`
  margin-top: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.primary}20;
`

const StyledInfoIcon = styled(InfoIcon)`
  margin-right: 0.25rem;
  color: ${({ theme }) => theme.colors.primary};
`

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`
