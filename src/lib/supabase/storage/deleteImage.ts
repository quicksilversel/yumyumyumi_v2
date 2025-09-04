import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import type { Database } from '@/types/supabase'

const STORAGE_BUCKET = 'recipe-images'

export type ImageUploadResult = {
  url: string
  error?: string
}

const extractFilePathFromUrl = (imageUrl: string): string | null => {
  if (!imageUrl || !imageUrl.includes(STORAGE_BUCKET)) return null

  const urlParts = imageUrl.split(`${STORAGE_BUCKET}/`)
  return urlParts.length === 2 ? urlParts[1] : null
}

export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    const filePath = extractFilePathFromUrl(imageUrl)

    if (!filePath) return true

    const supabase = createClientComponentClient<Database>()

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath])

    if (error) throw error

    return true
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error in deleteRecipeImage:', error)
    return false
  }
}
