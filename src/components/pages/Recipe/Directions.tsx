import styled from '@emotion/styled'

import type { Recipe } from '@/types/recipe'

import { H2, Body } from '@/components/ui'

type RecipeDetailProps = {
  recipe: Recipe
}

export const Directions = ({ recipe }: RecipeDetailProps) => {
  return (
    <DirectionContainer>
      <H2>Directions</H2>
      <DirectionList>
        {recipe.directions?.map((direction, index) => (
          <DirectionItem key={index}>
            {direction.title && (
              <DirectionTitle size="sm">{direction.title}</DirectionTitle>
            )}
            {direction.description && (
              <Body size="sm">{direction.description}</Body>
            )}
          </DirectionItem>
        ))}
      </DirectionList>
    </DirectionContainer>
  )
}

const DirectionContainer = styled.section`
  margin-top: 2rem;
`

const DirectionList = styled.ol`
  margin-top: ${({ theme }) => theme.spacing[4]};
  counter-reset: list-item;
`

const DirectionItem = styled.li`
  position: relative;
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[8]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};

  &:last-child {
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  }
`

const DirectionTitle = styled(Body)`
  position: relative;

  &:has(+ ${Body}) {
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  }

  &::before {
    position: absolute;
    top: 0;
    left: -${({ theme }) => theme.spacing[8]};
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
    content: counter(list-item);
  }
`
