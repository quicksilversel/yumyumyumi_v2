import styled from '@emotion/styled'

import type { Recipe } from '@/types'

import { H2, H3, Body } from '@/components/ui'

type RecipeDetailProps = {
  recipe: Recipe
}

export const Directions = ({ recipe }: RecipeDetailProps) => {
  return (
    <DirectionContainer>
      <H2>手順</H2>
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
  counter-reset: list-item;
  margin-top: ${({ theme }) => theme.spacing[4]};
`

const DirectionItem = styled.li`
  position: relative;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  padding: ${({ theme }) => theme.spacing[4]} ${({ theme }) => theme.spacing[8]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};

  &:last-child {
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  }

  &::before {
    content: counter(list-item);
    position: absolute;
    top: 20px;
    left: 0;
    width: 24px;
    height: 24px;
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  }
`

const Title = styled(H3)`
  line-height: 1.6;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`
