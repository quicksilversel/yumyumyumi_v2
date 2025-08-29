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
  width: 100%;
  background-color: transparent;

  @media (width <= 35.1875rem) {
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
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  width: 100%;
  height: 40px;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transition.fast};
  white-space: nowrap;
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }

  &:hover {
    background-color: rgb(245, 178, 172, 5%);
  }

  svg {
    color: ${({ theme }) => theme.colors.gray[500]};
    font-size: 18px;
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
  z-index: 1000;
  min-width: 240px;
  max-height: 0;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background-color: ${({ theme }) => theme.colors.white};
  transition: max-height ${({ theme }) => theme.transition.default};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow.xl};

  details[open] & {
    max-height: 400px;
  }
`

const DropdownItem = styled.button<{ selected?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  border: none;
  background: ${({ selected, theme }) =>
    selected ? theme.colors.gray[50] : 'transparent'};
  color: ${({ theme }) => theme.colors.gray[800]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-align: left;
  cursor: pointer;
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
  margin-left: auto;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: 18px;
  transition: transform ${({ theme }) => theme.transition.default};

  details[open] & {
    transform: rotate(180deg);
  }
`
