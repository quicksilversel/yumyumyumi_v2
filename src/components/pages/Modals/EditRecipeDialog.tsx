'use client'

import { useState, useEffect } from 'react'

import styled from '@emotion/styled'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'

import type { Recipe, RecipeForm } from '@/types/recipe'

import { Button, Dialog } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { uploadImage, deleteImage } from '@/lib/supabase/storage'
import { updateRecipe } from '@/lib/supabase/tables/recipe/updateRecipe'
import { recipeFormSchema } from '@/types/recipe'

import { RecipeForm as RecipeFormComponent } from './RecipeForm/RecipeForm'

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
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const methods = useForm<RecipeForm>({
    mode: 'onChange',
    resolver: zodResolver(recipeFormSchema),
    defaultValues: recipe,
  })

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = methods

  useEffect(() => {
    reset(recipe)
  }, [recipe, reset])

  const handleImageChange = (file: File | null, preview: string) => {
    setImageFile(file)
    if (preview) {
      methods.setValue('imageUrl', preview)
    }
  }

  const onSubmit: SubmitHandler<RecipeForm> = async (data: RecipeForm) => {
    if (!user) {
      setError('root', {
        message: 'You must be logged in to update a recipe',
      })
      return
    }

    if (!recipe.id) {
      setError('root', { message: 'Recipe ID is missing' })
      return
    }

    setLoading(true)

    try {
      let finalImageUrl = data.imageUrl || ''

      if (imageFile) {
        setUploadingImage(true)

        if (recipe.imageUrl && recipe.imageUrl.includes('supabase')) {
          try {
            await deleteImage(recipe.imageUrl)
          } catch (err) {
            window.alert('Error Deleting old image')
          }
        }

        const result = await uploadImage(imageFile, user.id, recipe.id)

        if (result.error) {
          setError('root', {
            message: `Failed to upload image: ${result.error}`,
          })
          setUploadingImage(false)
          setLoading(false)
          return
        }

        if (result.url) {
          finalImageUrl = result.url
        }
        setUploadingImage(false)
      }

      const updates = {
        ...data,
        imageUrl: finalImageUrl,
        updatedAt: new Date().toISOString(),
      }

      const updatedRecipe = await updateRecipe(recipe.id, updates)

      if (updatedRecipe) {
        onRecipeUpdated?.(updatedRecipe)
        handleClose()
      } else {
        setError('root', {
          message: 'Failed to update recipe. Please try again.',
        })
      }
    } catch (err) {
      setError('root', {
        message: 'An unexpected error occurred. Please try again.',
      })
    } finally {
      setLoading(false)
      setUploadingImage(false)
    }
  }

  const handleClose = () => {
    setImageFile(null)
    onClose()
  }

  const formErrors = errors.root
    ? [errors.root.message || 'An error occurred']
    : []

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      title="Edit Recipe"
      actions={
        <DialogActions>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit(onSubmit)}
            disabled={loading || uploadingImage}
          >
            {loading ? 'Updating...' : 'Update Recipe'}
          </Button>
        </DialogActions>
      }
    >
      <FormProvider {...methods}>
        <RecipeFormComponent
          errors={formErrors}
          handleImageChange={handleImageChange}
          uploadingImage={uploadingImage}
        />
      </FormProvider>
    </Dialog>
  )
}

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[6]};
`
