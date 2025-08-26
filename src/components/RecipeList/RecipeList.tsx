'use client'

import { useEffect, useState } from 'react'

import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'

import type { Recipe, RecipeFilters } from '@/types'

import { Container, Flex } from '@/components/ui'
import { useBookmarks } from '@/hooks/useBookmarks'
import { searchRecipes } from '@/lib/supabase/recipeService'
import { colors, spacing, borderRadius } from '@/styles/designTokens'

import { RecipeGrid } from './RecipeGrid'

import { EditRecipeDialog } from '../EditRecipeDialog'
import { RecipeFiltersComponent } from '../RecipeFilters'
import { SearchBar } from '../SearchBar'

type RecipeListProps = {
  initialRecipes: Recipe[]
}

export function RecipeList({ initialRecipes }: RecipeListProps) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes)
  const [filteredRecipes, setFilteredRecipes] =
    useState<Recipe[]>(initialRecipes)
  const [filters, setFilters] = useState<RecipeFilters>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null)
  const bookmarks = useBookmarks()

  useEffect(() => {
    const applyFilters = async () => {
      setLoading(true)
      setError(null)

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
  }, [filters, bookmarks])

  const handleSearch = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, searchTerm }))
  }

  const handleFiltersChange = (newFilters: RecipeFilters) => {
    setFilters(newFilters)
  }

  const handleBookmarkChange = () => {
    if (filters.showBookmarkedOnly) {
      setFilters({ ...filters })
    }
  }

  const handleEditRecipe = (recipe: Recipe) => {
    setEditingRecipe(recipe)
  }

  const handleRecipeUpdated = (updatedRecipe: Recipe) => {
    // Update the recipe in the list
    setRecipes((prev) =>
      prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r)),
    )
    setFilteredRecipes((prev) =>
      prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r)),
    )
    window.location.reload()
  }

  const handleDeleteRecipe = () => {
    // Refresh the page after deletion
    window.location.reload()
  }

  return (
    <>
      <SearchWrapper>
        <SearchBar onSearch={handleSearch} />
      </SearchWrapper>

      <Container maxWidth="lg">
        <MainContent>
          <RecipeFiltersComponent
            filters={filters}
            onFiltersChange={handleFiltersChange}
            bookmarkedCount={bookmarks.length}
          />

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

      {/* Edit Recipe Dialog */}
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

const SearchWrapper = styled.div`
  width: 100%;
  height: 5rem;
  margin: 2rem auto;
`

const MainContent = styled.div`
  margin-top: -${spacing[8]};
  margin-bottom: ${spacing[8]};
  position: relative;
  z-index: 1;
`

const ErrorMessage = styled.div`
  background-color: ${colors.error};
  color: ${colors.white};
  padding: ${spacing[4]};
  border-radius: ${borderRadius.lg};
  margin-bottom: ${spacing[6]};
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
  border: 3px solid ${colors.gray[200]};
  border-top-color: ${colors.black};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`

const LoadingContainer = styled(Flex)`
  padding: ${spacing[16]} 0;
`
