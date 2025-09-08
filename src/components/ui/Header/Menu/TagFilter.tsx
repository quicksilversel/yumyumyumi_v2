import { useRef, useEffect, useState } from 'react'

import styled from '@emotion/styled'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import { useRouter } from 'next/navigation'

import { getAllTagsFromRecipes } from '@/lib/supabase/tables/recipe/getAllTagsFromRecipes/getAllTagsFromRecipes'

type Props = {
  selectedTag: string | null
  setSelectedTag: (tag: string | null) => void
}

export const TagFilter = ({ selectedTag, setSelectedTag }: Props) => {
  const router = useRouter()
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tags = await getAllTagsFromRecipes()
        setAvailableTags(tags)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch tags:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTags()
  }, [])

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag)
    if (tag) {
      router.push(`/?tag=${encodeURIComponent(tag)}`)
    } else {
      router.push('/')
    }

    if (detailsRef.current) {
      detailsRef.current.open = false
    }
  }

  const tagOptions = [
    { label: 'すべて', value: null },
    ...availableTags.map((tag) => ({ label: tag, value: tag })),
  ]

  return (
    <Container>
      <StyledDetails ref={detailsRef}>
        <StyledSummary>
          <LocalOfferIcon />
          {selectedTag || 'タグから探す'}
          <StyledExpandMoreIcon />
        </StyledSummary>
        <DropdownContainer>
          {isLoading ? (
            <LoadingItem>Loading tags...</LoadingItem>
          ) : tagOptions.length === 1 ? (
            <EmptyItem>No tags available</EmptyItem>
          ) : (
            tagOptions.map((option) => (
              <DropdownItem
                key={option.value || 'all'}
                onClick={() => handleTagSelect(option.value)}
                selected={selectedTag === option.value}
              >
                {option.label}
                {selectedTag === option.value && <CheckMark>✓</CheckMark>}
              </DropdownItem>
            ))
          )}
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
  height: 40px;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transition.fast};
  transition-property: border-color, box-shadow, max-height, background-color;
  white-space: nowrap;
  list-style: none;
  user-select: none;

  &::-webkit-details-marker {
    display: none;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: rgb(245, 178, 172, 5%);
  }

  svg {
    color: ${({ theme }) => theme.colors.gray[500]};
    font-size: 18px;
    transition: transform ${({ theme }) => theme.transition.default};
  }

  details[open] & {
    border-color: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.white};
    background-color: ${({ theme }) => theme.colors.primary};

    svg {
      color: ${({ theme }) => theme.colors.white};
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

  details[open] & {
    max-height: 400px;
    overflow-y: auto;
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

  &:first-of-type {
    border-radius: ${({ theme }) => theme.borderRadius.lg}
      ${({ theme }) => theme.borderRadius.lg} 0 0;
  }

  &:last-of-type {
    border-radius: 0 0 0.5rem 0.5rem;
  }
`

const LoadingItem = styled.div`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-align: center;
`

const EmptyItem = styled.div`
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-align: center;
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
