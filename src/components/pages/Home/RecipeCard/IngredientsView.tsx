import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import type { Recipe } from '@/types'

export const IngredientsView = ({ recipe }: { recipe: Recipe }) => {
  return (
    <Container>
      <IngredientsContent>
        <IngredientsTitle>材料（{recipe.servings}人分）</IngredientsTitle>
        <IngredientsList>
          {recipe.ingredients?.map((ingredient, index) => (
            <IngredientItem key={index}>
              <IngredientName>{ingredient.name}</IngredientName>
              <IngredientAmount>{ingredient.amount}</IngredientAmount>
            </IngredientItem>
          ))}
        </IngredientsList>
      </IngredientsContent>
    </Container>
  )
}

const fadeInAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const Container = styled.div`
  position: absolute;
  z-index: 5;
  padding: ${({ theme }) => theme.spacing[4]};
  background: rgb(255, 255, 255, 98%);
  animation: ${fadeInAnimation} 0.3s ease;
  inset: 0;
`

const IngredientsContent = styled.div`
  width: 100%;
  max-height: 100%;
  overflow-y: auto;
`

const IngredientsTitle = styled.span`
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`

const IngredientsList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`

const IngredientItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[2]} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};

  &:last-child {
    border-bottom: none;
  }
`

const IngredientName = styled.span`
  color: ${({ theme }) => theme.colors.black};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`

const IngredientAmount = styled.span`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`
