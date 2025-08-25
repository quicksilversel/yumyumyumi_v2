'use client'

import { useState } from 'react'

import { css } from '@emotion/css'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import CategoryIcon from '@mui/icons-material/Category'
import GroupIcon from '@mui/icons-material/Group'
import InfoIcon from '@mui/icons-material/Info'
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  Stack,
  Typography,
} from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'

import type { Recipe } from '@/types'

import { isBookmarked, toggleBookmark } from '@/lib/bookmarkService'

type RecipeDetailProps = {
  recipe: Recipe
}

const heroImageStyles = css`
  position: relative;
  width: 100%;
  height: 400px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    height: 250px;
  }
`

const headerStyles = css`
  margin-bottom: 32px;
`

const sectionStyles = css`
  margin-bottom: 32px;
`

const ingredientItemStyles = css`
  padding: 12px 16px;
  margin-bottom: 8px;
  background-color: #f5f5f5;
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #eeeeee;
  }
`

const directionItemStyles = css`
  padding: 16px;
  margin-bottom: 12px;
  background-color: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  position: relative;
  padding-left: 48px;
`

const stepNumberStyles = css`
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  background-color: #ff6b6b;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
`

const tipsBoxStyles = css`
  padding: 16px;
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  margin-top: 24px;
`

export function RecipeDetail({ recipe }: RecipeDetailProps) {
  const [isBookmarkedState, setIsBookmarkedState] = useState(() =>
    isBookmarked(recipe.id),
  )

  const handleBookmarkClick = () => {
    const newState = toggleBookmark(recipe.id)
    setIsBookmarkedState(newState)
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Link href="/" passHref legacyBehavior>
        <Button startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
          Back to Recipes
        </Button>
      </Link>

      <div className={heroImageStyles}>
        <Image
          src={recipe.imageUrl}
          alt={recipe.title}
          fill
          style={{ objectFit: 'cover' }}
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
        />
      </div>

      <div className={headerStyles}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          sx={{ mb: 2 }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            {recipe.title}
          </Typography>
          <IconButton
            onClick={handleBookmarkClick}
            color={isBookmarkedState ? 'primary' : 'default'}
            size="large"
          >
            {isBookmarkedState ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
        </Stack>

        <Typography variant="body1" color="text.secondary" paragraph>
          {recipe.summary}
        </Typography>

        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          <Chip
            icon={<AccessTimeIcon />}
            label={`Prep: ${recipe.prepTime} min`}
            variant="outlined"
          />
          <Chip
            icon={<AccessTimeIcon />}
            label={`Cook: ${recipe.cookTime} min`}
            variant="outlined"
          />
          <Chip
            icon={<AccessTimeIcon />}
            label={`Total: ${recipe.totalTime} min`}
            variant="outlined"
            color="primary"
          />
          <Chip
            icon={<GroupIcon />}
            label={`Serves: ${recipe.servings}`}
            variant="outlined"
          />
          <Chip
            icon={<CategoryIcon />}
            label={recipe.category}
            variant="outlined"
            color="secondary"
          />
        </Stack>
      </div>

      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <div className={sectionStyles}>
            <Typography variant="h5" gutterBottom>
              Ingredients
            </Typography>
            <List disablePadding>
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className={ingredientItemStyles}>
                  <Typography variant="body1">{ingredient}</Typography>
                </div>
              ))}
            </List>
          </div>
        </Grid>

        <Grid item xs={12} md={8}>
          <div className={sectionStyles}>
            <Typography variant="h5" gutterBottom>
              Directions
            </Typography>
            <List disablePadding>
              {recipe.directions.map((direction, index) => (
                <div key={index} className={directionItemStyles}>
                  <div className={stepNumberStyles}>{index + 1}</div>
                  <Typography variant="body1">{direction}</Typography>
                </div>
              ))}
            </List>
          </div>

          {recipe.tips && (
            <div className={tipsBoxStyles}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <InfoIcon color="warning" />
                <Typography variant="h6">Tips</Typography>
              </Stack>
              <Typography variant="body1">{recipe.tips}</Typography>
            </div>
          )}
        </Grid>
      </Grid>

      {recipe.source && (
        <Box sx={{ mt: 4, pt: 2, borderTop: '1px solid #e0e0e0' }}>
          <Typography variant="body2" color="text.secondary">
            Source: {recipe.source}
          </Typography>
        </Box>
      )}
    </Container>
  )
}
