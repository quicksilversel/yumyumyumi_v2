import { compressImage } from '@/lib/imageCompression/compressImage'

import { validateImage } from './validateImage'

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const API_ENDPOINT = '/api/upload-image'

type ImageUploadResult = {
  url: string
  error?: string
}

async function uploadToSupabaseStorage(
  file: Blob,
  userId: string,
  recipeId: string,
): Promise<Response> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('userId', userId)
  formData.append('recipeId', recipeId)

  return fetch(API_ENDPOINT, {
    method: 'POST',
    body: formData,
  })
}

export async function uploadImage(
  file: File,
  userId: string,
  recipeId: string,
): Promise<ImageUploadResult> {
  try {
    const validationError = validateImage(file)
    if (validationError) {
      return { url: '', error: validationError }
    }

    const compressedImage = await compressImage(file)

    if (compressedImage.size > MAX_FILE_SIZE) {
      return { url: '', error: 'Unable to compress image below 2MB' }
    }

    const response = await uploadToSupabaseStorage(
      compressedImage,
      userId,
      recipeId,
    )
    const result = await response.json()

    if (!response.ok) {
      return { url: '', error: result.error || 'Upload failed' }
    }

    return { url: result.url }
  } catch (error) {
    return {
      url: '',
      error: error instanceof Error ? error.message : 'Failed to process image',
    }
  }
}
