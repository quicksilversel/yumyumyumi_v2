import { useState, useEffect } from 'react'

import styled from '@emotion/styled'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Image from 'next/image'

import type { Recipe } from '@/types'

import { IconButton } from '@/components/ui'
import { DeleteRecipeModal } from '@/components/ui/Modals/DeleteRecipeModal'
import { EditRecipeDialog } from '@/components/ui/Modals/EditRecipeDialog'
import { useAuth } from '@/contexts/AuthContext'
import { isBookmarked, toggleBookmark } from '@/lib/supabase/bookmarkService'
import { deleteRecipe } from '@/lib/supabase/supabaseRecipeService'

export const Hero = ({ recipe }: { recipe: Recipe }) => {
  const { user } = useAuth()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [currentRecipe, setCurrentRecipe] = useState(recipe)
  const [isBookmarkedState, setIsBookmarkedState] = useState(false)

  useEffect(() => {
    setIsBookmarkedState(isBookmarked(recipe.id))
  }, [recipe.id])

  const handleBookmarkClick = () => {
    const newState = toggleBookmark(recipe.id)
    setIsBookmarkedState(newState)
  }

  const isOwner = user && currentRecipe.user_id === user.id

  const handleEdit = () => {
    setEditDialogOpen(true)
  }

  const handleRecipeUpdated = (updatedRecipe: Recipe) => {
    setCurrentRecipe(updatedRecipe)
    window.location.reload()
  }
  const [isDeleting, setIsDeleting] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setMenuOpen(!menuOpen)
  }

  const handleDelete = async () => {
    setMenuOpen(false)
    if (window.confirm(`Are you sure you want to delete "${recipe.title}"?`)) {
      setIsDeleting(true)
      const success = await deleteRecipe(recipe.id)
      if (success) {
        window.location.reload()
      } else {
        alert('Failed to delete recipe')
      }
      setIsDeleting(false)
    }
  }

  return (
    <>
      <ImageContainer>
        <Image
          src={
            recipe.imageUrl ||
            'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'
          }
          alt={recipe.title}
          fill
          objectFit="cover"
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
        />
        {user && (
          <BookmarkButton
            size="sm"
            onClick={handleBookmarkClick}
            aria-label={isBookmarkedState ? 'Remove bookmark' : 'Add bookmark'}
          >
            {isBookmarkedState ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </BookmarkButton>
        )}
        {isOwner && (
          <>
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
                <DeleteIcon />
                <span>Delete Recipe</span>
              </MenuItem>
            </Menu>
          </>
        )}
      </ImageContainer>
      <EditRecipeDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        recipe={currentRecipe}
        onRecipeUpdated={handleRecipeUpdated}
      />
      <DeleteRecipeModal
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        recipe={currentRecipe}
      />
    </>
  )
}

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
`

const StyledIconButton = styled(IconButton)`
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);

  &:hover {
    background-color: rgba(255, 255, 255, 0.95);
  }
`

const BookmarkButton = styled(StyledIconButton)`
  right: 50px;
`

const Menu = styled.div<{ open: boolean }>`
  position: absolute;
  top: 50px;
  right: 12px;
  margin-top: ${({ theme }) => theme.spacing[1]};
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadow.lg};
  min-width: 180px;
  z-index: 1000;
  display: ${(props) => (props.open ? 'block' : 'none')};
`

const MenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[4]};
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: none;
  border: none;
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.black};
  text-align: left;
  transition: background-color ${({ theme }) => theme.transition.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }

  &:first-of-type {
    border-radius: ${({ theme }) => theme.borderRadius.lg}
      ${({ theme }) => theme.borderRadius.lg} 0 0;
  }

  svg {
    font-size: 18px;
  }
`
