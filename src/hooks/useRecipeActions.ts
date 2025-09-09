import { useState } from 'react'

import { useRouter } from 'next/navigation'

import type { Recipe } from '@/types/recipe'

import { deleteRecipe } from '@/lib/supabase/tables/recipe/deleteRecipe'

interface UseRecipeActionsOptions {
  onEditOpen?: (recipe: Recipe) => void
  onDeleteSuccess?: () => void
  redirectOnDelete?: boolean
}

export const useRecipeActions = (
  recipe: Recipe,
  options: UseRecipeActionsOptions = {},
) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const router = useRouter()

  const handleEdit = () => {
    if (options.onEditOpen) {
      options.onEditOpen(recipe)
    } else {
      setEditDialogOpen(true)
    }
  }

  const handleDelete = async () => {
    if (window.confirm(`${recipe.title}」を削除しますか？`)) {
      setIsDeleting(true)
      const success = await deleteRecipe(recipe.id)
      if (success) {
        if (options.onDeleteSuccess) {
          options.onDeleteSuccess()
        } else if (options.redirectOnDelete) {
          router.push('/')
        } else {
          window.location.reload()
        }
      } else {
        alert('Failed to delete recipe')
      }
      setIsDeleting(false)
    }
  }

  return {
    isDeleting,
    editDialogOpen,
    setEditDialogOpen,
    handleEdit,
    handleDelete,
  }
}
