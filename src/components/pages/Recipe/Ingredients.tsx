import { useMemo } from 'react'

import styled from '@emotion/styled'

import type { Recipe } from '@/types/recipe'

import { Flex, H2, H3, Label } from '@/components/ui'

export const Ingredients = ({ recipe }: { recipe: Recipe }) => {
  const { spices, regular } = useMemo(() => {
    const ingredients = recipe.ingredients || []
    return {
      spices: ingredients.filter((ingredient) => ingredient.isSpice),
      regular: ingredients.filter((ingredient) => !ingredient.isSpice),
    }
  }, [recipe.ingredients])

  const renderIngredients = (ingredientList: Recipe['ingredients']) => {
    return (
      <>
        {ingredientList?.map((ingredient) => (
          <IngredientItem key={ingredient.name}>
            <Flex justify="between" align="center">
              <span>{ingredient.name}</span>
              <Label>{ingredient.amount}</Label>
            </Flex>
          </IngredientItem>
        ))}
      </>
    )
  }

  return (
    <Section>
      <H2>Ingredients</H2>
      <IngredientList>
        {renderIngredients(regular)}
        <H3>(A)</H3>
        {renderIngredients(spices)}
      </IngredientList>
    </Section>
  )
}

const Section = styled.section`
  margin-block: ${({ theme }) => theme.spacing[6]};
`

const IngredientList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  width: 100%;
`

const IngredientItem = styled.li`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};

  h3 + & {
    border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  }
`
