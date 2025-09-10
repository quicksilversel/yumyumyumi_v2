import { ReactNode } from 'react'

import { renderHook, act, render, screen } from '@testing-library/react'

import type { Recipe } from '@/types/recipe'

import { RecipeProvider, useRecipeContext } from './RecipeContext'

// Mock Next.js navigation
const mockPush = jest.fn()
const mockRefresh = jest.fn()
const mockSearchParams = new URLSearchParams()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
    replace: jest.fn(),
  }),
  useSearchParams: () => mockSearchParams,
  usePathname: () => '/',
}))

describe('RecipeContext', () => {
  const mockRecipe1: Recipe = {
    id: '1',
    title: 'Recipe 1',
    summary: 'Summary 1',
    ingredients: [{ name: 'Ingredient 1', amount: '1 cup' }],
    directions: [{ title: 'Step 1', description: 'Do something' }],
    tags: ['tag1'],
    cookTime: 30,
    servings: 4,
    imageUrl: 'https://example.com/image1.jpg',
    userId: 'user1',
    isPublic: true,
    createdAt: '2024-01-01T00:00:00Z',
  }

  const mockRecipe2: Recipe = {
    id: '2',
    title: 'Recipe 2',
    summary: 'Summary 2',
    ingredients: [{ name: 'Ingredient 2', amount: '2 cups' }],
    directions: [{ title: 'Step 1', description: 'Do something' }],
    tags: ['tag2'],
    cookTime: 45,
    servings: 6,
    imageUrl: 'https://example.com/image2.jpg',
    userId: 'user1',
    isPublic: true,
    createdAt: '2024-01-02T00:00:00Z',
  }

  const wrapper = ({ children }: { children: ReactNode }) => (
    <RecipeProvider>{children}</RecipeProvider>
  )

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
    // Reset search params
    mockSearchParams.forEach((_, key) => {
      mockSearchParams.delete(key)
    })
  })

  describe('useRecipeContext', () => {
    it('should throw error when used outside RecipeProvider', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation()

      expect(() => {
        renderHook(() => useRecipeContext())
      }).toThrow('useRecipeContext must be used within a RecipeProvider')

      consoleError.mockRestore()
    })

    it('should provide initial context values', () => {
      const { result } = renderHook(() => useRecipeContext(), { wrapper })

      expect(result.current.recipes).toEqual([])
      expect(result.current.filteredRecipes).toEqual([])
      expect(result.current.editingRecipe).toBeNull()
      expect(result.current.expandedRecipeId).toBeNull()
      expect(result.current.clientSearchTerm).toBe('')
      expect(result.current.loading).toBe(true)
      expect(result.current.error).toBeNull()
    })
  })

  describe('state setters', () => {
    it('should update recipes', () => {
      const { result } = renderHook(() => useRecipeContext(), { wrapper })

      act(() => {
        result.current.setRecipes([mockRecipe1, mockRecipe2])
      })

      expect(result.current.recipes).toEqual([mockRecipe1, mockRecipe2])
    })

    it('should update filtered recipes', () => {
      const { result } = renderHook(() => useRecipeContext(), { wrapper })

      act(() => {
        result.current.setFilteredRecipes([mockRecipe1])
      })

      expect(result.current.filteredRecipes).toEqual([mockRecipe1])
    })

    it('should update editing recipe', () => {
      const { result } = renderHook(() => useRecipeContext(), { wrapper })

      act(() => {
        result.current.setEditingRecipe(mockRecipe1)
      })

      expect(result.current.editingRecipe).toEqual(mockRecipe1)
    })

    it('should update expanded recipe ID', () => {
      const { result } = renderHook(() => useRecipeContext(), { wrapper })

      act(() => {
        result.current.setExpandedRecipeId('recipe123')
      })

      expect(result.current.expandedRecipeId).toBe('recipe123')
    })

    it('should update client search term', () => {
      const { result } = renderHook(() => useRecipeContext(), { wrapper })

      act(() => {
        result.current.setClientSearchTerm('pasta')
      })

      expect(result.current.clientSearchTerm).toBe('pasta')
    })

    it('should update loading state', () => {
      const { result } = renderHook(() => useRecipeContext(), { wrapper })

      act(() => {
        result.current.setLoading(false)
      })

      expect(result.current.loading).toBe(false)
    })

    it('should update error state', () => {
      const { result } = renderHook(() => useRecipeContext(), { wrapper })

      act(() => {
        result.current.setError('Something went wrong')
      })

      expect(result.current.error).toBe('Something went wrong')
    })
  })

  describe('handleBookmarkChange', () => {
    it('should refresh page when bookmarked param is true', () => {
      mockSearchParams.set('bookmarked', 'true')
      const { result } = renderHook(() => useRecipeContext(), { wrapper })

      act(() => {
        result.current.handleBookmarkChange()
      })

      expect(mockRefresh).toHaveBeenCalled()
    })

    it('should not refresh page when bookmarked param is not true', () => {
      mockSearchParams.set('bookmarked', 'false')
      const { result } = renderHook(() => useRecipeContext(), { wrapper })

      act(() => {
        result.current.handleBookmarkChange()
      })

      expect(mockRefresh).not.toHaveBeenCalled()
    })

    it('should not refresh page when bookmarked param is absent', () => {
      mockSearchParams.set('other', 'value')
      const { result } = renderHook(() => useRecipeContext(), { wrapper })

      act(() => {
        result.current.handleBookmarkChange()
      })

      expect(mockRefresh).not.toHaveBeenCalled()
    })
  })

  describe('handleEditRecipe', () => {
    it('should set editing recipe', () => {
      const { result } = renderHook(() => useRecipeContext(), { wrapper })

      act(() => {
        result.current.handleEditRecipe(mockRecipe1)
      })

      expect(result.current.editingRecipe).toEqual(mockRecipe1)
    })
  })

  describe('handleDeleteRecipe', () => {
    it('should refresh page', () => {
      const { result } = renderHook(() => useRecipeContext(), { wrapper })

      act(() => {
        result.current.handleDeleteRecipe()
      })

      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  describe('handleRecipeUpdated', () => {
    it('should update recipe in both recipes and filtered recipes', () => {
      const { result } = renderHook(() => useRecipeContext(), { wrapper })

      // Set initial recipes
      act(() => {
        result.current.setRecipes([mockRecipe1, mockRecipe2])
        result.current.setFilteredRecipes([mockRecipe1, mockRecipe2])
      })

      // Update recipe 1
      const updatedRecipe1 = { ...mockRecipe1, title: 'Updated Recipe 1' }

      act(() => {
        result.current.handleRecipeUpdated(updatedRecipe1)
      })

      expect(result.current.recipes[0].title).toBe('Updated Recipe 1')
      expect(result.current.filteredRecipes[0].title).toBe('Updated Recipe 1')
      expect(result.current.recipes[1]).toEqual(mockRecipe2)
      expect(mockRefresh).toHaveBeenCalled()
    })

    it('should not affect other recipes', () => {
      const { result } = renderHook(() => useRecipeContext(), { wrapper })

      act(() => {
        result.current.setRecipes([mockRecipe1, mockRecipe2])
        result.current.setFilteredRecipes([mockRecipe1, mockRecipe2])
      })

      const updatedRecipe1 = { ...mockRecipe1, title: 'Updated' }

      act(() => {
        result.current.handleRecipeUpdated(updatedRecipe1)
      })

      expect(result.current.recipes[1]).toEqual(mockRecipe2)
      expect(result.current.filteredRecipes[1]).toEqual(mockRecipe2)
    })

    it('should handle updating non-existent recipe', () => {
      const { result } = renderHook(() => useRecipeContext(), { wrapper })

      act(() => {
        result.current.setRecipes([mockRecipe1])
        result.current.setFilteredRecipes([mockRecipe1])
      })

      const newRecipe: Recipe = { ...mockRecipe2, id: '999' }

      act(() => {
        result.current.handleRecipeUpdated(newRecipe)
      })

      // Original recipes should remain unchanged
      expect(result.current.recipes).toEqual([mockRecipe1])
      expect(result.current.filteredRecipes).toEqual([mockRecipe1])
    })
  })

  describe('handleToggleIngredients', () => {
    it('should toggle expanded recipe ID', () => {
      const { result } = renderHook(() => useRecipeContext(), { wrapper })

      // Expand recipe 1
      act(() => {
        result.current.handleToggleIngredients('recipe1')
      })

      expect(result.current.expandedRecipeId).toBe('recipe1')

      // Collapse recipe 1
      act(() => {
        result.current.handleToggleIngredients('recipe1')
      })

      expect(result.current.expandedRecipeId).toBeNull()
    })

    it('should switch between different recipes', () => {
      const { result } = renderHook(() => useRecipeContext(), { wrapper })

      // Expand recipe 1
      act(() => {
        result.current.handleToggleIngredients('recipe1')
      })

      expect(result.current.expandedRecipeId).toBe('recipe1')

      // Switch to recipe 2
      act(() => {
        result.current.handleToggleIngredients('recipe2')
      })

      expect(result.current.expandedRecipeId).toBe('recipe2')
    })
  })

  describe('Provider integration', () => {
    it('should provide context to children components', () => {
      const TestComponent = () => {
        const context = useRecipeContext()
        return (
          <div>
            <span data-testid="loading">{String(context.loading)}</span>
            <span data-testid="recipe-count">{context.recipes.length}</span>
          </div>
        )
      }

      render(
        <RecipeProvider>
          <TestComponent />
        </RecipeProvider>,
      )

      expect(screen.getByTestId('loading')).toHaveTextContent('true')
      expect(screen.getByTestId('recipe-count')).toHaveTextContent('0')
    })

    it('should share state between multiple consumers', () => {
      const Consumer1 = () => {
        const { setRecipes } = useRecipeContext()
        return (
          <button onClick={() => setRecipes([mockRecipe1])}>Add Recipe</button>
        )
      }

      const Consumer2 = () => {
        const { recipes } = useRecipeContext()
        return <span data-testid="count">{recipes.length}</span>
      }

      const { getByText, getByTestId } = render(
        <RecipeProvider>
          <Consumer1 />
          <Consumer2 />
        </RecipeProvider>,
      )

      expect(getByTestId('count')).toHaveTextContent('0')

      act(() => {
        getByText('Add Recipe').click()
      })

      expect(getByTestId('count')).toHaveTextContent('1')
    })
  })
})
