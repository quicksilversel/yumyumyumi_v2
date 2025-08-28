'use client'

import { useRef } from 'react'

import styled from '@emotion/styled'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LocalDiningIcon from '@mui/icons-material/LocalDining'
import { useRouter } from 'next/navigation'

import { RecipeCategory } from '@/types'

const categories = Object.values(RecipeCategory)

type Props = {
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
}

export const CategoryFilter = ({
  selectedCategory,
  setSelectedCategory,
}: Props) => {
  const router = useRouter()
  const detailsRef = useRef<HTMLDetailsElement>(null)

  const handleCategorySelect = (category: string | null) => {
    setSelectedCategory(category)
    if (category) {
      router.push(`/?category=${category}`)
    } else {
      router.push('/')
    }

    // Close the dropdown
    if (detailsRef.current) {
      detailsRef.current.open = false
    }
  }

  return (
    <Container>
      <StyledDetails ref={detailsRef}>
        <StyledSummary>
          <LocalDiningIcon />
          {selectedCategory || 'Category'}
          <StyledExpandMoreIcon />
        </StyledSummary>
        <DropdownContainer>
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
      </StyledDetails>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  background-color: transparent;
  width: 100%;

  @media (max-width: 35.1875rem) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
`

const StyledDetails = styled.details`
  position: relative;
  width: 100%;
`

const StyledSummary = styled.summary`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};

  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  white-space: nowrap;
  transition: background-color ${({ theme }) => theme.transition.fast};
  height: 40px;
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }

  &:hover {
    background-color: rgba(245, 178, 172, 0.05);
  }

  svg {
    font-size: 18px;
    color: ${({ theme }) => theme.colors.gray[500]};
    transition: transform ${({ theme }) => theme.transition.default};
  }

  details[open] & {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};

    svg {
      color: ${({ theme }) => theme.colors.primary};
    }
  }
`

const DropdownContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadow.xl};
  min-width: 240px;
  max-height: 0;
  overflow: hidden;
  z-index: 1000;
  transition: max-height ${({ theme }) => theme.transition.default};

  details[open] & {
    max-height: 400px;
  }
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
`

const CheckMark = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`

const StyledExpandMoreIcon = styled(ExpandMoreIcon)`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.gray[500]};
  transition: transform ${({ theme }) => theme.transition.default};
  margin-left: auto;

  details[open] & {
    transform: rotate(180deg);
  }
`
