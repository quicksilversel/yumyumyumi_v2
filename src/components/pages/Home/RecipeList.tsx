'use client'

import { useCallback, useEffect, useState, Suspense, useRef } from 'react'

import styled from '@emotion/styled'
import { useSearchParams } from 'next/navigation'

import type { Recipe, RecipeFilters } from '@/types/recipe'

import { Spinner } from '@/components/ui'
import { useRecipeContext } from '@/contexts/RecipeContext'
import { useBookmarks } from '@/hooks/useBookmarks'

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

  const filterRecipesClientSide = useCallback(
    (recipesToFilter: Recipe[], filters: RecipeFilters): Recipe[] => {
      let filtered = [...recipesToFilter]

      if (filters.maxCookingTime) {
        filtered = filtered.filter(
          (recipe) => (recipe.cookTime || 0) <= filters.maxCookingTime!,
        )
      }

      if (filters.tag) {
        const decodedTag = decodeURI(filters.tag)
        filtered = filtered.filter((recipe) =>
          recipe.tags?.includes(decodedTag),
        )
      }

      if (filters.showBookmarkedOnly) {
        const bookmarkedIds = bookmarks.map((b) => b.recipeId)
        filtered = filtered.filter((recipe) =>
          bookmarkedIds.includes(recipe.id),
        )
      }

      return filtered
    },
    [bookmarks],
  )

  useEffect(() => {
    if (!hasInitialized.current && initialRecipes) {
      setRecipes(initialRecipes)
      setLoading(false)
      hasInitialized.current = true
    }
  }, [initialRecipes, setRecipes, setLoading])

  useEffect(() => {
    if (!hasInitialized.current) return

    let filtered = recipes

    const filters = getFiltersFromParams()
    filtered = filterRecipesClientSide(filtered, filters)

    if (clientSearchTerm) {
      const searchLower = clientSearchTerm.toLowerCase()
      filtered = filtered.filter((recipe) => {
        return (
          recipe.title.toLowerCase().includes(searchLower) ||
          recipe.summary?.toLowerCase().includes(searchLower) ||
          recipe.ingredients.some((ing) =>
            ing.name.toLowerCase().includes(searchLower),
          ) ||
          recipe.tags?.some((tag) => tag.toLowerCase().includes(searchLower))
        )
      })
    }

    filtered = sortRecipes(filtered, selectedSort)
    setFilteredRecipes(filtered)
  }, [
    recipes,
    searchParams,
    clientSearchTerm,
    selectedSort,
    bookmarks,
    getFiltersFromParams,
    filterRecipesClientSide,
    sortRecipes,
    setFilteredRecipes,
  ])

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
  max-width: 1200px;
  padding: 20px;
  margin: 0 auto;
`

const LoadingOverlay = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
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
