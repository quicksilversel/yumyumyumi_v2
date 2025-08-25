'use client'

import { useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import AccessTimeIcon from '@mui/icons-material/AccessTime'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import LocalDiningIcon from '@mui/icons-material/LocalDining'
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'

import type { Recipe } from '@/types'

import { isBookmarked, toggleBookmark } from '@/lib/bookmarkService'

type RecipeCardProps = {
  recipe: Recipe
  onBookmarkChange?: () => void
}

export function RecipeCard({ recipe, onBookmarkChange }: RecipeCardProps) {
  if (!recipe.title?.length) return null

  const [isBookmarkedState, setIsBookmarkedState] = useState(() =>
    isBookmarked(recipe.id),
  )

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newState = toggleBookmark(recipe.id)
    setIsBookmarkedState(newState)
    onBookmarkChange?.()
  }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-8px)',
          '& .MuiCardMedia-root img': {
            transform: 'scale(1.05)',
          },
        },
      }}
    >
      <IconButton
        onClick={handleBookmarkClick}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
          },
        }}
        size="small"
      >
        {isBookmarkedState ? (
          <BookmarkIcon color="primary" />
        ) : (
          <BookmarkBorderIcon />
        )}
      </IconButton>

      <Link href={`/recipes/${recipe.id}`} passHref legacyBehavior>
        <CardActionArea
          sx={{
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
          }}
        >
          <CardMedia
            sx={{
              height: 240,
              position: 'relative',
              overflow: 'hidden',
              '& img': {
                transition: 'transform 0.3s ease',
              },
            }}
          >
            <Image
              src={
                recipe.imageUrl ||
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'
              }
              alt={recipe.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '60%',
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                pointerEvents: 'none',
              }}
            />
            <Chip
              label={recipe.category}
              size="small"
              sx={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                backgroundColor: 'primary.main',
                color: 'white',
                fontWeight: 600,
              }}
            />
          </CardMedia>

          <CardContent
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              p: 2.5,
            }}
          >
            <Typography
              variant="h6"
              component="h3"
              gutterBottom
              sx={{
                fontWeight: 600,
                lineHeight: 1.3,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                mb: 1.5,
              }}
            >
              {recipe.title}
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                mb: 2,
                flexGrow: 1,
              }}
            >
              {recipe.summary}
            </Typography>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTimeIcon
                  sx={{ fontSize: 18, color: 'text.secondary' }}
                />
                <Typography variant="body2" color="text.secondary">
                  {recipe.totalTime} min
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LocalDiningIcon
                  sx={{ fontSize: 18, color: 'text.secondary' }}
                />
                <Typography variant="body2" color="text.secondary">
                  {recipe.servings} servings
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Link>
    </Card>
  )
}
