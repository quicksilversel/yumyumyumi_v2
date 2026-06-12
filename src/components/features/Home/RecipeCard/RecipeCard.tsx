import styled from '@emotion/styled'
import Link from 'next/link'

import type { Recipe } from '@/types/recipe'

import { useRecipeContext } from '@/contexts/RecipeContext'

import { IngredientsView } from './IngredientsView'
import { RecipeCardBody } from './RecipeCardBody'
import { RecipeCardHead } from './RecipeCardHead'
import { RecipeCardMenu } from './RecipeCardMenu'

export const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  const { expandedRecipeId } = useRecipeContext()

  const isInIngredientView = expandedRecipeId === recipe.id

  if (!recipe.title?.length) return null

  return (
    <StyledCard>
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

const StyledCard = styled.article`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`

const StyledLink = styled(Link)`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  height: 100%;
`
