import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import Link from 'next/link'

import type { Recipe } from '@/types/recipe'

import { useRecipeContext } from '@/contexts/RecipeContext'

import { IngredientsView } from './IngredientsView'
import { RecipeCardBody } from './RecipeCardBody'
import { RecipeCardHead } from './RecipeCardHead'
import { RecipeCardMenu } from './RecipeCardMenu'

type Props = {
  recipe: Recipe
  index?: number
}

export const RecipeCard = ({ recipe, index = 0 }: Props) => {
  const { expandedRecipeId } = useRecipeContext()

  const isInIngredientView = expandedRecipeId === recipe.id

  if (!recipe.title?.length) return null

  return (
    <StyledCard style={{ animationDelay: `${Math.min(index * 0.04, 0.4)}s` }}>
      <RecipeCardMenu recipe={recipe} isInIngredientView={isInIngredientView} />
      {isInIngredientView ? (
        <IngredientsView recipe={recipe} />
      ) : (
        <StyledLink href={`/recipes/${recipe.id}`}>
          <RecipeCardHead recipe={recipe} />
          <RecipeCardBody recipe={recipe} />
        </StyledLink>
      )}
    </StyledCard>
  )
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const StyledCard = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadow.xs};
  opacity: 0;
  transition:
    transform ${({ theme }) => theme.transition.default},
    box-shadow ${({ theme }) => theme.transition.default};
  animation: ${fadeIn} 0.4s ease forwards;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadow.lg};
    transform: translateY(-4px);
  }

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    animation: none;

    &:hover {
      transform: none;
    }
  }
`

const StyledLink = styled(Link)`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  height: 100%;
`
