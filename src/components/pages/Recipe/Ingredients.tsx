import { useMemo } from 'react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'

import type { Recipe } from '@/types/recipe'

import { H2 } from '@/components/ui'

export const Ingredients = ({ recipe }: { recipe: Recipe }) => {
  const { regularIngredients, spiceIngredients } = useMemo(() => {
    const regular = (recipe.ingredients || []).filter(
      (ingredient) => !ingredient.isSpice,
    )
    const spices = (recipe.ingredients || []).filter(
      (ingredient) => !!ingredient.isSpice,
    )

    return {
      regularIngredients: regular,
      spiceIngredients: spices,
    }
  }, [recipe.ingredients])

  return (
    <Section aria-labelledby="ingredients-heading">
      <H2 id="ingredients-heading">材料</H2>
      {regularIngredients.length > 0 && (
        <IngredientList>
          {regularIngredients.map((ingredient, index) => (
            <IngredientItem
              key={`regular-${ingredient.name}-${index}`}
              isSpice={false}
            >
              <IngredientName>{ingredient.name}</IngredientName>
              <IngredientAmount>{ingredient.amount}</IngredientAmount>
            </IngredientItem>
          ))}
        </IngredientList>
      )}
      {spiceIngredients.length > 0 && (
        <>
          <SpiceHeading>A</SpiceHeading>
          <IngredientList>
            {spiceIngredients.map((ingredient, index) => (
              <IngredientItem
                key={`spice-${ingredient.name}-${index}`}
                isSpice={true}
              >
                <IngredientName>{ingredient.name}</IngredientName>
                <IngredientAmount>{ingredient.amount}</IngredientAmount>
              </IngredientItem>
            ))}
          </IngredientList>
        </>
      )}
    </Section>
  )
}

const Section = styled.section`
  margin-block: ${({ theme }) => theme.spacing[6]};
`

const SpiceHeading = styled.h3`
  margin: ${({ theme }) => theme.spacing[4]} 0
    ${({ theme }) => theme.spacing[2]} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[700]};
`

const IngredientList = styled.ul`
  margin-top: ${({ theme }) => theme.spacing[4]};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
`

const IngredientItem = styled.li<{ isSpice: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};

  &:last-child {
    border-bottom: none;
  }

  ${({ isSpice, theme }) =>
    isSpice &&
    css`
      background-color: ${theme.colors.primary}15;
    `}
`

const IngredientName = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.gray[800]};
`

const IngredientAmount = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
  color: ${({ theme }) => theme.colors.gray[600]};
  white-space: nowrap;
`
