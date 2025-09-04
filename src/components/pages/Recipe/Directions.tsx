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
            {direction.title && <Title>{direction.title}</Title>}
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

  &::before {
    position: absolute;
    top: 20px;
    left: 0;
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

const Title = styled(H2)`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  line-height: 1.6;
`
