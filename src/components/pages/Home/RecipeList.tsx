'use client'

import { useCallback, useEffect, Suspense } from 'react'

import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { useSearchParams } from 'next/navigation'

import type { Recipe, RecipeFilters } from '@/types/recipe'

import { Flex } from '@/components/ui'
import { useRecipeContext } from '@/contexts/RecipeContext'
import { useBookmarks } from '@/hooks/useBookmarks'
import { searchRecipesInSupabase } from '@/lib/supabase/tables/recipe/searchRecipesInSupabase'

import { RecipeGrid } from './RecipeGrid'
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

  const getFiltersFromParams = useCallback((): RecipeFilters => {
    const filters: RecipeFilters = {}

    const category = searchParams.get('category')
    if (category) filters.category = category as any

    const maxCookingTime = searchParams.get('maxCookingTime')
    if (maxCookingTime) filters.maxCookingTime = Number(maxCookingTime)

    const bookmarked = searchParams.get('bookmarked')
    if (bookmarked === 'true') filters.showBookmarkedOnly = true

    return filters
  }, [searchParams])

  useEffect(() => {
    const applyFilters = async () => {
      setLoading(true)
      setError(null)

      const filters = getFiltersFromParams()

      try {
        let results = await searchRecipesInSupabase(filters)

        if (filters.showBookmarkedOnly) {
          const bookmarkedIds = bookmarks.map((b) => b.recipeId)
          results = results.filter((recipe) =>
            bookmarkedIds.includes(recipe.id),
          )
        }

        setRecipes(results)
        setFilteredRecipes(results)
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
    setLoading,
    setError,
    setRecipes,
    setFilteredRecipes,
  ])

  useEffect(() => {
    if (!clientSearchTerm) {
      setFilteredRecipes(recipes)
      return
    }

    const searchLower = clientSearchTerm.toLowerCase()
    const filtered = recipes.filter((recipe) => {
      return (
        recipe.title.toLowerCase().includes(searchLower) ||
        recipe.summary?.toLowerCase().includes(searchLower) ||
        recipe.ingredients.some((ing) =>
          ing.name.toLowerCase().includes(searchLower),
        ) ||
        recipe.category?.toLowerCase().includes(searchLower)
      )
    })
    setFilteredRecipes(filtered)
  }, [clientSearchTerm, recipes, setFilteredRecipes])

  useEffect(() => {
    setRecipes(initialRecipes)
    setFilteredRecipes(initialRecipes)
  }, [initialRecipes, setRecipes, setFilteredRecipes])

  return (
    <>
      <Container>
        <SearchBar
          searchTerm={clientSearchTerm}
          onSearchChange={setClientSearchTerm}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {loading ? (
          <LoadingContainer justify="center">
            <LoadingSpinner />
          </LoadingContainer>
        ) : (
          <RecipeGrid />
        )}
      </Container>
      {editingRecipe && (
        <EditRecipeDialog
          open={Boolean(editingRecipe)}
          onClose={() => setEditingRecipe(null)}
          recipe={editingRecipe}
          onRecipeUpdated={handleRecipeUpdated}
        />
      )}
    </>
  )
}

const Container = styled.main`
  max-width: 1000px;
  margin: 0 auto;

  @media (width <= 35.1875rem) {
    margin: ${({ theme }) => theme.spacing[6]};
  }
`

const ErrorMessage = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.white};
`

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 3px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  border-top-color: ${({ theme }) => theme.colors.black};
`

const LoadingContainer = styled(Flex)`
  padding: ${({ theme }) => theme.spacing[16]} 0;
`

const RecipeListFallback = () => {
  return (
    <Container>
      <LoadingContainer justify="center">
        <LoadingSpinner />
      </LoadingContainer>
    </Container>
  )
}

export function RecipeList(props: RecipeListProps) {
  return (
    <Suspense fallback={<RecipeListFallback />}>
      <RecipeListInner {...props} />
    </Suspense>
  )
}
