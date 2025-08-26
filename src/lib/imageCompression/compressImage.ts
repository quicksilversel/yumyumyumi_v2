import imageCompression from 'browser-image-compression'

export type ImageUploadResult = {
  url: string
  error?: string
}

type CompressionOptions = {
  maxSizeMB: number
  maxWidthOrHeight: number
  useWebWorker: boolean
  fileType: string
  quality?: number
}

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

const COMPRESSION_CONFIGS: {
  default: CompressionOptions
  aggressive: CompressionOptions
} = {
  default: {
    maxSizeMB: 2,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp',
  },
  aggressive: {
    maxSizeMB: 1.5,
    maxWidthOrHeight: 1280,
    useWebWorker: true,
    fileType: 'image/webp',
    quality: 0.8,
  },
}

export async function compressImage(file: File): Promise<Blob> {
  try {
    let compressedFile = await imageCompression(
      file,
      COMPRESSION_CONFIGS.default,
    )

    if (compressedFile.size > MAX_FILE_SIZE) {
      compressedFile = await imageCompression(
        file,
        COMPRESSION_CONFIGS.aggressive,
      )
    }

    return compressedFile
  } catch (error) {
    throw new Error('Failed to compress image')
  }
}
