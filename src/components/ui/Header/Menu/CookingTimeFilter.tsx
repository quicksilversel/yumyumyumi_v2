'use client'

import { useRef } from 'react'

import styled from '@emotion/styled'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TimerIcon from '@mui/icons-material/Timer'
import { useRouter } from 'next/navigation'

const cookingTimeOptions = [
  { label: 'All', value: null },
  { label: 'Under 15 minutes', value: 15 },
  { label: 'Under 30 minutes', value: 30 },
  { label: 'Under 45 minutes', value: 45 },
  { label: 'Under 1 hour', value: 60 },
]

type Props = {
  selectedCookingTime: number | null
  setSelectedCookingTime: (time: number | null) => void
}

export const CookingTimeFilter = ({
  selectedCookingTime,
  setSelectedCookingTime,
}: Props) => {
  const router = useRouter()
  const detailsRef = useRef<HTMLDetailsElement>(null)

  const handleTimeSelect = (time: number | null) => {
    setSelectedCookingTime(time)
    if (time) {
      router.push(`/?maxCookingTime=${time}`)
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
          <TimerIcon />
          {selectedCookingTime
            ? cookingTimeOptions.find(
                (opt) => opt.value === selectedCookingTime,
              )?.label
            : 'Cooking Time'}
          <StyledExpandMoreIcon />
        </StyledSummary>
        <DropdownContainer>
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
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[3]};

  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.gray[700]};
  white-space: nowrap;
  transition: all ${({ theme }) => theme.transition.fast};
  height: 40px;
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
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

const StyledExpandMoreIcon = styled(ExpandMoreIcon)`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.gray[500]};
  transition: transform ${({ theme }) => theme.transition.default};
  margin-left: auto;

  details[open] & {
    transform: rotate(180deg);
  }
`
