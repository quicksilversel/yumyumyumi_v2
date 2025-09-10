'use client'

import styled from '@emotion/styled'

import type { Recipe } from '@/types/recipe'

import { Directions } from './Directions'
import { Header } from './Header'
import { Ingredients } from './Ingredients'
import { Source } from './Source'
import { Tips } from './Tips'

export const RecipeDetail = (props: { recipe: Recipe }) => {
  return (
    <RecipeContainer>
      <Header {...props} />

      <InnerContainer>
        <Ingredients {...props} />
        <Directions {...props} />
        <Tips {...props} />
        <Source {...props} />
      </InnerContainer>
    </RecipeContainer>
  )
}

const RecipeContainer = styled.main`
  max-width: 1200px;
  margin: 0 auto 1rem;
`

const InnerContainer = styled.div`
  @media (width <= 35.1875rem) {
    margin-inline: ${({ theme }) => theme.spacing[4]};
  }
`
