import { useRef } from 'react'

import styled from '@emotion/styled'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export type SortOption =
  | 'date-desc'
  | 'date-asc'
  | 'alphabetical'
  | 'cooktime-asc'
  | 'cooktime-desc'

const sortOptions: { label: string; value: SortOption }[] = [
  { label: '新しい順', value: 'date-desc' },
  { label: '古い順', value: 'date-asc' },
  { label: '名前順', value: 'alphabetical' },
  { label: '調理時間が短い順', value: 'cooktime-asc' },
  { label: '調理時間が長い順', value: 'cooktime-desc' },
]

type Props = {
  selectedSort: SortOption
  onSortChange: (sort: SortOption) => void
}

export const RecipeSortButton = ({ selectedSort, onSortChange }: Props) => {
  const detailsRef = useRef<HTMLDetailsElement>(null)

  const handleSortSelect = (sort: SortOption) => {
    onSortChange(sort)

    if (detailsRef.current) {
      detailsRef.current.open = false
    }
  }

  const currentLabel =
    sortOptions.find((opt) => opt.value === selectedSort)?.label ||
    'Newest First'

  return (
    <Container>
      <StyledDetails ref={detailsRef}>
        <StyledSummary>
          <SortText>{currentLabel}</SortText>
          <StyledExpandMoreIcon />
        </StyledSummary>
        <DropdownContainer>
          {sortOptions.map((option) => (
            <DropdownItem
              key={option.value}
              onClick={() => handleSortSelect(option.value)}
              selected={selectedSort === option.value}
            >
              {option.label}
              {selectedSort === option.value && <CheckMark>✓</CheckMark>}
            </DropdownItem>
          ))}
        </DropdownContainer>
      </StyledDetails>
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  display: inline-block;
`

const StyledDetails = styled.details`
  position: relative;
`

const StyledSummary = styled.summary`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transition.fast};
  white-space: nowrap;
  list-style: none;
  user-select: none;

  &::-webkit-details-marker {
    display: none;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.gray[400]};
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }
`

const SortText = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`

const StyledExpandMoreIcon = styled(ExpandMoreIcon)`
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: 20px;
`

const DropdownContainer = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  z-index: 1000;
  min-width: 200px;
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  opacity: 0;
  transform: translateY(-8px);
  pointer-events: none;
  transition: all ${({ theme }) => theme.transition.default};

  details[open] & {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
`

const DropdownItem = styled.button<{ selected?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};
  border: none;
  background: ${({ selected, theme }) =>
    selected ? theme.colors.primary + '10' : 'transparent'};
  color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : theme.colors.gray[700]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ selected, theme }) =>
    selected
      ? theme.typography.fontWeight.medium
      : theme.typography.fontWeight.normal};
  text-align: left;
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transition.fast};

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }

  &:first-of-type {
    border-top: none;
  }
`

const CheckMark = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`
