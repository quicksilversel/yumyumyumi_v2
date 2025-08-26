const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB
const MAX_UPLOAD_SIZE = MAX_FILE_SIZE * 2 // 4MB before compression

const isImageFile = (file: File): boolean => file.type.startsWith('image/')

const formatFileSize = (bytes: number): string =>
  `${(bytes / 1024 / 1024).toFixed(2)}MB`

export function validateImage(file: File | null): string | null {
  if (!file) return null

  if (!isImageFile(file)) {
    return 'Please select an image file'
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    return `Image size must be less than ${formatFileSize(MAX_UPLOAD_SIZE)}`
  }

  return null
}
