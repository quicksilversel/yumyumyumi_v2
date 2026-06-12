import { useMemo } from 'react'

import styled from '@emotion/styled'
import { X as CloseIcon } from 'lucide-react'
import Image from 'next/image'

import type { Recipe } from '@/types/recipe'

import { DeleteRecipeModal } from '@/components/features/Modals/DeleteRecipeModal'
import { Flex } from '@/components/ui'
import { BookmarkButton } from '@/components/ui/BookmarkButton'
import { IconButton } from '@/components/ui/Button'
import { MoreActions } from '@/components/ui/MoreActions'
import { useAuth } from '@/contexts/AuthContext'
import { useRecipeContext } from '@/contexts/RecipeContext'
import { useRecipeActions } from '@/hooks/useRecipeActions'
import { pickRecipeIcon } from '@/lib/recipeIcons'

type RecipeCardProps = {
  recipe: Recipe
  isInIngredientView: boolean
}

export const RecipeCardMenu = ({
  recipe,
  isInIngredientView,
}: RecipeCardProps) => {
  const { user } = useAuth()
  const { handleEditRecipe, handleDeleteRecipe, handleToggleIngredients } =
    useRecipeContext()

  const {
    isDeleting,
    handleEdit,
    handleDelete,
    deleteDialogOpen,
    setDeleteDialogOpen,
    confirmDelete,
    deleteError,
  } = useRecipeActions(recipe, {
    onEditOpen: handleEditRecipe,
    onDeleteSuccess: handleDeleteRecipe,
  })

  const iconImage = useMemo(() => pickRecipeIcon(recipe.id), [recipe.id])

  if (!recipe.title?.length) return null

  const isOwner = user && recipe.userId === user.id

  const handleToggleIngredientsClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    handleToggleIngredients(recipe.id)
  }

  return (
    <CardOverlay>
      <StyledIconButton
        onClick={handleToggleIngredientsClick}
        size="sm"
        title="材料を見る"
        type="button"
      >
        {isInIngredientView ? (
          <CloseIcon size="1em" />
        ) : (
          <Image width={20} height={20} src={iconImage} alt="" />
        )}
      </StyledIconButton>
      <Flex gap={0}>
        <BookmarkButton recipeId={recipe.id} size="sm" />
        {isOwner && (
          <MoreActions
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={isDeleting}
          />
        )}
      </Flex>
      {isOwner && (
        <DeleteRecipeModal
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={confirmDelete}
          isDeleting={isDeleting}
          recipeTitle={recipe.title}
          error={deleteError}
        />
      )}
    </CardOverlay>
  )
}

const CardOverlay = styled.div`
  z-index: 10;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: ${({ theme }) => theme.spacing[2]};
  background-color: ${({ theme }) => theme.colors.white};
`

const StyledIconButton = styled(IconButton)`
  backdrop-filter: blur(10px);

  &:hover {
    background-color: rgb(255, 255, 255, 95%);
  }
`
