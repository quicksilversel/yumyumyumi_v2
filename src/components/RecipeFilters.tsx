'use client'

import { useState } from 'react'

import AccessTimeIcon from '@mui/icons-material/AccessTime'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import CategoryIcon from '@mui/icons-material/Category'
import ClearIcon from '@mui/icons-material/Clear'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FilterListIcon from '@mui/icons-material/FilterList'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Switch,
  Typography,
} from '@mui/material'

import type { RecipeCategory, RecipeFilters } from '@/types'

import { getCookingTimeRanges, getRecipeCategories } from '@/lib/recipeService'

type RecipeFiltersProps = {
  filters: RecipeFilters
  onFiltersChange: (filters: RecipeFilters) => void
  bookmarkedCount?: number
}

export function RecipeFiltersComponent({
  filters,
  onFiltersChange,
  bookmarkedCount = 0,
}: RecipeFiltersProps) {
  const [expanded, setExpanded] = useState(false)
  const categories = getRecipeCategories()
  const timeRanges = getCookingTimeRanges()

  const handleCategoryChange = (event: any) => {
    onFiltersChange({
      ...filters,
      category: event.target.value || undefined,
    })
  }

  const handleTimeChange = (event: any) => {
    onFiltersChange({
      ...filters,
      maxCookingTime: event.target.value || undefined,
    })
  }

  const handleBookmarkedToggle = () => {
    onFiltersChange({
      ...filters,
      showBookmarkedOnly: !filters.showBookmarkedOnly,
    })
  }

  const clearFilters = () => {
    onFiltersChange({})
  }

  const activeFiltersCount = [
    filters.category,
    filters.maxCookingTime,
    filters.showBookmarkedOnly,
  ].filter(Boolean).length

  return (
    <Paper
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        mb: 3,
        overflow: 'hidden',
      }}
    >
      <Accordion
        expanded={expanded}
        onChange={() => setExpanded(!expanded)}
        elevation={0}
        sx={{
          '&:before': {
            display: 'none',
          },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{
            '& .MuiAccordionSummary-content': {
              alignItems: 'center',
              gap: 2,
            },
          }}
        >
          <FilterListIcon color="action" />
          <Typography variant="h6" fontWeight={500}>
            Filters
          </Typography>
          {activeFiltersCount > 0 && (
            <Badge badgeContent={activeFiltersCount} color="primary" />
          )}
        </AccordionSummary>
        
        <AccordionDetails>
          <Stack spacing={3}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <FormControl size="medium" sx={{ minWidth: 200 }}>
                <InputLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CategoryIcon fontSize="small" />
                    Category
                  </Box>
                </InputLabel>
                <Select
                  value={filters.category || ''}
                  onChange={handleCategoryChange}
                  label="Category"
                >
                  <MenuItem value="">
                    <em>All Categories</em>
                  </MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="medium" sx={{ minWidth: 200 }}>
                <InputLabel>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTimeIcon fontSize="small" />
                    Cooking Time
                  </Box>
                </InputLabel>
                <Select
                  value={filters.maxCookingTime || ''}
                  onChange={handleTimeChange}
                  label="Cooking Time"
                >
                  <MenuItem value="">
                    <em>Any Duration</em>
                  </MenuItem>
                  {timeRanges.map((range) => (
                    <MenuItem key={range.label} value={range.value || ''}>
                      {range.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={filters.showBookmarkedOnly || false}
                    onChange={handleBookmarkedToggle}
                    color="primary"
                    icon={<BookmarkIcon />}
                    checkedIcon={<BookmarkIcon />}
                  />
                }
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography>Bookmarked Only</Typography>
                    <Chip label={bookmarkedCount} size="small" variant="outlined" />
                  </Box>
                }
              />

              {activeFiltersCount > 0 && (
                <Button
                  variant="text"
                  startIcon={<ClearIcon />}
                  onClick={clearFilters}
                  color="secondary"
                >
                  Clear All
                </Button>
              )}
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {!expanded && activeFiltersCount > 0 && (
        <Box sx={{ px: 2, py: 1.5, borderTop: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {filters.category && (
              <Chip
                label={filters.category}
                onDelete={() => onFiltersChange({ ...filters, category: undefined })}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {filters.maxCookingTime && (
              <Chip
                label={`< ${filters.maxCookingTime} min`}
                onDelete={() => onFiltersChange({ ...filters, maxCookingTime: undefined })}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {filters.showBookmarkedOnly && (
              <Chip
                label="Bookmarked"
                onDelete={() => onFiltersChange({ ...filters, showBookmarkedOnly: false })}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Stack>
        </Box>
      )}
    </Paper>
  )
}