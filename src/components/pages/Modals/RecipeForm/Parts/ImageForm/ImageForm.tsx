import { useRef, useState } from 'react'

import styled from '@emotion/styled'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import ImageIcon from '@mui/icons-material/Image'
import Image from 'next/image'
import { useFormContext, Controller } from 'react-hook-form'

import type { RecipeForm } from '@/types/recipe'

import { IconButton, ErrorText, H2 } from '@/components/ui'
import { validateImage, deleteImage } from '@/lib/supabase/storage'

type Props = {
  onImageChange?: (file: File | null, preview: string) => void
  uploading?: boolean
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

  const hasImage = imagePreview || imageUrl

  return (
    <Section>
      <H2>サムネイル</H2>
      <Controller
        name="imageUrl"
        control={control}
        render={({ field }) => (
          <ImageContainer
            role="img"
            aria-labelledby="image-heading"
            aria-describedby="image-help"
          >
            <ImagePreview hasImage={!!hasImage}>
              {hasImage ? (
                <>
                  <RecipeImage
                    src={imagePreview || field.value || ''}
                    alt="レシピ画像のプレビュー"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                  <ImageActions>
                    <ActionButton
                      size="sm"
                      variant="primary"
                      onClick={handleUploadClick}
                      disabled={uploading}
                      type="button"
                      aria-label="画像を変更"
                    >
                      <EditIcon fontSize="inherit" />
                    </ActionButton>
                    <ActionButton
                      size="sm"
                      variant="primary"
                      onClick={handleRemoveImage}
                      type="button"
                      aria-label="画像を削除"
                    >
                      <DeleteIcon fontSize="inherit" />
                    </ActionButton>
                  </ImageActions>
                </>
              ) : (
                <UploadPrompt
                  onClick={handleUploadClick}
                  type="button"
                  disabled={uploading}
                  aria-describedby="image-help"
                >
                  <ImageIcon fontSize="large" />
                  <UploadText>画像をアップロード</UploadText>
                  <UploadHint>クリックして画像を選択</UploadHint>
                </UploadPrompt>
              )}
            </ImagePreview>
          </ImageContainer>
        )}
      />
      <HiddenFileInput
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        aria-label="画像ファイルを選択"
      />
      {error && (
        <ErrorText role="alert" aria-live="polite">
          {error}
        </ErrorText>
      )}
      <HelpText id="image-help">
        最大ファイルサイズ: 2MB
        <br />
        サポートされているフォーマット: JPG, PNG, WebP
      </HelpText>
    </Section>
  )
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[3]};
  width: 100%;
`

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 450px;
`

const ImagePreview = styled.div<{ hasImage: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 16/9;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border: 2px dashed
    ${({ theme, hasImage }) =>
      hasImage ? 'transparent' : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: border-color 0.2s ease;

  &:hover {
    border-color: ${({ theme, hasImage }) =>
      hasImage ? 'transparent' : theme.colors.gray[400]};
  }
`

const RecipeImage = styled(Image)`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`

const ImageActions = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing[2]};
  right: ${({ theme }) => theme.spacing[2]};
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
  transition: opacity 0.2s ease;
`

const ActionButton = styled(IconButton)`
  color: ${({ theme }) => theme.colors.gray[700]};
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadow.sm};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }
`

const UploadPrompt = styled.button`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: ${({ theme }) => theme.colors.gray[500]};
  cursor: pointer;
  background: none;
  border: none;
  transition: color 0.2s ease;

  &:hover:not(:disabled) {
    color: ${({ theme }) => theme.colors.gray[600]};
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`

const UploadText = styled.span`
  margin-top: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`

const UploadHint = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.gray[400]};
`

const HiddenFileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  white-space: nowrap;
  border: 0;
  clip-path: inset(0 0 100% 100%);
`

const HelpText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.gray[600]};
`
