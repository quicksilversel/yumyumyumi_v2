import { renderHook, act } from '@testing-library/react'
import { type Mock } from 'vitest'

import type { Recipe } from '@/types/recipe'

import { deleteRecipe } from '@/lib/db/queries/recipe'

import { useRecipeActions } from './useRecipeActions'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}))

vi.mock('@/lib/db/queries/recipe', () => ({
  deleteRecipe: vi.fn(),
}))

const mockDeleteRecipe = deleteRecipe as unknown as Mock
const reloadMock = vi.fn()

const recipe = {
  id: 'recipe-1',
  title: 'テストレシピ',
} as unknown as Recipe

describe('useRecipeActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: reloadMock },
    })
  })

  it('starts with all dialogs closed and no error', () => {
    const { result } = renderHook(() => useRecipeActions(recipe))

    expect(result.current.isDeleting).toBe(false)
    expect(result.current.editDialogOpen).toBe(false)
    expect(result.current.deleteDialogOpen).toBe(false)
    expect(result.current.deleteError).toBeNull()
  })

  describe('handleEdit', () => {
    it('calls onEditOpen when provided instead of opening the dialog', () => {
      const onEditOpen = vi.fn()
      const { result } = renderHook(() =>
        useRecipeActions(recipe, { onEditOpen }),
      )

      act(() => result.current.handleEdit())

      expect(onEditOpen).toHaveBeenCalledWith(recipe)
      expect(result.current.editDialogOpen).toBe(false)
    })

    it('opens the edit dialog when no onEditOpen is provided', () => {
      const { result } = renderHook(() => useRecipeActions(recipe))

      act(() => result.current.handleEdit())

      expect(result.current.editDialogOpen).toBe(true)
    })
  })

  describe('handleDelete', () => {
    it('opens the delete dialog and clears any prior error', () => {
      const { result } = renderHook(() => useRecipeActions(recipe))

      act(() => result.current.handleDelete())

      expect(result.current.deleteDialogOpen).toBe(true)
      expect(result.current.deleteError).toBeNull()
    })
  })

  describe('confirmDelete', () => {
    it('deletes and calls onDeleteSuccess when provided', async () => {
      mockDeleteRecipe.mockResolvedValue(true)
      const onDeleteSuccess = vi.fn()
      const { result } = renderHook(() =>
        useRecipeActions(recipe, { onDeleteSuccess }),
      )

      await act(async () => {
        await result.current.confirmDelete()
      })

      expect(mockDeleteRecipe).toHaveBeenCalledWith('recipe-1')
      expect(onDeleteSuccess).toHaveBeenCalledTimes(1)
      expect(result.current.deleteDialogOpen).toBe(false)
      expect(result.current.isDeleting).toBe(false)
      expect(mockPush).not.toHaveBeenCalled()
      expect(reloadMock).not.toHaveBeenCalled()
    })

    it('redirects home when redirectOnDelete is set', async () => {
      mockDeleteRecipe.mockResolvedValue(true)
      const { result } = renderHook(() =>
        useRecipeActions(recipe, { redirectOnDelete: true }),
      )

      await act(async () => {
        await result.current.confirmDelete()
      })

      expect(mockPush).toHaveBeenCalledWith('/')
    })

    it('reloads the page by default after a successful delete', async () => {
      mockDeleteRecipe.mockResolvedValue(true)
      const { result } = renderHook(() => useRecipeActions(recipe))

      await act(async () => {
        await result.current.confirmDelete()
      })

      expect(reloadMock).toHaveBeenCalledTimes(1)
    })

    it('sets an error and keeps the dialog open when delete fails', async () => {
      mockDeleteRecipe.mockResolvedValue(false)
      const onDeleteSuccess = vi.fn()
      const { result } = renderHook(() =>
        useRecipeActions(recipe, { onDeleteSuccess }),
      )

      act(() => result.current.handleDelete())
      await act(async () => {
        await result.current.confirmDelete()
      })

      expect(result.current.deleteError).toBe(
        '削除に失敗しました。時間をおいて再度お試しください。',
      )
      expect(result.current.deleteDialogOpen).toBe(true)
      expect(result.current.isDeleting).toBe(false)
      expect(onDeleteSuccess).not.toHaveBeenCalled()
    })
  })
})
