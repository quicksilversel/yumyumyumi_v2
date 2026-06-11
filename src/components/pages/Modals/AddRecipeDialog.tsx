'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, FormProvider } from 'react-hook-form'

import type { Recipe, RecipeFormInput } from '@/types/recipe'

import { Button, Dialog } from '@/components/ui'
import { useAuth } from '@/contexts/AuthContext'
import { createRecipe } from '@/lib/db/queries/recipe'
import { uploadImage } from '@/lib/db/storage'
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
      servings: 2,
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
      setError('root', { message: 'ログインが必要です' })
      return
    }

    setLoading(true)

    try {
      let finalImageUrl = data.imageUrl || ''

      if (imageFile) {
        setUploadingImage(true)

        const result = await uploadImage(imageFile, user.id, 'temp')

        if (result.error) {
          setError('root', {
            message: `画像のアップロードに失敗しました: ${result.error}`,
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
          message: 'レシピの作成に失敗しました。もう一度お試しください。',
        })
      }
    } catch (err) {
      setError('root', {
        message: '予期しないエラーが発生しました。もう一度お試しください。',
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
      title="新規作成"
      actions={
        <>
          <Button
            variant="ghost"
            onClick={handleClose}
            size="sm"
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
            {loading ? '作成中...' : 'レシピを作成する'}
          </Button>
        </>
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
