import { useState } from 'react'

import { useRouter } from 'next/navigation'

import type { Recipe } from '@/types/recipe'

import { deleteRecipe } from '@/lib/db/queries/recipe'

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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const router = useRouter()

  const handleEdit = () => {
    if (options.onEditOpen) {
      options.onEditOpen(recipe)
    } else {
      setEditDialogOpen(true)
    }
  }
  const handleDelete = () => {
    setDeleteError(null)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    setIsDeleting(true)
    setDeleteError(null)
    const success = await deleteRecipe(recipe.id)
    if (success) {
      setDeleteDialogOpen(false)
      if (options.onDeleteSuccess) {
        options.onDeleteSuccess()
      } else if (options.redirectOnDelete) {
        router.push('/')
      } else {
        window.location.reload()
      }
    } else {
      setDeleteError('削除に失敗しました。時間をおいて再度お試しください。')
    }
    setIsDeleting(false)
  }

  return {
    isDeleting,
    editDialogOpen,
    setEditDialogOpen,
    handleEdit,
    deleteDialogOpen,
    setDeleteDialogOpen,
    confirmDelete,
    deleteError,
    handleDelete,
  }
}
