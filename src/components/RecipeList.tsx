'use client'

import { useEffect, useState } from 'react'

import { Alert, Box, CircularProgress, Container, Paper, Skeleton, Typography } from '@mui/material'

import type { Recipe, RecipeFilters } from '@/types'

import { useBookmarks } from '@/hooks/useBookmarks'
import { searchRecipes } from '@/lib/recipeService'

import { AppHeader } from './AppHeader'
import { RecipeFiltersComponent } from './RecipeFilters'
import { RecipeGrid } from './RecipeGrid'
import { SearchBar } from './SearchBar'

type RecipeListProps = {
  initialRecipes: Recipe[]
}

export function RecipeList({ initialRecipes }: RecipeListProps) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes)
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>(initialRecipes)
  const [filters, setFilters] = useState<RecipeFilters>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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

  return (
    <>
      <AppHeader />
      
      <Box
        sx={{
          background: 'linear-gradient(180deg, #ff6b35 0%, #f77737 100%)',
          pt: 8,
          pb: 10,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            align="center"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
            Discover Amazing Recipes
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{
              color: 'rgba(255, 255, 255, 0.95)',
              mb: 4,
              fontWeight: 400,
            }}
          >
            Find, save, and share your favorite culinary creations
          </Typography>
          
          <Paper
            elevation={3}
            sx={{
              p: 2,
              borderRadius: 3,
              background: 'white',
            }}
          >
            <SearchBar onSearch={handleSearch} />
          </Paper>
        </Container>
        
        <Box
          sx={{
            position: 'absolute',
            bottom: -2,
            left: 0,
            right: 0,
            height: 80,
            background: 'white',
            borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
          }}
        />
      </Box>

      <Container maxWidth="lg" sx={{ mt: -4, mb: 4 }}>
        <RecipeFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
          bookmarkedCount={bookmarks.length}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={48} />
          </Box>
        ) : (
          <RecipeGrid
            recipes={filteredRecipes}
            onBookmarkChange={handleBookmarkChange}
          />
        )}
      </Container>
    </>
  )
}