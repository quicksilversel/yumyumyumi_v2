import { useRef, useState } from 'react'

import styled from '@emotion/styled'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ImageIcon from '@mui/icons-material/Image'
import Image from 'next/image'
import { useFormContext, Controller } from 'react-hook-form'

import type { RecipeForm } from '@/types/recipe'

import { IconButton, Stack, Caption, ErrorText } from '@/components/ui'
import { validateImage, deleteImage } from '@/lib/supabase/storage'

type Props = {
  onImageChange?: (file: File | null, preview: string) => void
  uploading?: boolean
}

function handleImageSelect(file: File | null): {
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

  const reader = new FileReader()
  let preview = ''
  reader.onloadend = () => {
    preview = reader.result as string
  }
  reader.readAsDataURL(file)

  return { isValid: true, preview }
}

async function handleImageRemove(imageUrl?: string): Promise<void> {
  if (imageUrl && imageUrl.includes('supabase')) {
    try {
      await deleteImage(imageUrl)
    } catch (err) {
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
    <Stack gap={1}>
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
                    objectFit="cover"
                  />
                </>
              ) : (
                <PlaceholderContent onClick={handleUploadClick} type="button">
                  <ImageIcon />
                  <Caption>画像をアップロード</Caption>
                </PlaceholderContent>
              )}
            </ImagePreview>
            {(imagePreview || field.value) && (
              <ButtonContainer>
                <IconButton
                  size="sm"
                  variant="primary"
                  onClick={handleUploadClick}
                  disabled={uploading}
                  type="button"
                >
                  <EditIcon fontSize="inherit" />
                </IconButton>
                <IconButton
                  size="sm"
                  variant="primary"
                  onClick={handleRemoveImage}
                  type="button"
                >
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              </ButtonContainer>
            )}
          </ImageContainer>
        )}
      />
      <HiddenInput
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
      />
      {error && <ErrorText>{error}</ErrorText>}
      <Caption>
        最大ファイルサイズ: 2MB。
        <br />
        サポートされているフォーマット: JPG, PNG, WebP
      </Caption>
    </Stack>
  )
}

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 450px;
`

const ButtonContainer = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing[1]};
  right: ${({ theme }) => theme.spacing[1]};
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
`

const ImagePreview = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`

const PlaceholderContent = styled.button`
  display: flex;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: ${({ theme }) => theme.colors.gray[500]};
  text-align: center;
`

const HiddenInput = styled.input`
  display: none;
`
