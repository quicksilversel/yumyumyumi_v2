'use client'

import { useState, useEffect } from 'react'

import styled from '@emotion/styled'

import type { Recipe, Ingredient, Direction } from '@/types'

import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { Stack, Divider } from '@/components/ui/Layout'
import { useAuth } from '@/contexts/AuthContext'
import { deleteImage, uploadImage, validateImage } from '@/lib/supabase/storage'
import { updateRecipe } from '@/lib/supabase/supabaseRecipeService'
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
} from './forms'

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

  // Initialize form with recipe data when opened
  useEffect(() => {
    if (open && recipe) {
      setTitle(recipe.title)
      setSummary(recipe.summary)
      setCategory(recipe.category || RecipeCategory.MAIN_COURSE)
      setPrepTime(recipe.prepTime)
      setCookTime(recipe.cookTime)
      setServings(recipe.servings)
      setImageUrl(recipe.imageUrl || '')
      setSource(recipe.source || '')
      setTips(recipe.tips || '')
      setIsPublic(recipe.isPublic ?? true)

      // Handle multiple data formats
      const processedIngredients = recipe.ingredients?.map((ing: any) => {
        // If it's already an object with the correct structure
        if (typeof ing === 'object' && ing.name && !ing.name.startsWith('{')) {
          return ing
        }

        // If it's a string
        if (typeof ing === 'string') {
          // Try to parse as JSON first
          try {
            const parsed = JSON.parse(ing)
            if (parsed && typeof parsed === 'object' && parsed.name) {
              return parsed
            }
          } catch {
            // Not JSON, might be old format like "aaaa (1 tsp)"
            const match = ing.match(/^(.+?)\s*\((.+?)\s*(.+?)?\)$/)
            if (match) {
              return {
                name: match[1].trim(),
                amount: match[2].trim(),
                unit: match[3]?.trim() || '',
                isSpice: false,
              }
            }
            return { name: ing, amount: '', unit: '', isSpice: false }
          }
        }

        // If it's an object with JSON string in the name field
        if (typeof ing === 'object' && ing.name && ing.name.startsWith('{')) {
          try {
            return JSON.parse(ing.name)
          } catch {
            return { name: '', amount: '', unit: '', isSpice: false }
          }
        }

        return { name: '', amount: '', unit: '', isSpice: false }
      })

      setIngredients(
        processedIngredients?.length > 0
          ? processedIngredients
          : [{ name: '', amount: '', unit: '', isSpice: false }],
      )

      // Handle multiple data formats for directions
      const processedDirections = recipe.directions?.map((dir: any) => {
        // If it's already an object with the correct structure
        if (
          typeof dir === 'object' &&
          dir.description &&
          !dir.description.startsWith('{')
        ) {
          return dir
        }

        // If it's a string
        if (typeof dir === 'string') {
          // Try to parse as JSON first
          try {
            const parsed = JSON.parse(dir)
            if (parsed && typeof parsed === 'object' && parsed.description) {
              return parsed
            }
          } catch {
            // Not JSON, use as description
            return { title: '', description: dir }
          }
        }

        // If it's an object with JSON string in the description field
        if (
          typeof dir === 'object' &&
          dir.description &&
          dir.description.startsWith('{')
        ) {
          try {
            return JSON.parse(dir.description)
          } catch {
            return { title: '', description: '' }
          }
        }

        return { title: '', description: '' }
      })

      setDirections(
        processedDirections?.length > 0
          ? processedDirections
          : [{ title: '', description: '' }],
      )

      setTags(recipe.tags || [])
    }
  }, [open, recipe])

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

  const handleRemoveImage = async () => {
    // If there's an existing image URL and user is removing it
    if (imageUrl && imageUrl.includes('supabase')) {
      try {
        await deleteImage(imageUrl)
      } catch (err) {
        // Error deleting image - continue
      }
    }

    setImageFile(null)
    setImagePreview('')
    setImageUrl('')
  }

  const handleSubmit = async () => {
    if (!user) {
      setError('You must be logged in to update a recipe')
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

    // Validate and clean ingredients - ensure they're proper objects, not strings
    const validIngredients = ingredients
      .filter((ing) => ing.name && ing.amount)
      .map((ing) => ({
        name: String(ing.name),
        amount: String(ing.amount),
        unit: String(ing.unit || ''),
        isSpice: Boolean(ing.isSpice)
      }))
    
    if (validIngredients.length === 0) {
      setError('Please add at least one ingredient with name and amount')
      return
    }

    // Validate and clean directions - ensure they're proper objects, not strings  
    const validDirections = directions
      .filter((dir) => dir.description)
      .map((dir) => ({
        title: String(dir.title || ''),
        description: String(dir.description)
      }))
      
    if (validDirections.length === 0) {
      setError('Please add at least one direction with description')
      return
    }

    setLoading(true)
    setError('')

    try {
      let finalImageUrl = imageUrl

      // Upload new image if selected
      if (imageFile) {
        setUploadingImage(true)

        // Delete old image if it exists
        if (recipe.imageUrl && recipe.imageUrl.includes('supabase')) {
          try {
            await deleteImage(recipe.imageUrl)
          } catch (err) {
            // Error deleting old image - continue with upload
          }
        }

        const result = await uploadImage(imageFile, user.id, recipe.id)

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

      // Prepare updates object
      const updates: Partial<Recipe> = {
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
      }

      const updatedRecipe = await updateRecipe(recipe.id, updates)

      if (updatedRecipe) {
        onRecipeUpdated?.(updatedRecipe)
        handleClose()
      } else {
        setError('Failed to update recipe. Please try again.')
      }
    } catch (err) {
      // Error updating recipe
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
      setUploadingImage(false)
    }
  }

  const handleClose = () => {
    setError('')
    setImageFile(null)
    setImagePreview('')
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
