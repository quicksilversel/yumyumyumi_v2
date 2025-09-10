import { useMemo } from 'react'

import styled from '@emotion/styled'
import CloseIcon from '@mui/icons-material/Close'
import Image from 'next/image'

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

  const randomIconImage = useMemo(() => {
    const IMAGE_OPTIONS = [
      '/star-icon.png',
      '/flower-icon.png',
      '/heart-icon.png',
    ]
    let hash = 0
    for (let i = 0; i < recipe.id.length; i++) {
      hash = ((hash << 5) - hash + recipe.id.charCodeAt(i)) & 0xffffffff
    }
    return IMAGE_OPTIONS[Math.abs(hash) % 3]
  }, [recipe.id])

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
          <CloseIcon fontSize="inherit" />
        ) : (
          <Image width={20} height={20} src={randomIconImage} alt="" />
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
