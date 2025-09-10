import { useRef, ReactNode, useEffect } from 'react'

import { css } from '@emotion/react'
import styled from '@emotion/styled'
import CheckIcon from '@mui/icons-material/Check'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

export type DropdownOption<T = string> = {
  label: string
  value: T
  icon?: ReactNode
}

type DropdownProps<T = string> = {
  options: DropdownOption<T>[]
  selectedValue: T
  onSelect: (value: T) => void
  placeholder?: string
  title?: string
  icon?: ReactNode
  className?: string
  showCheckmark?: boolean
  fullWidth?: boolean
  absoluteDropdown?: boolean
  hasPadding?: boolean
}

export function Dropdown<T = string>({
  options,
  selectedValue,
  onSelect,
  placeholder = 'Select an option',
  title,
  icon,
  className,
  showCheckmark = true,
  fullWidth = false,
  absoluteDropdown = true,
  hasPadding = true,
}: DropdownProps<T>) {
  const detailsRef = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    if (!absoluteDropdown) {
      return
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (
        detailsRef.current &&
        !detailsRef.current.contains(event.target as Node)
      ) {
        detailsRef.current.open = false
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [absoluteDropdown])

  const handleSelect = (value: T) => {
    onSelect(value)
    if (detailsRef.current) {
      detailsRef.current.open = false
    }
  }

  const selectedOption = options.find((opt) => opt.value === selectedValue)
  const displayLabel = !!selectedOption?.value
    ? title || selectedOption?.label
    : placeholder

  return (
    <Container className={className} fullWidth={fullWidth}>
      <StyledDetails ref={detailsRef}>
        <StyledSummary hasPadding={hasPadding} absolute={absoluteDropdown}>
          {icon && <IconWrapper>{icon}</IconWrapper>}
          <LabelText>{displayLabel}</LabelText>
          <StyledExpandMoreIcon />
        </StyledSummary>
        <DropdownContainer absolute={absoluteDropdown}>
          {options.map((option, index) => (
            <DropdownItem
              key={index}
              onClick={() => handleSelect(option.value)}
              selected={selectedValue === option.value}
            >
              {option.icon && <IconWrapper>{option.icon}</IconWrapper>}
              <span>{option.label}</span>
              {showCheckmark && selectedValue === option.value && (
                <CheckIcon fontSize="inherit" />
              )}
            </DropdownItem>
          ))}
        </DropdownContainer>
      </StyledDetails>
    </Container>
  )
}

const Container = styled.div<{ fullWidth?: boolean }>`
  position: relative;
  display: inline-block;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
`

const StyledDetails = styled.details`
  position: relative;
  width: 100%;
`

const StyledSummary = styled.summary<{
  hasPadding?: boolean
  absolute?: boolean
}>`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1]};
  align-items: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.gray[700]};
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  list-style: none;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: background-color ${({ theme }) => theme.transition.fast};

  &::-webkit-details-marker {
    display: none;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }

  ${({ hasPadding, theme }) =>
    hasPadding &&
    css`
      padding: ${theme.spacing[4]} ${theme.spacing[3]};
    `}

  ${({ absolute, theme }) =>
    absolute === false &&
    css`
      details[open] > & {
        border-bottom: 1px solid ${theme.colors.gray[200]};
      }
    `}
`

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.gray[500]};

  svg {
    font-size: 18px;
  }
`

const LabelText = styled.span`
  flex: 1;
`

const StyledExpandMoreIcon = styled(ExpandMoreIcon)`
  margin-left: auto;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.gray[500]};
  transition: transform ${({ theme }) => theme.transition.default};

  details[open] & {
    transform: rotate(180deg);
  }
`

const DropdownContainer = styled.div<{ absolute?: boolean }>`
  ${({ absolute }) =>
    absolute &&
    css`
      position: absolute;
      top: calc(100% + 4px);
      right: 0;
      left: 0;
    `}
  z-index: 1000;
  min-width: 200px;
  max-height: ${({ absolute }) => (absolute ? '300px' : '0')};
  overflow: ${({ absolute }) => (absolute ? 'auto' : 'hidden')};
  pointer-events: ${({ absolute }) => (absolute ? 'none' : 'auto')};
  background-color: ${({ theme }) => theme.colors.white};
  ${({ absolute }) => absolute && 'box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);'}
  border: ${({ theme, absolute }) =>
    absolute ? `1px solid ${theme.colors.gray[200]}` : 'none'};
  opacity: ${({ absolute }) => (absolute ? '0' : '1')};
  transform: ${({ absolute }) => (absolute ? 'translateY(-8px)' : 'none')};
  transition: ${({ theme, absolute }) =>
    absolute
      ? `all ${theme.transition.default}`
      : `max-height ${theme.transition.default}`};

  details[open] & {
    ${({ absolute, theme }) =>
      absolute
        ? css`
            pointer-events: auto;
            border-radius: ${theme.borderRadius.md};
            opacity: 1;
            transform: translateY(0);
          `
        : css`
            max-height: 300px;
            overflow-y: auto;
          `}
  }
`

const DropdownItem = styled.button<{ selected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${({ theme }) => theme.spacing[3]} ${({ theme }) => theme.spacing[4]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray[700]};
  background: ${({ selected, theme }) =>
    selected ? theme.colors.primary + '40' : 'transparent'};
  transition: opacity ${({ theme }) => theme.transition.fast};

  &:hover {
    opacity: 0.7;
  }

  &:first-of-type {
    border-top: none;
  }

  ${IconWrapper} {
    flex-shrink: 0;
  }

  span {
    flex: 1;
  }
`
