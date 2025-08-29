'use client'

import { useRef } from 'react'

import styled from '@emotion/styled'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import ImageIcon from '@mui/icons-material/Image'
import Image from 'next/image'

import { Button, IconButton } from '@/components/ui/Button'
import { Stack, Flex } from '@/components/ui/Layout'
import { Caption, H6 } from '@/components/ui/Typography'
import { colors, spacing, borderRadius } from '@/styles/designTokens'

type ImageUploadFormProps = {
  imageFile: File | null
  imagePreview: string
  imageUrl?: string
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onImageRemove: () => void
  onUrlChange?: (url: string) => void
  uploading?: boolean
  error?: string
}

export function ImageUploadForm({
  imageFile,
  imagePreview,
  imageUrl,
  onImageSelect,
  onImageRemove,
  onUrlChange,
  uploading = false,
  error,
}: ImageUploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Stack gap={3}>
      <H6>Recipe Image</H6>

      <ImageContainer>
        <ImagePreview>
          {imagePreview || imageUrl ? (
            <>
              <Image src={imageUrl ?? imagePreview} alt="Recipe" fill />
              <DeleteButton size="sm" onClick={onImageRemove}>
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
        onChange={onImageSelect}
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
  max-width: 400px;
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
