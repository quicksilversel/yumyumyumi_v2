'use client'

import { useState, useRef, useEffect } from 'react'

import styled from '@emotion/styled'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LocalDiningIcon from '@mui/icons-material/LocalDining'
import SearchIcon from '@mui/icons-material/Search'
import TimerIcon from '@mui/icons-material/Timer'
import { useRouter, useSearchParams } from 'next/navigation'

import { useAuth } from '@/contexts/AuthContext'
import { RecipeCategory } from '@/types'

const categories = Object.values(RecipeCategory)

const cookingTimeOptions = [
  { label: 'All', value: null },
  { label: 'Under 15 minutes', value: 15 },
  { label: 'Under 30 minutes', value: 30 },
  { label: 'Under 45 minutes', value: 45 },
  { label: 'Under 1 hour', value: 60 },
]

type SearchAndFiltersProps = {
  onFiltersChange?: (filters: any) => void
}

export function SearchAndFilters({ onFiltersChange }: SearchAndFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category'),
  )
  const [selectedCookingTime, setSelectedCookingTime] = useState<number | null>(
    searchParams.get('maxCookingTime')
      ? Number(searchParams.get('maxCookingTime'))
      : null,
  )
  const [ingredientSearch, setIngredientSearch] = useState('')
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [showBookmarked, setShowBookmarked] = useState(
    searchParams.get('bookmarked') === 'true',
  )

  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const categoryRef = useRef<HTMLDivElement>(null)
  const timeRef = useRef<HTMLDivElement>(null)
  const ingredientRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node

      if (categoryRef.current && !categoryRef.current.contains(target)) {
        if (openDropdown === 'category') setOpenDropdown(null)
      }
      if (timeRef.current && !timeRef.current.contains(target)) {
        if (openDropdown === 'time') setOpenDropdown(null)
      }
      if (ingredientRef.current && !ingredientRef.current.contains(target)) {
        if (openDropdown === 'ingredient') setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openDropdown])

  const updateFilters = () => {
    const params = new URLSearchParams()

    if (searchTerm) params.set('search', searchTerm)
    if (selectedCategory) params.set('category', selectedCategory)
    if (selectedCookingTime)
      params.set('maxCookingTime', selectedCookingTime.toString())
    if (selectedIngredients.length > 0) {
      params.set('ingredients', selectedIngredients.join(','))
    }
    if (showBookmarked) params.set('bookmarked', 'true')

    const queryString = params.toString()
    router.push(`/?${queryString}`)

    onFiltersChange?.({
      searchTerm,
      category: selectedCategory,
      maxCookingTime: selectedCookingTime,
      ingredients: selectedIngredients,
      showBookmarkedOnly: showBookmarked,
    })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters()
  }

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category)
    setOpenDropdown(null)
    // Immediately update filters when category changes
    const params = new URLSearchParams(searchParams)
    if (category) {
      params.set('category', category)
    } else {
      params.delete('category')
    }
    router.push(`/?${params.toString()}`)
  }

  const handleTimeSelect = (time: number | null) => {
    setSelectedCookingTime(time)
    setOpenDropdown(null)
    // Immediately update filters when time changes
    const params = new URLSearchParams(searchParams)
    if (time) {
      params.set('maxCookingTime', time.toString())
    } else {
      params.delete('maxCookingTime')
    }
    router.push(`/?${params.toString()}`)
  }

  const handleAddIngredient = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && ingredientSearch.trim()) {
      e.preventDefault()
      const newIngredient = ingredientSearch.trim()
      if (!selectedIngredients.includes(newIngredient)) {
        const newIngredients = [...selectedIngredients, newIngredient]
        setSelectedIngredients(newIngredients)
        setIngredientSearch('')

        // Update filters immediately
        const params = new URLSearchParams(searchParams)
        params.set('ingredients', newIngredients.join(','))
        router.push(`/?${params.toString()}`)
      }
    }
  }

  const handleRemoveIngredient = (ingredient: string) => {
    const newIngredients = selectedIngredients.filter((i) => i !== ingredient)
    setSelectedIngredients(newIngredients)

    // Update filters immediately
    const params = new URLSearchParams(searchParams)
    if (newIngredients.length > 0) {
      params.set('ingredients', newIngredients.join(','))
    } else {
      params.delete('ingredients')
    }
    router.push(`/?${params.toString()}`)
  }

  const handleBookmarkToggle = () => {
    if (!user) {
      // Optionally show a message that user needs to sign in
      return
    }
    const newValue = !showBookmarked
    setShowBookmarked(newValue)

    // Update filters immediately
    const params = new URLSearchParams(searchParams)
    if (newValue) {
      params.set('bookmarked', 'true')
    } else {
      params.delete('bookmarked')
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <FilterContainer>
      <SearchWrapper>
        <SearchIcon style={{ fontSize: 20 }} />
        <form onSubmit={handleSearchSubmit} style={{ flex: 1 }}>
          <SearchInput
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </SearchWrapper>

      <div style={{ position: 'relative' }} ref={categoryRef}>
        <FilterButton
          onClick={() =>
            setOpenDropdown(openDropdown === 'category' ? null : 'category')
          }
          active={!!selectedCategory}
        >
          <LocalDiningIcon />
          {selectedCategory || 'Category'}
          <ExpandMoreIcon />
        </FilterButton>
        <DropdownContainer open={openDropdown === 'category'}>
          <DropdownItem
            onClick={() => handleCategorySelect(null)}
            selected={!selectedCategory}
          >
            All Categories
            {!selectedCategory && <CheckMark>✓</CheckMark>}
          </DropdownItem>
          {categories.map((category) => (
            <DropdownItem
              key={category}
              onClick={() => handleCategorySelect(category)}
              selected={selectedCategory === category}
            >
              {category}
              {selectedCategory === category && <CheckMark>✓</CheckMark>}
            </DropdownItem>
          ))}
        </DropdownContainer>
      </div>

      <div style={{ position: 'relative' }} ref={timeRef}>
        <FilterButton
          onClick={() =>
            setOpenDropdown(openDropdown === 'time' ? null : 'time')
          }
          active={!!selectedCookingTime}
        >
          <TimerIcon />
          {selectedCookingTime
            ? cookingTimeOptions.find(
                (opt) => opt.value === selectedCookingTime,
              )?.label
            : 'Cooking Time'}
          <ExpandMoreIcon />
        </FilterButton>
        <DropdownContainer open={openDropdown === 'time'}>
          {cookingTimeOptions.map((option) => (
            <DropdownItem
              key={option.label}
              onClick={() => handleTimeSelect(option.value)}
              selected={selectedCookingTime === option.value}
            >
              {option.label}
              {selectedCookingTime === option.value && <CheckMark>✓</CheckMark>}
            </DropdownItem>
          ))}
        </DropdownContainer>
      </div>

      <div style={{ position: 'relative' }} ref={ingredientRef}>
        <FilterButton
          onClick={() =>
            setOpenDropdown(openDropdown === 'ingredient' ? null : 'ingredient')
          }
          active={selectedIngredients.length > 0}
        >
          <LocalDiningIcon />
          {selectedIngredients.length > 0
            ? `${selectedIngredients.length} ingredients`
            : 'Ingredients'}
          <ExpandMoreIcon />
        </FilterButton>
        <DropdownContainer open={openDropdown === 'ingredient'}>
          {selectedIngredients.length > 0 && (
            <SelectedIngredients>
              {selectedIngredients.map((ingredient) => (
                <IngredientChip key={ingredient}>
                  {ingredient}
                  <button
                    onClick={() => handleRemoveIngredient(ingredient)}
                    style={{
                      marginLeft: '0.25rem',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    ×
                  </button>
                </IngredientChip>
              ))}
            </SelectedIngredients>
          )}
          <IngredientInput
            type="text"
            placeholder="Type ingredient and press Enter"
            value={ingredientSearch}
            onChange={(e) => setIngredientSearch(e.target.value)}
            onKeyDown={handleAddIngredient}
          />
        </DropdownContainer>
      </div>

      {user && (
        <FilterButton onClick={handleBookmarkToggle} active={showBookmarked}>
          {showBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          Bookmarked
        </FilterButton>
      )}
    </FilterContainer>
  )
}

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  background-color: transparent;
  width: 100%;
`

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: 0 ${({ theme }) => theme.spacing[3]};
  flex: 1;
  max-width: 400px;
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  height: 40px;
  transition: all ${({ theme }) => theme.transition.fast};

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px rgba(245, 178, 172, 0.1);
  }
`

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.gray[800]};
  background: transparent;
  height: 100%;

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }
`

const FilterButton = styled.button<{ active?: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid
    ${({ active, theme }) =>
      active ? theme.colors.primary : theme.colors.gray[300]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.gray[700]};
  white-space: nowrap;
  transition: all ${({ theme }) => theme.transition.fast};
  height: 40px;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: rgba(245, 178, 172, 0.05);
  }

  svg {
    font-size: 18px;
    color: ${({ active, theme }) =>
      active ? theme.colors.primary : theme.colors.gray[500]};
  }
`

const DropdownContainer = styled.div<{ open: boolean }>`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.spacing[2]});
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadow.xl};
  min-width: 240px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  opacity: ${({ open }) => (open ? 1 : 0)};
  visibility: ${({ open }) => (open ? 'visible' : 'hidden')};
  transform: translateX(-50%)
    translateY(${({ open }) => (open ? '0' : '-10px')});
  transition: all ${({ theme }) => theme.transition.default};
`

const DropdownItem = styled.button<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  background: ${({ selected, theme }) =>
    selected ? theme.colors.gray[50] : 'transparent'};
  border: none;
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[800]};
  text-align: left;
  transition: background-color ${({ theme }) => theme.transition.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }

  &:first-of-type {
    border-radius: ${({ theme }) => theme.borderRadius.lg}
      ${({ theme }) => theme.borderRadius.lg} 0 0;
  }

  &:last-of-type {
    border-radius: 0 0 0.5rem 0.5rem;
  }
`

const CheckMark = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`

const IngredientInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  width: calc(100% - ${({ theme }) => theme.spacing[6]});

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const IngredientChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing[1]} ${({ theme }) => theme.spacing[2]};
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  margin: ${({ theme }) => theme.spacing[1]};
`

const SelectedIngredients = styled.div`
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`
