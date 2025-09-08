'use client'

import { useState } from 'react'

import styled from '@emotion/styled'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'

import type { Recipe, RecipeFormInput } from '@/types/recipe'

import { Button, Dialog } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { uploadImage } from '@/lib/supabase/storage'
import { createRecipe } from '@/lib/supabase/tables/recipe/createRecipe'
import { recipeFormSchema } from '@/types/recipe'

import { RecipeForm as RecipeFormComponent } from './RecipeForm/RecipeForm'

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
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)

  const methods = useForm<RecipeFormInput>({
    mode: 'onChange',
    resolver: zodResolver(recipeFormSchema),
    defaultValues: {
      title: '',
      summary: '',
      ingredients: [],
      directions: [],
      cookTime: 30,
      servings: 4,
      tags: [],
      tips: '',
      source: '',
      imageUrl: '',
      isPublic: true,
    },
  })

  const {
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = methods

  const handleImageChange = (file: File | null, preview: string) => {
    setImageFile(file)
    if (preview) {
      methods.setValue('imageUrl', preview)
    }
  }

  const onSubmit = async (data: RecipeFormInput) => {
    if (!user) {
      setError('root', { message: 'You must be logged in to create a recipe' })
      return
    }

    setLoading(true)

    try {
      let finalImageUrl = data.imageUrl || ''

      if (imageFile) {
        setUploadingImage(true)
        const tempRecipeId = `temp-${Date.now()}`
        const result = await uploadImage(imageFile, user.id, tempRecipeId)

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

      const recipeData = {
        ...data,
        createdAt: new Date().toISOString(),
        userId: user.id,
        imageUrl: finalImageUrl,
      }

      const newRecipe = await createRecipe(recipeData)

      if (newRecipe) {
        onRecipeAdded?.(newRecipe)
        handleClose()
      } else {
        setError('root', {
          message: 'Failed to create recipe. Please try again.',
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
    reset()
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
      title="Add New Recipe"
      actions={
        <DialogActions>
          <Button
            variant="ghost"
            onClick={handleClose}
            size="sm"
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
            {loading ? 'Creating...' : 'Create Recipe'}
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
