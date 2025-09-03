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
  transition: all ${({ theme }) => theme.transition.fast};
  white-space: nowrap;
  list-style: none;

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
  margin-left: auto;
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: 18px;
  transition: transform ${({ theme }) => theme.transition.default};

  details[open] & {
    transform: rotate(180deg);
  }
`
