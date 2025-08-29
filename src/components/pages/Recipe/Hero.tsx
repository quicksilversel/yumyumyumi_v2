import { useState } from 'react'

import styled from '@emotion/styled'
import Image from 'next/image'

import type { Recipe } from '@/types'

import { BookmarkButton } from '@/components/ui/BookmarkButton'
import { DeleteRecipeModal } from '@/components/ui/Modals/DeleteRecipeModal'
import { EditRecipeDialog } from '@/components/ui/Modals/EditRecipeDialog'
import { MoreActions } from '@/components/ui/MoreActions'
import { useAuth } from '@/contexts/AuthContext'
import { useRecipeActions } from '@/hooks/useRecipeActions'

export const Hero = ({ recipe }: { recipe: Recipe }) => {
  const { user } = useAuth()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [currentRecipe, setCurrentRecipe] = useState(recipe)
  
  const { isDeleting, editDialogOpen, setEditDialogOpen, handleEdit, handleDelete } = 
    useRecipeActions(currentRecipe)

  const isOwner = user && currentRecipe.user_id === user.id

  const handleRecipeUpdated = (updatedRecipe: Recipe) => {
    setCurrentRecipe(updatedRecipe)
    window.location.reload()
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
          <StyledBookmarkButton recipeId={currentRecipe.id} size="sm" />
        )}
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
    </>
  )
}

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
`

const StyledBookmarkButton = styled(BookmarkButton)`
  position: absolute;
  top: 12px;
  right: 50px;
`

const StyledMoreActions = styled(MoreActions)`
  position: absolute;
  top: 12px;
  right: 12px;
`
