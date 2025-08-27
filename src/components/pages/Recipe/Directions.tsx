import styled from '@emotion/styled'

import type { Recipe } from '@/types'

import { H2, H3, Body, Container, Stack } from '@/components/ui'

type RecipeDetailProps = {
  recipe: Recipe
}

export const Directions = ({ recipe }: RecipeDetailProps) => {
  return (
    <DirectionContainer>
      <H2>手順</H2>
      <Stack gap={3}>
        <ul>
          {recipe.directions?.map((direction, index) => (
            <DirectionItem key={index}>
              <StepNumber>{index + 1}</StepNumber>
              {direction.title && <H3>{direction.title}</H3>}
              {direction.description && <Body>{direction.description}</Body>}
            </DirectionItem>
          ))}
        </ul>
      </Stack>
    </DirectionContainer>
  )
}

const DirectionContainer = styled(Container)`
  margin-top: 2rem;
`

const DirectionItem = styled.li`
  padding: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};

  position: relative;
  padding-left: ${({ theme }) => theme.spacing[12]};
`

const StepNumber = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing[4]};
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`
