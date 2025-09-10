import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import type { Recipe } from '@/types/recipe'

export const IngredientsView = ({ recipe }: { recipe: Recipe }) => {
  return (
    <Container>
      <Title>材料（{recipe.servings}人分）</Title>
      <ul>
        {recipe.ingredients?.map((ingredient, index) => (
          <Item key={index}>
            <Name>{ingredient.name}</Name>
            <Amount>{ingredient.amount}</Amount>
          </Item>
        ))}
      </ul>
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
  width: 100%;
  max-height: 310px;
  padding: ${({ theme }) => theme.spacing[4]};
  background: rgb(255, 255, 255, 98%);
  animation: ${fadeInAnimation} 0.3s ease;
  inset: 0;
  overflow-y: auto;
`

const Title = styled.span`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`

const Item = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[2]} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};

  &:last-child {
    border-bottom: none;
  }
`

const Name = styled.span`
  color: ${({ theme }) => theme.colors.black};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`

const Amount = styled.span`
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`
