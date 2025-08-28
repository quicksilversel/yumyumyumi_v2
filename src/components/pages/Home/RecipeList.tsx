'use client'

import { useCallback, useEffect, useState, Suspense } from 'react'

import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { useSearchParams } from 'next/navigation'

import type { Recipe, RecipeFilters } from '@/types'

import { Container, Flex } from '@/components/ui'
import { useBookmarks } from '@/hooks/useBookmarks'
import { searchRecipes } from '@/lib/supabase/recipeService'

import { RecipeGrid } from './RecipeGrid'

import { EditRecipeDialog } from '../../ui/Modals/EditRecipeDialog'

type RecipeListProps = {
  initialRecipes: Recipe[]
}

function RecipeListInner({ initialRecipes }: RecipeListProps) {
  const searchParams = useSearchParams()
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes)
  const [filteredRecipes, setFilteredRecipes] =
    useState<Recipe[]>(initialRecipes)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const bookmarks = useBookmarks()

  const getFiltersFromParams = useCallback((): RecipeFilters => {
    const filters: RecipeFilters = {}

    const search = searchParams.get('search')
    if (search) filters.searchTerm = search

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
        let results = await searchRecipes(filters)

        if (filters.showBookmarkedOnly) {
          const bookmarkedIds = bookmarks.map((b) => b.recipeId)
          results = results.filter((recipe) =>
            bookmarkedIds.includes(recipe.id),
          )
        }

        setFilteredRecipes(results)
      } catch (err) {
        setError('Failed to filter recipes. Please try again.')
        console.warn('Error filtering recipes:', err)
      } finally {
        setLoading(false)
      }
    }

    applyFilters()
  }, [searchParams, bookmarks, getFiltersFromParams])

  const handleBookmarkChange = () => {
    const filters = getFiltersFromParams()
    if (filters.showBookmarkedOnly) {
      window.location.reload()
    }
  }

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe)
  }

  const handleRecipeUpdated = (updatedRecipe: Recipe) => {
    setRecipes((prev) =>
      prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r)),
    )
    setFilteredRecipes((prev) =>
      prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r)),
    )
    window.location.reload()
  }

  const handleDeleteRecipe = () => {
    window.location.reload()
  }

  return (
    <>
      <Container maxWidth="lg">
        <MainContent>
          {error && <ErrorMessage>{error}</ErrorMessage>}

          {loading ? (
            <LoadingContainer justify="center">
              <LoadingSpinner />
            </LoadingContainer>
          ) : (
            <RecipeGrid
              recipes={filteredRecipes}
              onBookmarkChange={handleBookmarkChange}
              onEdit={handleEditRecipe}
              onDelete={handleDeleteRecipe}
            />
          )}
        </MainContent>
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

const MainContent = styled.div`
  margin-top: ${({ theme }) => theme.spacing[6]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
  position: relative;
  z-index: 1;
`

const ErrorMessage = styled.div`
  background-color: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-bottom: ${({ theme }) => theme.spacing[6]};
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
  border-top-color: ${({ theme }) => theme.colors.black};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

const LoadingContainer = styled(Flex)`
  padding: ${({ theme }) => theme.spacing[16]} 0;
`

const RecipeListFallback = () => {
  return (
    <Container maxWidth="lg">
      <MainContent>
        <LoadingContainer justify="center">
          <LoadingSpinner />
        </LoadingContainer>
      </MainContent>
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
