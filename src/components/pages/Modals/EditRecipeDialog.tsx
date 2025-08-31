'use client'

import { useState } from 'react'

import styled from '@emotion/styled'

import type { Recipe } from '@/types'

import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { useAuth } from '@/contexts/AuthContext'
import { EditRecipeProvider, useEditRecipe } from '@/contexts/RecipeFormContext'
import { validateRecipeForm, prepareRecipeData } from '@/lib/functions'
import { uploadImage, deleteImage } from '@/lib/supabase/storage'
import { updateRecipe } from '@/lib/supabase/supabaseRecipeService'
import { spacing } from '@/styles/designTokens'

import { RecipeForm } from './RecipeForm'

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing[3]};
  margin-top: ${spacing[6]};
`

type EditRecipeDialogContentProps = {
  open: boolean
  onClose: () => void
  onRecipeUpdated?: (recipe: Recipe) => void
}

function EditRecipeDialogContent({
  open,
  onClose,
  onRecipeUpdated,
}: EditRecipeDialogContentProps) {
  const { user } = useAuth()
  const { recipe, setRecipe } = useEditRecipe()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleImageChange = (file: File | null) => {
    setImageFile(file)
  }

  const handleSubmit = async () => {
    if (!user) {
      setErrors(['You must be logged in to update a recipe'])
      return
    }

    const validation = validateRecipeForm(recipe, user.id)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    setLoading(true)
    setErrors([])

    try {
      if (!recipe.id) return
      let finalImageUrl = recipe.imageUrl

      if (imageFile) {
        setUploadingImage(true)

        if (recipe.imageUrl && recipe.imageUrl.includes('supabase')) {
          try {
            await deleteImage(recipe.imageUrl)
          } catch (err) {
            // Error deleting old image - continue with upload
          }
        }

        const result = await uploadImage(imageFile, user.id, recipe.id!)

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

      const updates = prepareRecipeData(
        recipe,
        validation.validatedData!,
        finalImageUrl,
      )

      const updatedRecipe = await updateRecipe(recipe.id, updates)

      if (updatedRecipe) {
        onRecipeUpdated?.(updatedRecipe)
        handleClose()
      } else {
        setErrors(['Failed to update recipe. Please try again.'])
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
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      title={'Edit Recipe'}
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
            {loading ? 'Updating...' : 'Update Recipe'}
          </Button>
        </DialogActions>
      }
    >
      <RecipeForm
        mode="edit"
        errors={errors}
        handleImageChange={handleImageChange}
        uploadingImage={uploadingImage}
      />
    </Dialog>
  )
}

type EditRecipeDialogProps = {
  open: boolean
  onClose: () => void
  recipe: Recipe
  onRecipeUpdated?: (recipe: Recipe) => void
}

export function EditRecipeDialog({
  open,
  onClose,
  recipe,
  onRecipeUpdated,
}: EditRecipeDialogProps) {
  return (
    <EditRecipeProvider initialRecipe={recipe}>
      <EditRecipeDialogContent
        open={open}
        onClose={onClose}
        onRecipeUpdated={onRecipeUpdated}
      />
    </EditRecipeProvider>
  )
}
