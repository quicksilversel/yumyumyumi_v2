import { useState } from 'react'

import styled from '@emotion/styled'

import type { Recipe } from '@/types/recipe'

import { DeleteRecipeModal } from '@/components/pages/Modals/DeleteRecipeModal'
import { EditRecipeDialog } from '@/components/pages/Modals/EditRecipeDialog'
import { BookmarkButton } from '@/components/ui/BookmarkButton'
import { MoreActions } from '@/components/ui/MoreActions'
import { RecipeImage } from '@/components/ui/RecipeImage'
import { useAuth } from '@/contexts/AuthContext'
import { useRecipeActions } from '@/hooks/useRecipeActions'

export const Hero = ({ recipe }: { recipe: Recipe }) => {
  const { user } = useAuth()
  const [currentRecipe, setCurrentRecipe] = useState(recipe)

  const {
    isDeleting,
    editDialogOpen,
    setEditDialogOpen,
    handleEdit,
    handleDelete,
    deleteDialogOpen,
    setDeleteDialogOpen,
    confirmDelete,
    deleteError,
  } = useRecipeActions(currentRecipe, { redirectOnDelete: true })

  const isOwner = user && currentRecipe.userId === user.id

  const handleRecipeUpdated = (updatedRecipe: Recipe) => {
    setCurrentRecipe(updatedRecipe)
    window.location.reload()
  }

  return (
    <ImageContent>
      <ImageContainer>
        <RecipeImage
          src={recipe.imageUrl}
          alt={recipe.title}
          seed={recipe.id}
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
        />
        {user && <StyledBookmarkButton recipeId={currentRecipe.id} size="sm" />}
        {isOwner && (
          <StyledMoreActions
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
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
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
        recipeTitle={currentRecipe.title}
        error={deleteError}
      />
    </ImageContent>
  )
}

const ImageContent = styled.div`
  @media (width <= 768px) {
    order: 1;
  }
`

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;

  @media (width > 35.1875rem) {
    overflow: hidden;
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    box-shadow:
      0 10px 25px rgb(0, 0, 0, 0.1),
      0 4px 6px rgb(0, 0, 0, 0.05);
  }
`

const StyledBookmarkButton = styled(BookmarkButton)`
  position: absolute;
  top: ${({ theme }) => theme.spacing[3]};
  right: ${({ theme }) => theme.spacing[12]};
  z-index: 2;
`

const StyledMoreActions = styled(MoreActions)`
  position: absolute;
  top: ${({ theme }) => theme.spacing[3]};
  right: ${({ theme }) => theme.spacing[3]};
  z-index: 2;
`
