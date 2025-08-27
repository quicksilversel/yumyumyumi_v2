'use client'

import { useState, useEffect } from 'react'

import styled from '@emotion/styled'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

import type { Recipe } from '@/types'

import { DeleteRecipeModal } from '@/components/Modal/DeleteRecipeModal'
import { IconButton, Flex, H1, Body, Button } from '@/components/ui'
import { EditRecipeDialog } from '@/components/ui/Modals/EditRecipeDialog'
import { useAuth } from '@/contexts/AuthContext'
import { isBookmarked, toggleBookmark } from '@/lib/supabase/bookmarkService'
type RecipeDetailProps = {
  recipe: Recipe
}

export const Header = ({ recipe }: RecipeDetailProps) => {
  const { user } = useAuth()
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [currentRecipe, setCurrentRecipe] = useState(recipe)

  const isOwner = user && currentRecipe.user_id === user.id

  useEffect(() => {
    setIsBookmarkedState(isBookmarked(recipe.id))
  }, [recipe.id])

  const handleEdit = () => {
    setEditDialogOpen(true)
  }

  const handleRecipeUpdated = (updatedRecipe: Recipe) => {
    setCurrentRecipe(updatedRecipe)
    window.location.reload()
  }

  const [isBookmarkedState, setIsBookmarkedState] = useState(false)

  useEffect(() => {
    setIsBookmarkedState(isBookmarked(recipe.id))
  }, [recipe.id])

  const handleBookmarkClick = () => {
    const newState = toggleBookmark(recipe.id)
    setIsBookmarkedState(newState)
  }

  return (
    <HeaderSection>
      <Flex justify="between" align="start">
        <H1>{recipe.title}</H1>
        <div>
          {isOwner && (
            <>
              <Button variant="ghost" onClick={handleEdit}>
                <EditIcon />
              </Button>
              <Button variant="ghost" onClick={() => setDeleteDialogOpen(true)}>
                <DeleteIcon />
              </Button>
            </>
          )}
          <IconButton
            size="lg"
            onClick={handleBookmarkClick}
            aria-label={isBookmarkedState ? 'Remove bookmark' : 'Add bookmark'}
          >
            {isBookmarkedState ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </IconButton>
        </div>
      </Flex>
      <Body>{recipe.summary}</Body>

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
    </HeaderSection>
  )
}

const HeaderSection = styled.div`
  margin-block: ${({ theme }) => theme.spacing[4]};
`
