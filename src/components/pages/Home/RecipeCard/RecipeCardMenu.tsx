import styled from '@emotion/styled'
import CloseIcon from '@mui/icons-material/Close'
import MenuBookIcon from '@mui/icons-material/MenuBook'

import type { Recipe } from '@/types/recipe'

import { Flex } from '@/components/ui'
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

export const RecipeCardMenu = ({
  recipe,
  isInIngredientView,
}: RecipeCardProps) => {
  const { user } = useAuth()
  const { handleEditRecipe, handleDeleteRecipe, handleToggleIngredients } =
    useRecipeContext()

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
        {isInIngredientView ? (
          <CloseIcon fontSize="inherit" />
        ) : (
          <MenuBookIcon fontSize="inherit" />
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
    </CardOverlay>
  )
}

const CardOverlay = styled.div`
  padding: ${({ theme }) => theme.spacing[2]};
  width: 100%;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.white};
`

const StyledIconButton = styled(IconButton)`
  backdrop-filter: blur(10px);

  &:hover {
    background-color: rgb(255, 255, 255, 95%);
  }
`
