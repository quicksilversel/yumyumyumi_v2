import { addBookmark } from './addBookmark'
import { removeBookmark } from './removeBookmark'
import { toggleBookmark } from './toggleBookmark'

import { isBookmarked } from '../isBookmarked'

jest.mock('./addBookmark')
jest.mock('./removeBookmark')
jest.mock('../isBookmarked')

describe('toggleBookmark', () => {
  const mockRecipeId = 'recipe123'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should remove bookmark when recipe is already bookmarked', async () => {
    ;(isBookmarked as jest.Mock).mockResolvedValue(true)
    ;(removeBookmark as jest.Mock).mockResolvedValue(true)

    const result = await toggleBookmark(mockRecipeId)

    expect(isBookmarked).toHaveBeenCalledWith(mockRecipeId, undefined)
    expect(removeBookmark).toHaveBeenCalledWith(mockRecipeId, undefined)
    expect(addBookmark).not.toHaveBeenCalled()
    expect(result).toBe(false)
  })

  it('should add bookmark when recipe is not bookmarked', async () => {
    ;(isBookmarked as jest.Mock).mockResolvedValue(false)
    ;(addBookmark as jest.Mock).mockResolvedValue(true)

    const result = await toggleBookmark(mockRecipeId)

    expect(isBookmarked).toHaveBeenCalledWith(mockRecipeId, undefined)
    expect(addBookmark).toHaveBeenCalledWith(mockRecipeId, undefined)
    expect(removeBookmark).not.toHaveBeenCalled()
    expect(result).toBe(true)
  })

  it('should handle isBookmarked errors gracefully', async () => {
    const mockError = new Error('Check failed')
    ;(isBookmarked as jest.Mock).mockRejectedValue(mockError)

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const result = await toggleBookmark(mockRecipeId)

    expect(result).toBe(false)
    expect(consoleSpy).toHaveBeenCalledWith('toggling bookmark', mockError)
    expect(addBookmark).not.toHaveBeenCalled()
    expect(removeBookmark).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  it('should handle addBookmark errors gracefully', async () => {
    const mockError = new Error('Add failed')
    ;(isBookmarked as jest.Mock).mockResolvedValue(false)
    ;(addBookmark as jest.Mock).mockRejectedValue(mockError)

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const result = await toggleBookmark(mockRecipeId)

    expect(result).toBe(false)
    expect(consoleSpy).toHaveBeenCalledWith('toggling bookmark', mockError)

    consoleSpy.mockRestore()
  })

  it('should handle removeBookmark errors gracefully', async () => {
    const mockError = new Error('Remove failed')
    ;(isBookmarked as jest.Mock).mockResolvedValue(true)
    ;(removeBookmark as jest.Mock).mockRejectedValue(mockError)

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const result = await toggleBookmark(mockRecipeId)

    expect(result).toBe(false)
    expect(consoleSpy).toHaveBeenCalledWith('toggling bookmark', mockError)

    consoleSpy.mockRestore()
  })
})
