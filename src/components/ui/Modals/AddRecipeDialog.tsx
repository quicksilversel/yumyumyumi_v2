'use client'

import { useState } from 'react'

import styled from '@emotion/styled'

import type { Recipe, Ingredient, Direction } from '@/types'

import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Stack, Divider } from '@/components/ui/Layout'
import { useAuth } from '@/contexts/AuthContext'
import { uploadImage, validateImage } from '@/lib/supabase/storage'
import { createRecipe } from '@/lib/supabase/supabaseRecipeService'
import { colors, spacing } from '@/styles/designTokens'
import { RecipeCategory } from '@/types'

import {
  BasicInfoFields,
  TimeAndServingsFields,
  AdditionalFields,
  IngredientsForm,
  DirectionsForm,
  TagsForm,
  ImageUploadForm,
} from '../Forms'

const ErrorMessage = styled.div`
  padding: ${spacing[3]} ${spacing[4]};
  background-color: ${colors.error};
  color: ${colors.white};
  border-radius: 8px;
  margin-bottom: ${spacing[4]};
`

const DialogActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${spacing[3]};
  margin-top: ${spacing[6]};
`

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
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  // Basic info
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [category, setCategory] = useState<string>(RecipeCategory.MAIN_COURSE)
  const [source, setSource] = useState('')

  // Time and servings
  const [prepTime, setPrepTime] = useState(15)
  const [cookTime, setCookTime] = useState(30)
  const [servings, setServings] = useState(4)

  // Content
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', amount: '', unit: '', isSpice: false },
  ])
  const [directions, setDirections] = useState<Direction[]>([
    { title: '', description: '' },
  ])
  const [tags, setTags] = useState<string[]>([])

  // Additional
  const [tips, setTips] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [imageUrl, setImageUrl] = useState('')

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validationError = validateImage(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setImageFile(file)
    setError('')

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview('')
    setImageUrl('')
  }

  const handleSubmit = async () => {
    if (!user) {
      setError('You must be logged in to create a recipe')
      return
    }

    if (
      !title ||
      !summary ||
      ingredients.length === 0 ||
      directions.length === 0
    ) {
      setError('Please fill in all required fields')
      return
    }

    // Validate ingredients
    const validIngredients = ingredients.filter((ing) => ing.name && ing.amount)
    if (validIngredients.length === 0) {
      setError('Please add at least one ingredient with name and amount')
      return
    }

    // Validate directions
    const validDirections = directions.filter((dir) => dir.description)
    if (validDirections.length === 0) {
      setError('Please add at least one direction with description')
      return
    }

    setLoading(true)
    setError('')

    try {
      let finalImageUrl = imageUrl

      // Upload image if selected
      if (imageFile) {
        setUploadingImage(true)
        // Use a temporary ID for new recipes
        const tempRecipeId = `temp-${Date.now()}`
        const result = await uploadImage(imageFile, user.id, tempRecipeId)

        if (result.error) {
          setError(`Failed to upload image: ${result.error}`)
          setUploadingImage(false)
          setLoading(false)
          return
        }

        if (result.url) {
          finalImageUrl = result.url
        }
        setUploadingImage(false)
      }

      // Create recipe object
      const newRecipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'> = {
        title,
        summary,
        ingredients: validIngredients,
        directions: validDirections,
        tags: tags.length > 0 ? tags : undefined,
        tips: tips || undefined,
        prepTime,
        cookTime,
        totalTime: prepTime + cookTime,
        servings,
        category: category as any,
        imageUrl: finalImageUrl,
        source: source || undefined,
        isPublic,
        user_id: user.id,
      }

      const createdRecipe = await createRecipe(newRecipe)

      if (createdRecipe) {
        onRecipeAdded?.(createdRecipe)
        handleClose()
      } else {
        setError('Failed to create recipe. Please try again.')
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error creating recipe:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
      setUploadingImage(false)
    }
  }

  const handleClose = () => {
    // Reset form
    setTitle('')
    setSummary('')
    setCategory(RecipeCategory.MAIN_COURSE)
    setPrepTime(15)
    setCookTime(30)
    setServings(4)
    setIngredients([{ name: '', amount: '', unit: '', isSpice: false }])
    setDirections([{ title: '', description: '' }])
    setTags([])
    setTips('')
    setImageUrl('')
    setSource('')
    setIsPublic(true)
    setImageFile(null)
    setImagePreview('')
    setError('')
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
      <Stack gap={6}>
        {error && <ErrorMessage>{error}</ErrorMessage>}

        {/* Basic Information */}
        <Stack gap={4}>
          <BasicInfoFields
            title={title}
            setTitle={setTitle}
            summary={summary}
            setSummary={setSummary}
            category={category}
            setCategory={setCategory}
            source={source}
            setSource={setSource}
          />

          <TimeAndServingsFields
            prepTime={prepTime}
            setPrepTime={setPrepTime}
            cookTime={cookTime}
            setCookTime={setCookTime}
            servings={servings}
            setServings={setServings}
          />
        </Stack>

        <Divider />

        {/* Image Upload */}
        <ImageUploadForm
          imageFile={imageFile}
          imagePreview={imagePreview}
          imageUrl={imageUrl}
          onImageSelect={handleImageSelect}
          onImageRemove={handleRemoveImage}
          onUrlChange={setImageUrl}
          uploading={uploadingImage}
        />

        <Divider />

        {/* Ingredients */}
        <IngredientsForm ingredients={ingredients} onChange={setIngredients} />

        <Divider />

        {/* Directions */}
        <DirectionsForm directions={directions} onChange={setDirections} />

        <Divider />

        {/* Tags */}
        <TagsForm tags={tags} onChange={setTags} />

        <Divider />

        {/* Additional Fields */}
        <AdditionalFields
          tips={tips}
          setTips={setTips}
          isPublic={isPublic}
          setIsPublic={setIsPublic}
        />
      </Stack>
    </Dialog>
  )
}
