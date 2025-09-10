import { useState } from 'react'

import styled from '@emotion/styled'
import Image from 'next/image'

import type { Recipe } from '@/types/recipe'

import { DeleteRecipeModal } from '@/components/pages/Modals/DeleteRecipeModal'
import { EditRecipeDialog } from '@/components/pages/Modals/EditRecipeDialog'
import { BookmarkButton } from '@/components/ui/BookmarkButton'
import { MoreActions } from '@/components/ui/MoreActions'
import { useAuth } from '@/contexts/AuthContext'
import { useRecipeActions } from '@/hooks/useRecipeActions'

export const Hero = ({ recipe }: { recipe: Recipe }) => {
  const { user } = useAuth()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [currentRecipe, setCurrentRecipe] = useState(recipe)

  const {
    isDeleting,
    editDialogOpen,
    setEditDialogOpen,
    handleEdit,
    handleDelete,
  } = useRecipeActions(currentRecipe)

  const isOwner = user && currentRecipe.userId === user.id

  const handleRecipeUpdated = (updatedRecipe: Recipe) => {
    setCurrentRecipe(updatedRecipe)
    window.location.reload()
  }

  return (
    <ImageContent>
      <ImageContainer>
        <Image
          src={
            recipe.imageUrl ||
            'https://images.unsplash.com/photo-1614597330453-ecf2c06e1f55?w=800'
          }
          alt={recipe.title}
          fill
          objectFit="cover"
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
        recipe={currentRecipe}
      />
    </ImageContent>
  )
}

const ImageContent = styled.div`
  @media (max-width: 768px) {
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
