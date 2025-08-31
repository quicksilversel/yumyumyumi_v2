'use client'

import { useState } from 'react'

import styled from '@emotion/styled'

import type { Recipe } from '@/types'

import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { useAuth } from '@/contexts/AuthContext'
import { NewRecipeProvider, useNewRecipe } from '@/contexts/RecipeFormContext'
import {
  validateRecipeForm,
  prepareRecipeData,
  getInitialRecipeState,
} from '@/lib/functions'
import { uploadImage } from '@/lib/supabase/storage'
import { createRecipe } from '@/lib/supabase/supabaseRecipeService'
import { spacing } from '@/styles/designTokens'

import { RecipeForm } from './RecipeForm'

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing[3]};
  margin-top: ${spacing[6]};
`

type AddRecipeDialogContentProps = {
  open: boolean
  onClose: () => void
  onRecipeAdded?: (recipe: Recipe) => void
}

function AddRecipeDialogContent({
  open,
  onClose,
  onRecipeAdded,
}: AddRecipeDialogContentProps) {
  const { user } = useAuth()
  const { recipe, setRecipe } = useNewRecipe()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleImageChange = (file: File | null) => {
    setImageFile(file)
  }

  const handleSubmit = async () => {
    if (!user) {
      setErrors(['You must be logged in to create a recipe'])
      return
    }

    // Validate recipe form
    const validation = validateRecipeForm(recipe, user.id)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setLoading(true)
    setErrors([])

    try {
      let finalImageUrl = recipe.imageUrl || ''

      // Upload image if selected
      if (imageFile) {
        setUploadingImage(true)
        // Use a temporary ID for new recipes
        const tempRecipeId = `temp-${Date.now()}`
        const result = await uploadImage(imageFile, user.id, tempRecipeId)

        if (result.error) {
          setErrors([`Failed to upload image: ${result.error}`])
          setUploadingImage(false)
          setLoading(false)
          return
        }

        if (result.url) {
          finalImageUrl = result.url
        }
        setUploadingImage(false)
      }

      const recipeData = prepareRecipeData(
        recipe,
        validation.validatedData!,
        finalImageUrl,
        user.id,
      )

      const newRecipe = await createRecipe(recipeData as Recipe)

      if (newRecipe) {
        onRecipeAdded?.(newRecipe)
        handleClose()
      } else {
        setErrors(['Failed to create recipe. Please try again.'])
      }
    } catch (err) {
      setErrors(['An unexpected error occurred. Please try again.'])
    } finally {
      setLoading(false)
      setUploadingImage(false)
    }
  }

  const handleClose = () => {
    setErrors([])
    setImageFile(null)
    // Reset the form
    setRecipe(getInitialRecipeState())
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      title={'Add New Recipe'}
      actions={
        <DialogActions>
          <Button variant="ghost" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading || uploadingImage}
          >
            {loading ? 'Creating...' : 'Create Recipe'}
          </Button>
        </DialogActions>
      }
    >
      <RecipeForm
        mode="new"
        errors={errors}
        handleImageChange={handleImageChange}
        uploadingImage={uploadingImage}
      />
    </Dialog>
  )
}

type AddRecipeDialogProps = {
  open: boolean
  onClose: () => void
  onRecipeAdded?: (recipe: Recipe) => void
}

export function AddRecipeDialog({
  open,
  onClose,
  onRecipeAdded,
}: AddRecipeDialogProps) {
  return (
    <NewRecipeProvider>
      <AddRecipeDialogContent
        open={open}
        onClose={onClose}
        onRecipeAdded={onRecipeAdded}
      />
    </NewRecipeProvider>
  )
}
