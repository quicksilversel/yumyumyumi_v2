'use client'

import { useState, useRef, useEffect } from 'react'

import styled from '@emotion/styled'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import LocalDiningIcon from '@mui/icons-material/LocalDining'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import type { Recipe } from '@/types'

import { IconButton } from '@/components/ui/Button'
import {
  Card as BaseCard,
  CardMedia as BaseCardMedia,
  CardContent,
} from '@/components/ui/Card'
import { Chip } from '@/components/ui/Chip'
import { Flex } from '@/components/ui/Layout'
import { H5, Body, Caption } from '@/components/ui/Typography'
import { useAuth } from '@/contexts/AuthContext'
import { isBookmarked, toggleBookmark } from '@/lib/supabase/bookmarkService'
import { deleteRecipe } from '@/lib/supabase/supabaseRecipeService'
import {
  colors,
  spacing,
  shadow,
  borderRadius,
  transition,
  typography,
} from '@/styles/designTokens'

// Styled Components
const StyledCard = styled(BaseCard)`
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
`

const CardOverlay = styled.div`
  position: absolute;
  top: ${spacing[2]};
  right: ${spacing[2]};
  z-index: 10;
  display: flex;
  gap: ${spacing[1]};
`

const CardMediaWrapper = styled(BaseCardMedia)`
  height: 240px;
  position: relative;
  overflow: hidden;

  img {
    transition: transform ${transition.slow};
  }

  ${StyledCard}:hover & img {
    transform: scale(1.05);
  }
`

const MediaGradient = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 100%);
  pointer-events: none;
`

const CategoryChip = styled(Chip)`
  position: absolute;
  bottom: ${spacing[3]};
  left: ${spacing[3]};
  background-color: ${colors.white};
  color: ${colors.black};
`

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`

const StyledIconButton = styled(IconButton)`
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);

  &:hover {
    background-color: rgba(255, 255, 255, 0.95);
  }
`

const Menu = styled.div<{ open: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: ${spacing[1]};
  background-color: ${colors.white};
  border: 1px solid ${colors.gray[200]};
  border-radius: ${borderRadius.lg};
  box-shadow: ${shadow.lg};
  min-width: 180px;
  z-index: 1000;
  display: ${(props) => (props.open ? 'block' : 'none')};
`

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
  width: 100%;
  padding: ${spacing[3]} ${spacing[4]};
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${typography.fontSize.sm};
  color: ${colors.black};
  text-align: left;
  transition: background-color ${transition.fast};

  &:hover {
    background-color: ${colors.gray[50]};
  }

  &:first-of-type {
    border-radius: ${borderRadius.lg} ${borderRadius.lg} 0 0;
  }

  &:last-of-type {
    border-radius: 0 0 ${borderRadius.lg} ${borderRadius.lg};
  }

  svg {
    font-size: 18px;
  }
`

const RecipeInfo = styled(Flex)`
  color: ${colors.gray[600]};
  font-size: ${typography.fontSize.sm};

  svg {
    font-size: 18px;
  }
`

type RecipeCardProps = {
  recipe: Recipe
  onBookmarkChange?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export function RecipeCard({
  recipe,
  onBookmarkChange,
  onEdit,
  onDelete,
}: RecipeCardProps) {
  // All hooks must be called before any conditional returns
  const { user } = useAuth()
  const router = useRouter()
  const [isBookmarkedState, setIsBookmarkedState] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  
  // Initialize bookmark state after mount to avoid hydration mismatch
  useEffect(() => {
    setIsBookmarkedState(isBookmarked(recipe.id))
  }, [recipe.id])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [menuOpen])

  // Early return after all hooks have been called
  if (!recipe.title?.length) return null

  const isOwner = user && recipe.user_id === user.id

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newState = toggleBookmark(recipe.id)
    setIsBookmarkedState(newState)
    onBookmarkChange?.()
  }

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setMenuOpen(!menuOpen)
  }

  const handleMenuClose = () => {
    setMenuOpen(false)
  }

  const handleEdit = () => {
    handleMenuClose()
    if (onEdit) {
      onEdit()
    } else {
      router.push(`/recipes/${recipe.id}/edit`)
    }
  }

  const handleDelete = async () => {
    handleMenuClose()
    if (window.confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
      setIsDeleting(true)
      const success = await deleteRecipe(recipe.id)
      if (success) {
        onDelete?.()
        window.location.reload()
      } else {
        alert('Failed to delete recipe')
      }
      setIsDeleting(false)
    }
  }

  return (
    <StyledCard hoverable noPadding>
      <CardOverlay>
        <StyledIconButton onClick={handleBookmarkClick} size="sm">
          {isBookmarkedState ? (
            <BookmarkIcon style={{ color: colors.black }} />
          ) : (
            <BookmarkBorderIcon />
          )}
        </StyledIconButton>

        {isOwner && (
          <div style={{ position: 'relative' }} ref={menuRef}>
            <StyledIconButton
              onClick={handleMenuToggle}
              size="sm"
              disabled={isDeleting}
            >
              <MoreVertIcon />
            </StyledIconButton>
            <Menu open={menuOpen}>
              <MenuItem onClick={handleEdit}>
                <EditIcon />
                <span>Edit Recipe</span>
              </MenuItem>
              <MenuItem onClick={handleDelete}>
                <DeleteIcon style={{ color: colors.error }} />
                <span>Delete Recipe</span>
              </MenuItem>
            </Menu>
          </div>
        )}
      </CardOverlay>

      <StyledLink href={`/recipes/${recipe.id}`}>
        <CardMediaWrapper>
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
          <MediaGradient />
          <CategoryChip size="sm">{recipe.category}</CategoryChip>
        </CardMediaWrapper>

        <CardContent>
          <H5
            style={{
              marginBottom: spacing[2],
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as any,
              overflow: 'hidden',
            }}
          >
            {recipe.title}
          </H5>

          <Body
            size="sm"
            muted={true}
            style={{
              marginBottom: spacing[4],
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as any,
              overflow: 'hidden',
              flexGrow: 1,
            }}
          >
            {recipe.summary}
          </Body>

          <RecipeInfo gap={3}>
            <Flex align="center" gap={1}>
              <AccessTimeIcon />
              <Caption>{recipe.totalTime} min</Caption>
            </Flex>
            <Flex align="center" gap={1}>
              <LocalDiningIcon />
              <Caption>{recipe.servings} servings</Caption>
            </Flex>
          </RecipeInfo>
        </CardContent>
      </StyledLink>
    </StyledCard>
  )
}
