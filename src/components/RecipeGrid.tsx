'use client'

import { css } from '@emotion/css'
import { Grid, Typography } from '@mui/material'

import type { Recipe } from '@/types'

import { RecipeCard } from './RecipeCard'

type RecipeGridProps = {
  recipes: Recipe[]
  onBookmarkChange?: () => void
}

const gridContainerStyles = css`
  margin-top: 24px;
`

const emptyStateStyles = css`
  text-align: center;
  padding: 48px 24px;
  color: #666;
`

export function RecipeGrid({ recipes, onBookmarkChange }: RecipeGridProps) {
  if (recipes.length === 0) {
    return (
      <div className={emptyStateStyles}>
        <Typography variant="h6" gutterBottom>
          No recipes found
        </Typography>
        <Typography variant="body2">
          Try adjusting your search or filters to find more recipes
        </Typography>
      </div>
    )
  }

  return (
    <Grid container spacing={3} className={gridContainerStyles}>
      {recipes.map((recipe) => (
        <Grid item xs={12} sm={6} md={4} key={recipe.id}>
          <RecipeCard recipe={recipe} onBookmarkChange={onBookmarkChange} />
        </Grid>
      ))}
    </Grid>
  )
}
