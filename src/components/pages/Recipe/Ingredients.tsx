import { useMemo } from 'react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import type { Recipe } from '@/types/recipe'

import { Flex, H2, Label } from '@/components/ui'

export const Ingredients = ({ recipe }: { recipe: Recipe }) => {
  const sortedIngredientList = useMemo(() => {
    return (recipe.ingredients || []).sort(
      (a, b) => Number(a.isSpice) - Number(b.isSpice),
    )
  }, [recipe.ingredients])

  return (
    <Section>
      <H2>Ingredients</H2>
      <IngredientList>
        {sortedIngredientList?.map((ingredient, index) => (
          <IngredientItem
            key={ingredient.name + index}
            isSpice={!!ingredient.isSpice}
          >
            <Flex justify="between" align="center">
              <span>
                {!!ingredient.isSpice && '（A）'} {ingredient.name}
              </span>
              <Label>{ingredient.amount}</Label>
            </Flex>
          </IngredientItem>
        ))}
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
  width: 100%;
`

const IngredientItem = styled.li<{ isSpice: boolean }>`
  position: relative;
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[2]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  &:first-child {
    margin-top: ${({ theme }) => theme.spacing[4]};
  }

  ${({ isSpice, theme }) =>
    isSpice &&
    css`
      background-color: ${theme.colors.gray[100]};
    `}
`
