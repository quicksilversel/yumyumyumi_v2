'use client'

import styled from '@emotion/styled'

import type { Recipe } from '@/types'

import { Directions } from './Directions'
import { Header } from './Header'
import { Hero } from './Hero'
import { Info } from './Info'
import { Ingredients } from './Ingredients'
import { Source } from './Source'
import { Tags } from './Tags'
import { Tips } from './Tips'

export const RecipeDetail = (props: { recipe: Recipe }) => {
  return (
    <RecipeContainer>
      <Hero {...props} />
      <Header {...props} />
      <Info {...props} />
      <Ingredients {...props} />
      <Source {...props} />
      <Directions {...props} />
      <Tips {...props} />
      <Tags {...props} />
    </RecipeContainer>
  )
}

const RecipeContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`
