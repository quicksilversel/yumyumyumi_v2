'use client'

import { useState } from 'react'

import styled from '@emotion/styled'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import CategoryIcon from '@mui/icons-material/Category'
import ClearIcon from '@mui/icons-material/Clear'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FilterListIcon from '@mui/icons-material/FilterList'

import type { RecipeFilters, RecipeCategory } from '@/types'

import { Button } from '@/components/ui/Button'
import { Chip, ChipGroup } from '@/components/ui/Chip'
import { Select, FormField, FormLabel } from '@/components/ui/Input'
import { Flex, Stack } from '@/components/ui/Layout'
import { H5 } from '@/components/ui/Typography'
import {
  getCookingTimeRanges,
  getRecipeCategories,
} from '@/lib/supabase/recipeService'
import {
  colors,
  spacing,
  borderRadius,
  transition,
  typography,
} from '@/styles/designTokens'

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

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      ...filters,
      category: e.target.value as RecipeCategory | undefined,
    })
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : undefined
    onFiltersChange({
      ...filters,
      maxCookingTime: value,
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
    <FilterContainer>
      <FilterHeader onClick={() => setExpanded(!expanded)}>
        <FilterListIcon />
        <H5>Filters</H5>
        {activeFiltersCount > 0 && <Badge>{activeFiltersCount}</Badge>}
        <ExpandIcon expanded={expanded} />
      </FilterHeader>

      <FilterContent expanded={expanded}>
        <Stack gap={4}>
          <FilterRow>
            <StyledFormField>
              <FormLabel>
                <IconLabel>
                  <CategoryIcon />
                  Category
                </IconLabel>
              </FormLabel>
              <Select
                value={filters.category || ''}
                onChange={handleCategoryChange}
                fullWidth
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </StyledFormField>

            <StyledFormField>
              <FormLabel>
                <IconLabel>
                  <AccessTimeIcon />
                  Cooking Time
                </IconLabel>
              </FormLabel>
              <Select
                value={filters.maxCookingTime || ''}
                onChange={handleTimeChange}
                fullWidth
              >
                <option value="">Any Duration</option>
                {timeRanges.map((range) => (
                  <option key={range.label} value={range.value || ''}>
                    {range.label}
                  </option>
                ))}
              </Select>
            </StyledFormField>
          </FilterRow>

          <Flex justify="between" align="center">
            <ToggleButton
              active={filters.showBookmarkedOnly || false}
              onClick={handleBookmarkedToggle}
              type="button"
            >
              <BookmarkIcon />
              Bookmarked Only
              <Badge>{bookmarkedCount}</Badge>
            </ToggleButton>

            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <ClearIcon />
                Clear All
              </Button>
            )}
          </Flex>
        </Stack>
      </FilterContent>

      {!expanded && activeFiltersCount > 0 && (
        <ActiveFilters>
          <ChipGroup gap={2}>
            {filters.category && (
              <Chip
                size="sm"
                variant="outlined"
                clickable
                onClick={() =>
                  onFiltersChange({ ...filters, category: undefined })
                }
              >
                {filters.category} ×
              </Chip>
            )}
            {filters.maxCookingTime && (
              <Chip
                size="sm"
                variant="outlined"
                clickable
                onClick={() =>
                  onFiltersChange({ ...filters, maxCookingTime: undefined })
                }
              >
                &lt; {filters.maxCookingTime} min ×
              </Chip>
            )}
            {filters.showBookmarkedOnly && (
              <Chip
                size="sm"
                variant="outlined"
                clickable
                onClick={() =>
                  onFiltersChange({ ...filters, showBookmarkedOnly: false })
                }
              >
                Bookmarked ×
              </Chip>
            )}
          </ChipGroup>
        </ActiveFilters>
      )}
    </FilterContainer>
  )
}

const FilterContainer = styled.div`
  border: 1px solid ${colors.gray[200]};
  border-radius: ${borderRadius.lg};
  background: ${colors.white};
  margin-bottom: ${spacing[6]};
  overflow: hidden;
`

const FilterHeader = styled.button`
  width: 100%;
  padding: ${spacing[4]} ${spacing[6]};
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
  transition: background-color ${transition.default};

  &:hover {
    background-color: ${colors.gray[50]};
  }
`

const ExpandIcon = styled(ExpandMoreIcon, {
  shouldForwardProp: (prop) => prop !== 'expanded',
})<{ expanded: boolean }>`
  margin-left: auto;
  transition: transform ${transition.default};
  transform: rotate(${(props) => (props.expanded ? '180deg' : '0deg')});
`

const Badge = styled.span`
  background-color: ${colors.black};
  color: ${colors.white};
  font-size: ${typography.fontSize.xs};
  font-weight: ${typography.fontWeight.semibold};
  padding: ${spacing[0.5]} ${spacing[2]};
  border-radius: ${borderRadius.full};
  min-width: 20px;
  text-align: center;
`

const FilterContent = styled.div<{ expanded: boolean }>`
  max-height: ${(props) => (props.expanded ? '500px' : '0')};
  overflow: hidden;
  transition: max-height ${transition.slow};
  padding: ${(props) =>
    props.expanded ? `0 ${spacing[6]} ${spacing[6]}` : '0'};
`

const FilterRow = styled(Flex)`
  flex-wrap: wrap;
  gap: ${spacing[4]};
  margin-bottom: ${spacing[4]};
`

const StyledFormField = styled(FormField)`
  min-width: 200px;
  margin-bottom: 0;
`

const IconLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${spacing[1]};

  svg {
    font-size: 18px;
  }
`

const ToggleButton = styled.button<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: ${spacing[2]};
  padding: ${spacing[2]} ${spacing[3]};
  background-color: ${(props) => (props.active ? colors.black : colors.white)};
  color: ${(props) => (props.active ? colors.white : colors.black)};
  border: 1px solid
    ${(props) => (props.active ? colors.black : colors.gray[300])};
  border-radius: ${borderRadius.lg};
  cursor: pointer;
  transition: all ${transition.default};
  font-size: ${typography.fontSize.sm};

  &:hover {
    background-color: ${(props) =>
      props.active ? colors.gray[800] : colors.gray[50]};
    border-color: ${(props) =>
      props.active ? colors.gray[800] : colors.gray[400]};
  }

  svg {
    font-size: 20px;
  }
`

const ActiveFilters = styled.div`
  padding: ${spacing[3]} ${spacing[6]};
  border-top: 1px solid ${colors.gray[200]};
`
