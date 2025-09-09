'use client'

import { useCallback, useEffect, useState, Suspense, useRef } from 'react'

import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { useSearchParams } from 'next/navigation'

import type { Recipe, RecipeFilters } from '@/types/recipe'

import { useRecipeContext } from '@/contexts/RecipeContext'
import { useBookmarks } from '@/hooks/useBookmarks'
import { searchRecipesInSupabase } from '@/lib/supabase/tables/recipe/searchRecipesInSupabase'

import { RecipeGrid } from './RecipeGrid'
import { RecipeSortButton, type SortOption } from './RecipeSortButton'
import { SearchBar } from './SearchBar'

import { EditRecipeDialog } from '../Modals/EditRecipeDialog'

type RecipeListProps = {
  initialRecipes: Recipe[]
}

function RecipeListInner({ initialRecipes }: RecipeListProps) {
  const searchParams = useSearchParams()
  const { bookmarks } = useBookmarks()
  const {
    recipes,
    clientSearchTerm,
    loading,
    error,
    editingRecipe,
    setRecipes,
    setFilteredRecipes,
    setClientSearchTerm,
    setLoading,
    setError,
    setEditingRecipe,
    handleRecipeUpdated,
  } = useRecipeContext()

  const [selectedSort, setSelectedSort] = useState<SortOption>('date-desc')
  const hasInitialized = useRef(false)
  const prevSearchParams = useRef(searchParams.toString())

  const getFiltersFromParams = useCallback((): RecipeFilters => {
    const filters: RecipeFilters = {}

    const maxCookingTime = searchParams.get('maxCookingTime')
    if (maxCookingTime) filters.maxCookingTime = Number(maxCookingTime)

    const bookmarked = searchParams.get('bookmarked')
    if (bookmarked === 'true') filters.showBookmarkedOnly = true

    const tag = searchParams.get('tag')
    if (tag) filters.tag = tag

    return filters
  }, [searchParams])

  const sortRecipes = useCallback(
    (recipesToSort: Recipe[], sortType: SortOption): Recipe[] => {
      const sorted = [...recipesToSort]

      switch (sortType) {
        case 'date-asc':
          return sorted.sort(
            (a, b) =>
              new Date(a.createdAt || 0).getTime() -
              new Date(b.createdAt || 0).getTime(),
          )
        case 'date-desc':
          return sorted.sort(
            (a, b) =>
              new Date(b.createdAt || 0).getTime() -
              new Date(a.createdAt || 0).getTime(),
          )
        case 'alphabetical':
          return sorted.sort((a, b) =>
            a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
          )
        case 'cooktime-asc':
          return sorted.sort((a, b) => (a.cookTime || 0) - (b.cookTime || 0))
        case 'cooktime-desc':
          return sorted.sort((a, b) => (b.cookTime || 0) - (a.cookTime || 0))
        default:
          return sorted
      }
    },
    [],
  )

  useEffect(() => {
    if (!hasInitialized.current && initialRecipes) {
      const sortedRecipes = sortRecipes(initialRecipes, selectedSort)
      setRecipes(initialRecipes)
      setFilteredRecipes(sortedRecipes)
      setLoading(false)
      hasInitialized.current = true
    }
  }, [
    initialRecipes,
    selectedSort,
    sortRecipes,
    setRecipes,
    setFilteredRecipes,
    setLoading,
  ])

  useEffect(() => {
    const currentParams = searchParams.toString()

    // Skip if this is the initial mount or params haven't changed
    if (!hasInitialized.current || prevSearchParams.current === currentParams) {
      prevSearchParams.current = currentParams
      return
    }

    prevSearchParams.current = currentParams

    const applyFilters = async () => {
      const filters = getFiltersFromParams()

      // If there are no filters, use the initial recipes instead of fetching
      const hasFilters =
        filters.maxCookingTime || filters.tag || filters.showBookmarkedOnly
      if (!hasFilters) {
        const sortedResults = sortRecipes(initialRecipes, selectedSort)
        setRecipes(initialRecipes)
        setFilteredRecipes(sortedResults)
        return
      }

      setLoading(true)
      setError(null)

      try {
        let results = await searchRecipesInSupabase(filters)

        if (filters.showBookmarkedOnly) {
          const bookmarkedIds = bookmarks.map((b) => b.recipeId)
          results = results.filter((recipe) =>
            bookmarkedIds.includes(recipe.id),
          )
        }

        setRecipes(results)
        const sortedResults = sortRecipes(results, selectedSort)
        setFilteredRecipes(sortedResults)
      } catch (err) {
        setError('Failed to filter recipes. Please try again.')
        console.warn('Error filtering recipes:', err)
      } finally {
        setLoading(false)
      }
    }

    applyFilters()
  }, [
    searchParams,
    bookmarks,
    getFiltersFromParams,
    selectedSort,
    sortRecipes,
    setLoading,
    setError,
    setRecipes,
    setFilteredRecipes,
    initialRecipes,
  ])

  useEffect(() => {
    if (!hasInitialized.current) return
    const sortedRecipes = sortRecipes(recipes, selectedSort)
    setFilteredRecipes(sortedRecipes)
  }, [selectedSort, recipes, sortRecipes, setFilteredRecipes])

  useEffect(() => {
    if (!hasInitialized.current) return

    if (!clientSearchTerm) {
      const sortedRecipes = sortRecipes(recipes, selectedSort)
      setFilteredRecipes(sortedRecipes)
      return
    }

    const searchLower = clientSearchTerm.toLowerCase()
    let filtered = recipes.filter((recipe) => {
      return (
        recipe.title.toLowerCase().includes(searchLower) ||
        recipe.summary?.toLowerCase().includes(searchLower) ||
        recipe.ingredients.some((ing) =>
          ing.name.toLowerCase().includes(searchLower),
        ) ||
        recipe.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
      )
    })

    filtered = sortRecipes(filtered, selectedSort)
    setFilteredRecipes(filtered)
  }, [clientSearchTerm, recipes, selectedSort, sortRecipes, setFilteredRecipes])

  return (
    <>
      <StyledList>
        <SearchBar
          searchTerm={clientSearchTerm}
          onSearchChange={setClientSearchTerm}
        />
        <RecipeSortButton
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
        />

        {loading ? (
          <LoadingOverlay>
            <Spinner />
          </LoadingOverlay>
        ) : error ? (
          <div>{error}</div>
        ) : (
          <RecipeGrid />
        )}
      </StyledList>

      {editingRecipe && (
        <EditRecipeDialog
          open={!!editingRecipe}
          onClose={() => setEditingRecipe(null)}
          recipe={editingRecipe}
          onRecipeUpdated={handleRecipeUpdated}
        />
      )}
    </>
  )
}

const StyledList = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`

const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Spinner = styled.div`
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-left-color: #333;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
`

export function RecipeList({ initialRecipes }: RecipeListProps) {
  return (
    <Suspense
      fallback={
        <LoadingOverlay>
          <Spinner />
        </LoadingOverlay>
      }
    >
      <RecipeListInner initialRecipes={initialRecipes} />
    </Suspense>
  )
}
