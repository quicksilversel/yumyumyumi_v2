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
        message: 'ログインが必要です',
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
          message:
            'ご迷惑をお掛けし申し訳ありません。\n時間をおいて再度お試しください。',
        })
      }
    } catch (err) {
      setError('root', {
        message:
          'ご迷惑をお掛けし申し訳ありません。\n時間をおいて再度お試しください。',
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
      title="レシピを編集"
      actions={
        <DialogActions>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            disabled={loading}
          >
            キャンセル
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmit(onSubmit)}
            disabled={loading || uploadingImage}
          >
            {loading ? '更新中...' : '更新する'}
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
