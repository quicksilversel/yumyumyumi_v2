const API_ENDPOINT = '/api/upload-image'

/**
 * Deletes an uploaded image from Vercel Blob. The actual deletion runs
 * server-side (the Blob token is server-only), so this calls the API route.
 */
export async function deleteImage(imageUrl: string): Promise<boolean> {
  try {
    if (!imageUrl) return true

    const response = await fetch(API_ENDPOINT, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: imageUrl }),
    })

    return response.ok
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error deleting image:', error)
    return false
  }
}
