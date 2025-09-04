import styled from '@emotion/styled'
import CloseIcon from '@mui/icons-material/Close'
import VisibilityIcon from '@mui/icons-material/Visibility'

import type { Recipe } from '@/types/recipe'

import { BookmarkButton } from '@/components/ui/BookmarkButton'
import { IconButton } from '@/components/ui/Button'
import { MoreActions } from '@/components/ui/MoreActions'
import { useAuth } from '@/contexts/AuthContext'
import { useRecipeContext } from '@/contexts/RecipeContext'
import { useRecipeActions } from '@/hooks/useRecipeActions'

type RecipeCardProps = {
  recipe: Recipe
  isInIngredientView: boolean
}

export const RecipeCardMoreActions = ({
  recipe,
  isInIngredientView,
}: RecipeCardProps) => {
  const { user } = useAuth()
  const {
    handleEditRecipe,
    handleDeleteRecipe,
    handleToggleIngredients,
  } = useRecipeContext()

  const { isDeleting, handleEdit, handleDelete } = useRecipeActions(recipe, {
    onEditOpen: handleEditRecipe,
    onDeleteSuccess: handleDeleteRecipe,
  })

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
        title="Show Ingredients"
      >
        {isInIngredientView ? <CloseIcon /> : <VisibilityIcon />}
      </StyledIconButton>
      <BookmarkButton
        recipeId={recipe.id}
        size="sm"
      />
      {isOwner && (
        <MoreActions
          onEdit={handleEdit}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </CardOverlay>
  )
}

const CardOverlay = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing[2]};
  right: ${({ theme }) => theme.spacing[2]};
  z-index: 10;
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
`

const StyledIconButton = styled(IconButton)`
  background-color: rgb(255, 255, 255, 90%);
  backdrop-filter: blur(10px);

  &:hover {
    background-color: rgb(255, 255, 255, 95%);
  }
`
