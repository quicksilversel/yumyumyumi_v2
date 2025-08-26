import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { colors, typography, spacing, borderRadius, transition } from '@/styles/designTokens'

export const Chip = styled.span<{
  variant?: 'filled' | 'outlined'
  size?: 'sm' | 'md'
  clickable?: boolean
  selected?: boolean
}>`
  display: inline-flex;
  align-items: center;
  gap: ${spacing[1]};
  border-radius: ${borderRadius.full};
  transition: all ${transition.default};
  white-space: nowrap;
  user-select: none;
  
  ${props => props.size === 'sm' ? css`
    padding: ${spacing[1]} ${spacing[2]};
    font-size: ${typography.fontSize.xs};
  ` : css`
    padding: ${spacing[2]} ${spacing[3]};
    font-size: ${typography.fontSize.sm};
  `}
  
  ${props => props.variant === 'outlined' ? css`
    background-color: transparent;
    border: 1px solid ${props.selected ? colors.black : colors.gray[300]};
    color: ${props.selected ? colors.black : colors.gray[700]};
  ` : css`
    background-color: ${props.selected ? colors.black : colors.gray[100]};
    color: ${props.selected ? colors.white : colors.gray[700]};
    border: 1px solid transparent;
  `}
  
  ${props => props.clickable && css`
    cursor: pointer;
    
    &:hover {
      ${props.variant === 'outlined' ? css`
        background-color: ${colors.gray[50]};
        border-color: ${colors.gray[400]};
      ` : css`
        background-color: ${props.selected ? colors.gray[800] : colors.gray[200]};
      `}
    }
    
    &:active {
      transform: scale(0.95);
    }
  `}
`

export const ChipGroup = styled.div<{
  gap?: keyof typeof spacing
}>`
  display: flex;
  flex-wrap: wrap;
  gap: ${props => spacing[props.gap || 2]};
`