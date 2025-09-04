'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react'

import type { Recipe } from '@/types/recipe'

type RecipeContextType = {
  recipes: Recipe[]
  filteredRecipes: Recipe[]
  editingRecipe: Recipe | null
  expandedRecipeId: string | null

  clientSearchTerm: string

  loading: boolean
  error: string | null

  setRecipes: (recipes: Recipe[]) => void
  setFilteredRecipes: (recipes: Recipe[]) => void
  setEditingRecipe: (recipe: Recipe | null) => void
  setExpandedRecipeId: (id: string | null) => void
  setClientSearchTerm: (term: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  handleBookmarkChange: () => void
  handleEditRecipe: (recipe: Recipe) => void
  handleDeleteRecipe: () => void
  handleRecipeUpdated: (updatedRecipe: Recipe) => void
  handleToggleIngredients: (recipeId: string) => void
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined)

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null)
  const [clientSearchTerm, setClientSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleBookmarkChange = useCallback(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('bookmarked') === 'true') {
      window.location.reload()
    }
  }, [])

  const handleEditRecipe = useCallback((recipe: Recipe) => {
    setEditingRecipe(recipe)
  }, [])

  const handleDeleteRecipe = useCallback(() => {
    window.location.reload()
  }, [])

  const handleRecipeUpdated = useCallback((updatedRecipe: Recipe) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r)),
    )
    setFilteredRecipes((prev) =>
      prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r)),
    )
    window.location.reload()
  }, [])

  const handleToggleIngredients = useCallback(
    (recipeId: string) => {
      setExpandedRecipeId(expandedRecipeId === recipeId ? null : recipeId)
    },
    [expandedRecipeId],
  )

  const value: RecipeContextType = {
    recipes,
    filteredRecipes,
    editingRecipe,
    expandedRecipeId,
    clientSearchTerm,
    loading,
    error,
    setRecipes,
    setFilteredRecipes,
    setEditingRecipe,
    setExpandedRecipeId,
    setClientSearchTerm,
    setLoading,
    setError,
    handleBookmarkChange,
    handleEditRecipe,
    handleDeleteRecipe,
    handleRecipeUpdated,
    handleToggleIngredients,
  }

  return (
    <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
  )
}

export function useRecipeContext() {
  const context = useContext(RecipeContext)
  if (context === undefined) {
    throw new Error('useRecipeContext must be used within a RecipeProvider')
  }
  return context
}
