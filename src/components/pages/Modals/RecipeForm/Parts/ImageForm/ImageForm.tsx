'use client'

import { useRef, useState } from 'react'

import styled from '@emotion/styled'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import ImageIcon from '@mui/icons-material/Image'
import Image from 'next/image'
import { useFormContext, Controller } from 'react-hook-form'

import type { RecipeForm } from '@/types'

import { Button, IconButton } from '@/components/ui/Button'
import { Stack, Flex } from '@/components/ui/Layout'
import { Caption, H6 } from '@/components/ui/Typography'
import { validateImage, deleteImage } from '@/lib/supabase/storage'
import { colors, spacing, borderRadius } from '@/styles/designTokens'

type Props = {
  onImageChange?: (file: File | null, preview: string) => void
  uploading?: boolean
}

export function handleImageSelect(file: File | null): {
  isValid: boolean
  error?: string
  preview?: string
} {
  if (!file) {
    return { isValid: false, error: 'No file selected' }
  }

  const validationError = validateImage(file)
  if (validationError) {
    return { isValid: false, error: validationError }
  }

  // Create preview
  const reader = new FileReader()
  let preview = ''
  reader.onloadend = () => {
    preview = reader.result as string
  }
  reader.readAsDataURL(file)

  return { isValid: true, preview }
}

export async function handleImageRemove(imageUrl?: string): Promise<void> {
  // If there's an existing image URL and it's from Supabase, delete it
  if (imageUrl && imageUrl.includes('supabase')) {
    try {
      await deleteImage(imageUrl)
    } catch (err) {
      // Error deleting image - continue
      window.alert('Error deleting image')
    }
  }
}

export function ImageForm({ onImageChange, uploading = false }: Props) {
  const { control, watch, setValue } = useFormContext<RecipeForm>()
  const imageUrl = watch('imageUrl')
  const [imagePreview, setImagePreview] = useState<string>('')
  const [error, setError] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const validationError = validateImage(file)
    if (validationError) {
      setError(validationError)
      return
    }

    setError('')

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      const preview = reader.result as string
      setImagePreview(preview)
      onImageChange?.(file, preview)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = async () => {
    await handleImageRemove(imageUrl)
    setImagePreview('')
    setValue('imageUrl', '')
    onImageChange?.(null, '')
  }

  return (
    <Stack gap={3}>
      <H6>Recipe Image</H6>

      <Controller
        name="imageUrl"
        control={control}
        render={({ field }) => (
          <ImageContainer>
            <ImagePreview>
              {imagePreview || field.value ? (
                <>
                  <Image
                    src={imagePreview || field.value || ''}
                    alt="Recipe"
                    fill
                  />
                  <DeleteButton size="sm" onClick={handleRemoveImage}>
                    <DeleteIcon />
                  </DeleteButton>
                </>
              ) : (
                <PlaceholderContent>
                  <ImageIcon />
                  <Caption>No image uploaded</Caption>
                </PlaceholderContent>
              )}
            </ImagePreview>
          </ImageContainer>
        )}
      />

      <Flex justify="center" gap={2}>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleUploadClick}
          disabled={uploading}
        >
          <CloudUploadIcon />
          {uploading ? 'Uploading...' : 'Upload Image'}
        </Button>
      </Flex>

      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
      />

      {error && (
        <Caption style={{ color: colors.error, textAlign: 'center' }}>
          {error}
        </Caption>
      )}

      <Caption style={{ textAlign: 'center' }}>
        Max file size: 2MB. Supported formats: JPG, PNG, WebP
      </Caption>
    </Stack>
  )
}

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 300px;
`

const ImagePreview = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  border-radius: ${borderRadius.lg};
  background-color: ${colors.gray[100]};
  overflow: hidden;
  aspect-ratio: 16/9;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const PlaceholderContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${colors.gray[500]};
  text-align: center;

  svg {
    margin-right: ${spacing[2]};
    margin-bottom: ${spacing[2]};
    font-size: 48px;
  }
`

const DeleteButton = styled(IconButton)`
  position: absolute;
  top: ${spacing[2]};
  right: ${spacing[2]};
  background-color: rgb(255, 255, 255, 90%);

  &:hover {
    background-color: rgb(255, 255, 255, 100%);
  }
`

const HiddenInput = styled.input`
  display: none;
`
