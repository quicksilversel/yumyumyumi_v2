import styled from '@emotion/styled'

import type { Recipe } from '@/types'

import { H2 } from '@/components/ui'
import { Container, Flex, Stack } from '@/components/ui'
import { Caption, Label } from '@/components/ui/Typography'
type RecipeDetailProps = {
  recipe: Recipe
}

export const Ingredients = ({ recipe }: RecipeDetailProps) => {
  return (
    <Container>
      <H2>材料（{recipe.servings}人前）</H2>
      <Stack gap={2}>
        {recipe.ingredients?.map((ingredient) => {
          return (
            <IngredientItem key={ingredient.name}>
              <Flex justify="between" align="center">
                <p>{ingredient.name}</p>
                <Label>
                  {ingredient.amount} {ingredient.unit}
                </Label>
              </Flex>
              {ingredient.isSpice && (
                <Caption>Spice</Caption>
              )}
            </IngredientItem>
          )
        })}
      </Stack>
    </Container>
  )
}

const IngredientItem = styled.div`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
  border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};

  &:last-child {
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  }
`
